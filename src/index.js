const ffmpeg = require("fluent-ffmpeg");
const mime = require("mime");
const fs = require("fs")
const AWS = require("aws-sdk");
AWS.config.loadFromPath("./src/config.json");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const uploadParams = { Bucket: "xxxxxxx", Key: "", Body: "" };

function uploadMedia(path , key) {
  return new Promise(async (resolve, reject) => {
    try {
      // Configure the file stream and obtain the upload parameters
      var fileStream = fs.readFileSync(path);

      uploadParams.Body = fileStream;
      uploadParams.Key = key;
      console.log(uploadParams.Key);
      uploadParams.ACL = "public-read";
      uploadParams.ContentType = mime.getType(path); // => 'text/plain'

      // call S3 to retrieve upload file to specified bucket
      const upload = await s3.upload(uploadParams).promise();
      console.log(upload.Location);
      return resolve(upload.Location);
    } catch (err) {
      return reject(err);
    }
  });
}

async function applyFilterVideo (url , key , filter) {
  return new Promise((resolve,reject)=> {
     ffmpeg(url)
     .inputOption(["-hwaccel cuda","-c:v h264_cuvid"])
     .videoFilters(
        `curves=psfile=./filters/${filter}.acv`
      )
      .output("./filtred-" + key)
      //.outputOptions("-c:v h264_nvenc")
      .on("start", function (commandLine) {
        console.log(commandLine)
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      })
      .on("progress", function (progress) {
        console.log(progress)
      })
      .on("end", async function () {
        console.log("done filter apply")
        let path = "./filtred-" + key;
        let s3_key = "filtred-" + key;
        //let returned_url = await uploadMedia(path, s3_key);
        //return resolve({url:returned_url,key:s3_key , path})
        return resolve("done")
      }).run()
  })
}

async function resizeVideo (url , key) {
  // resize the outputed video
  return new Promise ((resolve,reject)=> {
      ffmpeg(url)
        .autopad(true)
        .size("?x1280")
        .output("./resized-" + key)
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
        })
        .on("progress", function (progress) {
          console.log(progress)
        })
        .on("end", async function () {
          console.log("Finished processing");
          //upload to s3
          console.log("resized-key",key)
          let path = "./resized-" + key;
          let s3_key = "resized-" + key;
          let returned_url = await uploadMedia(path, s3_key);
          return resolve({ url: returned_url, key: s3_key ,path });
          // get the thumbnail from the end video
        })
        .run();
  })
}

async function thumbnailVideo (path , key) {
  return new Promise ((resolve,reject)=>{
     ffmpeg(path)
              .on("filenames", function (filenames) {
                console.log("Will generate " + "thumbnail-");
              })
              .on("error", function (err) {
                console.log("An error occurred: " + err.message);
                //return reject(err);
              })
              .on("end", async function () {
                console.log("Screenshots taken");
                let path =
                  "./thumbnail-" + key.replace(".mp4", ".jpeg");
                let s3_key = "thumbnail-" + key.replace(".mp4", ".jpeg");
                let returned_url = await uploadMedia(path, s3_key);
                return resolve({ url: returned_url, key: s3_key, path });
              })
              .screenshots({
                timestamps: ["00:00.01"],
                filename: "thumbnail-" + key.replace(".mp4", ".jpeg"),
                folder:"./"
                //size:"1280x720"
              });
  })
}

async function frame(payload) {
    return new Promise (async(resolve,reject)=>{
      const { url, key, filter } = payload;
      console.log(payload)
      let result_filtred_video;
      let result_resized_video;
      let result_thumbnail_video;
      try{
        if (filter === "original") {
          result_resized_video = await resizeVideo(url, key);
          result_thumbnail_video = await thumbnailVideo(
            result_resized_video.path,
            key
          );
          fs.unlinkSync(result_resized_video.path);
          fs.unlinkSync(result_thumbnail_video.path);
        } else {
          result_resized_video = await resizeVideo(
            url,
            key
          );
          result_filtred_video = await applyFilterVideo(
            result_resized_video.path,
            key,
            filter
          );
          result_thumbnail_video = await thumbnailVideo(
            result_resized_video.path,
            key
          );
  
          fs.unlinkSync(result_filtred_video.path);
          fs.unlinkSync(result_resized_video.path);
          fs.unlinkSync(result_thumbnail_video.path);
        }
        return resolve({
          result_resized_video,
          result_thumbnail_video,
        });
      }catch(err){
        console.log(err)
        reject (err)
      }
    })
    }

exports.handler = async (data) => {
    // parse the data
    const parsed_data = data
    let promise_array = []
    for (let i = 0; i < parsed_data.videos_urls.length; i++) {
        parsed_result = {
          key: parsed_data.keys[i],
          url: parsed_data.videos_urls[i],
          filter: parsed_data.filters_urls[i],
        };
        promise_array.push(applyFilterVideo(parsed_data.videos_urls[i],parsed_data.keys[i],parsed_data.filters_urls[i]))
      }
      await Promise.all(promise_array)
    return {
        appVersion: 1.0,
        data
    };
};
