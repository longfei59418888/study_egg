/* no-eslint */
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');


gulp.task('clean', function () {
  return gulp.src(['./dist', './indialoan/dist', './output'], { read: false })
    .pipe(rimraf({ force: true }));
});
gulp.task('copy2', function () {
  console.log('---创建dist文件');
  return gulp.src(['./source/**/*'])
    .pipe(gulp.dest('./indialoan/dist'));
});
gulp.task('copy', function () {
  console.log('---创建dist文件');
  return gulp.src(['./source/**/*'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('zip', function () {
  var name = 'output_' + new Date().getTime() + '.zip';
  console.log(name)
  fs.writeFileSync(path.join(__dirname, './upgrade/pkgName.txt'), name, 'utf-8');
  return gulp.src('./source/**/*')
    .pipe(zip(name))
    .pipe(gulp.dest(path.join(__dirname, './output')));
});

gulp.task('build', function () {
  console.log('---创建dist文件');
  runSequence('clean', 'copy', 'copy2', 'zip');
});

