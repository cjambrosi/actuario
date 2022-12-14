const gulp = require('gulp');
const fs = require('fs');
const less = require('gulp-less');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const nodemon = require('gulp-nodemon');
const uglifycss = require('gulp-uglifycss');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();

let reload = browserSync.reload;

const sources = function () {
  const jsonFile = './gulpfile.json';

  try {
    return JSON.parse(fs.readFileSync(jsonFile));
  } catch (err) {
    console.log('Error parsing JSON string:', err);
    return;
  }
}

function libScript() {
  return gulp.src(sources().lib.js)
    .pipe(concat('lib.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(sources().path.js));
}

function libStyle() {
  return gulp.src(sources().lib.css)
    .pipe(concat('lib.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(sources().path.css));
}

function script() {
  return gulp.src(sources().js)
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(sources().path.js));
}

function style() {
  return gulp.src(sources().less)
    .pipe(concat('bundle.css'))
    .pipe(less())
    .pipe(uglifycss({
      'maxLineLen': 300,
      'uglyComments': false
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(sources().path.css))
    .pipe(browserSync.stream());
}

function server(done) {
  let called = false;
  return nodemon({
    script: sources().server.server_file,
    ignore: [sources().server.ignore]
  }).on('start', function () {
    if (!called) {
      called = true;
      done();
    }
  })
}

function browserSyncServer() {
  browserSync.init({
    proxy: sources().server.url,
    port: sources().server.port,
    notify: true
  });
}

function watchFile () {
  gulp.watch(sources().watch.less, style);
  gulp.watch(sources().watch.html).on('change', reload);
  gulp.watch(sources().watch.js, script).on('change', reload);
  gulp.src(sources().path.js + 'bundle.min.js')
    .pipe(notify({ message: 'Gulp is Watching. Happy Coding!' }));
}

exports.libScript = libScript;
exports.libStyle = libStyle;
exports.style = style;
exports.script = script;
exports.server = server;
exports.watchFile = watchFile;
exports.browserSyncServer = browserSyncServer;

gulp.task('dev', gulp.series(libStyle, style, libScript, script, server));
gulp.task('default', gulp.parallel('dev', watchFile, browserSyncServer));