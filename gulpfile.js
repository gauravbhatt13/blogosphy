/*jshint strict:false */
/*jshint node:true */

var gulp       = require('gulp'),
  browserSync  = require('browser-sync').create(),
  del          = require('del'),
  minifyCss    = require('gulp-minify-css'),
  ngAnnotate   = require('gulp-ng-annotate'),
  autoprefixer = require('gulp-autoprefixer'),
  reload       = browserSync.reload,
  replace      = require('gulp-replace'),
  rev          = require('gulp-rev'),
  runSequence  = require('run-sequence'),
  sourcemaps   = require('gulp-sourcemaps'),
  uglify       = require('gulp-uglify'),
  usemin       = require('gulp-usemin'),
  sass         = require('gulp-sass');
  nodemon      = require('gulp-nodemon');


var sassFiles = './public/assets/sass/**/*.{scss,sass}';
var cssFiles = './public/assets/css';
var cssBuildFiles = './build/assets/css';
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compact'
};
var sassDistOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed'
};
var autoprefixerOptions = {
  browsers: ['last 2 versions']
};

gulp.task('sass', function () {
  return gulp
    .src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write()) // inline sourcemaps
    .pipe(gulp.dest(cssFiles))
    .pipe(browserSync.stream({match: '**/*.css'}));
});
gulp.task('sass-build', function () {
  return gulp
    .src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write()) // inline sourcemaps
    .pipe(gulp.dest(cssFiles))
    .pipe(gulp.dest(cssBuildFiles));
});


//usemin
gulp.task('usemin', function() {
  gulp.src('./public/index.html')
    .pipe(usemin({
      css: [minifyCss, rev],
      vendorjs: [uglify({
        mangle: true
      }), rev],
      appjs: [
        replace('debug: true', 'debug: false'),
        ngAnnotate({
          remove: true,
          add: true,
          single_quotes: true
        }),
        uglify({
          mangle: true
        }),
        rev
      ]
    }))
    .pipe(gulp.dest('./build'));
});


//copy modules
gulp.task('copy:modules', [], function() {
  gulp.src([
      './public/modules/**/*.*',
      '!./public/modules/**/*.js'
    ])
    .pipe(gulp.dest('./build/modules'));
});


//copy core data json
gulp.task('copy:json-core-data', [], function() {
  gulp.src([
      './public/core/data/**/*.json'
    ])
    .pipe(gulp.dest('./build/core/data/'));
});


//copy fonts
gulp.task('copy:fonts', [], function() {
  gulp.src([
      './public/assets/fonts/*',
      './public/bower_components/bootstrap/dist/fonts/*',
      './public/bower_components/pb-design-system/dist/fonts/*',
    ])
    .pipe(gulp.dest('./build/assets/fonts'));
});


//copy images
gulp.task('copy:images', [], function() {
  gulp.src([
      './public/assets/images/**/*'
    ])
    .pipe(gulp.dest('./build/assets/images'));
});

//copy vendor
gulp.task('copy:vendor-dev', [], function() {
  gulp.src([
    './node_modules/ng-quill/dist/*'
  ])
    .pipe(gulp.dest('./public/vendor/ng-quill'))

  gulp.src([
    './node_modules/quill/dist/**/*'
  ])
    .pipe(gulp.dest('./public/vendor/quill'));
});

//copy vendor build
gulp.task('copy:vendor-build', [], function() {
  gulp.src([
    './node_modules/ng-quill/dist/**/*'
  ])
    .pipe(gulp.dest('./build/vendor/ng-quill'))

  gulp.src([
    './node_modules/quill/dist/**/*'
  ])
    .pipe(gulp.dest('./build/vendor/quill'));
});

// browser-sync task for starting the server.
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000", // port of node server
    port: 3003
  });
});


// run from the build folder
gulp.task('serve-build', [], function() {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
});


//build
gulp.task('build', [], function() {
  runSequence(
    'sass-build',
    'usemin',
    'copy:modules',
    'copy:images',
    'copy:fonts',
    'copy:json-core-data'
  );
});


// run this to open project in browser and watch for changes in CSS
gulp.task('default', ['watch'], function() {});

// Watch
gulp.task('watch', ['browser-sync', 'copy:vendor-dev'], function() {
  gulp.watch(['public/assets/sass/**/*.scss', 'public/modules/**/*.scss'], {interval: 500}, ['sass']);
  gulp.watch(['public/core/**/*.js', 'public/modules/**/*.js', 'public/core/**/*.json'], {interval: 500}, reload);
  gulp.watch(['public/core/**/*.html', 'public/modules/**/*.html'], {interval: 500}, reload);
});

gulp.task('nodemon', function (cb) {
  var callbackCalled = false;
  return nodemon({
    script: './bin/www',
    watch: [
      'routes/',
      'modules/'
    ],
    ext: 'js,json',
    nodeArgs: ['--inspect']
  }).on('start', function () {
    if (!callbackCalled) {
      callbackCalled = true;
      cb();
    }
  });
});
