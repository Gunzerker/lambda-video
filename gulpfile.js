'use strict';
require('dotenv').config();
var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var install = require('gulp-install');
var runSequence = require('gulp4-run-sequence');

var pkg = require('./package.json');

var packageFile = pkg.name + '_' + pkg.version + '_' + '.zip';

gulp.task('clean', async () => {
  return del(['./dist', './build']);
});

gulp.task('js', async () => {
  return gulp.src('./src/*.js')
    .pipe(gulp.dest('build/'));
});

gulp.task('env', async () => {
  return gulp.src('.env')
    .pipe(gulp.dest('build/'));
});

gulp.task('filters', async () => {
    return gulp.src('filters/*')
      .pipe(gulp.dest('build/filters'));
  });

  gulp.task('config', async () => {
    return gulp.src('./src/*.json')
      .pipe(gulp.dest('build/src'));
  });
  
gulp.task('node-mods', async () => {
  return gulp.src('./package.json')
    .pipe(gulp.dest('build/'))
    .pipe(install({production: true}));
});

gulp.task('zip', async () => {
  return gulp.src(['build/**/*', '!build/package.json'], {
      dot: true
    })
    .pipe(zip(packageFile))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', async (callback) =>  {
  return await runSequence(
    ['clean'],
    ['js', 'env', 'filters', 'config' , 'node-mods'],
    callback
  );
});
