
# Lambda Video Processor 📹

Lambda Video is a serverless application for processing video files using AWS Lambda, FFmpeg, and Gulp. This project demonstrates how to efficiently handle video processing tasks in a scalable, cost-effective manner with a focus on speed and modularity.

---

## 🚀 Features

- **Serverless Architecture**: Built on AWS Lambda for scalability and cost efficiency.
- **Video Processing**: Supports operations like transcoding, resizing, and format conversion using FFmpeg.
- **Optimized Lambda Layer**: Includes a prebuilt FFmpeg binary for fast execution.
- **Event-Driven Design**: Triggered by S3 events to process uploaded video files automatically.
- **Task Automation with Gulp**: Streamlined development workflows using Gulp.

---

## 🛠️ Technologies

- **AWS Lambda**: Core of the serverless execution.
- **Amazon S3**: For input/output video file storage.
- **FFmpeg**: For video processing tasks.
- **Node.js**: Backend runtime environment.
- **Gulp**: Task automation for building and deploying the project.

---

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Gunzerker/lambda_video.git
   cd lambda_video
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Gulp CLI globally** (if not already installed):
   ```bash
   npm install -g gulp-cli
   ```

4. **Build the project with Gulp**:
   ```bash
   gulp build
   ```

5. **Set up AWS CLI**:  
   Ensure the AWS CLI is installed and configured with appropriate permissions for Lambda and S3.

6. **Deploy to AWS**:
   Use the [Serverless Framework](https://www.serverless.com/) or AWS SAM to deploy the application:
   ```bash
   serverless deploy
   ```

---

## ⚙️ Configuration

1. Update the `serverless.yml` file:
   - **Bucket Name**: Specify the input and output S3 buckets.
   - **Environment Variables**: Configure FFmpeg options, video formats, or resolutions.

2. Ensure the Lambda execution role has permissions for:
   - Reading and writing to S3.
   - Logging to CloudWatch.

---

## 🖥️ Usage

1. Upload a video file to the **input S3 bucket**.
2. The Lambda function is automatically triggered.
3. Processed video files are saved to the **output S3 bucket**.

---

## 🧪 Testing

- **Local Testing**: Use the `serverless-offline` plugin to simulate AWS Lambda locally:
  ```bash
  serverless offline
  ```
- **Unit Testing**: Run the tests to validate video processing logic:
  ```bash
  npm test
  ```

---

## 📄 Gulp Tasks

The project includes Gulp tasks for automation:

- **Build**: Compile and package the Lambda function:
  ```bash
  gulp build
  ```

- **Clean**: Remove old build files:
  ```bash
  gulp clean
  ```

- **Deploy**: Deploy the project to AWS using Serverless:
  ```bash
  gulp deploy
  ```

Customize the `gulpfile.js` to add more tasks as needed.

---

## 📝 Notes

- The FFmpeg binary is included as a Lambda Layer for lightweight deployment.
- Ensure the Lambda timeout is sufficient for processing large video files.

---

## 📖 Resources

- [AWS Lambda Documentation](https://aws.amazon.com/lambda/)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Serverless Framework](https://www.serverless.com/framework/docs/)
- [Gulp Documentation](https://gulpjs.com/docs/en/getting-started/quick-start)

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
