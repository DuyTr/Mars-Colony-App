'use strict';

var gulp = require('gulp'); // Load Gulp!
var autoprefixer = require('gulp-autoprefixer');
var historyApiFallback = require('connect-history-api-fallback');

// Now that we've installed the uglify package
// we can require it!

var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

gulp.task('scss', function () {
  gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
         browsers: ['last 2 versions']
      }))
    .pipe(gulp.dest('./css'));
});


// create browser
gulp.task('newbrowser', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            middleware: [ historyApiFallback() ]
        }
    });


// make browser reload on change
   gulp.watch('./scss/**/*.scss', ['scss']);
   gulp.watch(['*.html','js/*.js','css/*.css']).on('change', browserSync.reload);


});
