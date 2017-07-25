var ngrok = require('ngrok');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('style', function () {
  return gulp
    .src(['./src/assets/css/*.css'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('templates', function() {
  return gulp.src(['./src/*.html'])
    .pipe(plumber())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('template-watch',['templates'], function(){
  browserSync.reload();
  return;
});

gulp.task('script', function () {
  return gulp.src('./src/assets/js/*.js')
    .pipe(plumber())
    .pipe(gulp.dest('./dist/assets/js/'))
});

gulp.task('script-watch',['script'], function(){
  browserSync.reload();
  return;
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/",
            port: 3002
        },
        reloadDelay: 500
    },function(err,bs){
      if(err){
        console.log(err);
      }
      ngrok.connect(bs.options.get('port'), function (err, url) {
        console.log("[NGROK] Ngrok URL: "+url);
      });
    });
});

gulp.task('watch', function() {
  gulp.watch([ './src/*.html'],['template-watch']);
  gulp.watch([ './src/assets/css/*.css'], ['style']);
  gulp.watch(['./src/assets/js/*.js'], ['script-watch']);
});

gulp.task('default',['templates','style','script','browser-sync','watch']);
