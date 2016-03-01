'use strict';
var require;
var gulp = require("gulp");
var gutil = require("gulp-util");

// image optim .........................................
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// ccs build ...........................................
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

// utils ...............................................
var del = require('del');
var fileinclude = require('gulp-file-include');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

// =================================================================================
// clean dist folder
gulp.task('clean', function () {
  return del(['dist/**/*']);
});

// compile + minify scss, move to dist/static
gulp.task('scss-build', function () {
  return gulp.src(['dev/compile/styles/**/*.scss'])
  .pipe(sass({
    errLogToConsole: true
  }))
  .pipe(autoprefixer('last 3 versions'))
  .pipe(minifyCSS({compatibility:'ie8'}))
  .pipe(gulp.dest('dist/static/css'))
  .pipe(reload({stream: true}));
});

// move static assets folder to dist as is
gulp.task('move', function () {
  gulp.src(['./dev/static/**/*'])
  .pipe(gulp.dest('./dist/static'))
  .pipe(reload({stream: true}));
});

// move html files to dist
gulp.task('html', function () {
  gulp.src(['./dev/*.html'])
  .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
  .pipe(gulp.dest('./dist'))
  .pipe(reload({stream: true}));
});

// compress and move static images
gulp.task('img', function () {
  gulp.src(['./dev/static/img{,/**}'])
  .pipe(imagemin({use: [pngquant()]}))
  .pipe(gulp.dest('./dist/static'))
  .pipe(reload({stream: true}));
});

// run webpack with webpack.config.js
gulp.task("webpack", function(callback) {
    var devCompiler = webpack(webpackConfig);
    // run webpack
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("default", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    })
    // .pipe(reload({stream: true}));
});



// =================================================================================
// default task
gulp.task('default', ['build', 'serve']);
// setup local server
gulp.task('serve', function(){
    runSequence(['serve']);
});
// build
gulp.task('build', function(callback) {
    runSequence('clean','html','move','img','scss-build','webpack');
});
// local server
gulp.task('serve', function () {
    gulp.task('build');
    browserSync.init({
        server: {
            baseDir: ['dist']
        },
    });

    gulp.watch(['dev/**/*.html'], ['html']);
    gulp.watch(['dev/compile/styles/**/*.scss'], ['scss-build']);
    gulp.watch(['dev/static/img/*'], ['img']);
    gulp.watch(['dev/static/**/*'], ['move']);
    gulp.watch(['dev/**/*'], ['webpack'], reload);
});
