// generated on 2016-08-11 using generator-chrome-extension 0.6.0
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import {stream as wiredep} from 'wiredep';
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var isChrome = !!argv.chrome || (!argv.firefox && !argv.edge);
var isFirefox = !!argv.firefox && !isChrome;
var isEdge = !!argv.edge && !(isChrome || isFirefox);

const $ = gulpLoadPlugins();

gulp.task('extras', () => {
  var srcs = [
    'app/_locales/**',
    'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
    'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
    'app/bower_components/bootstrap/dist/fonts/**',
    'app/bower_components/font-awesome/css/font-awesome.min.css',
    'app/bower_components/font-awesome/fonts/**',
    'app/downloaded_libs/jquery/jquery.min.js',
    'app/scripts/*.js'
  ];
  if (isEdge) {
    srcs.push('app/background.html');
    srcs.push('app/*APIBridge.js');
  }
  return gulp.src(srcs, {
    base: 'app',
    dot: true
  }).pipe(gulp.dest('dist'));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task('lint', lint('app/scripts/**/*.js', {
  env: {
    es6: true
  }
}));

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('html',  () => {
  return gulp.src('app/dialogs/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.sourcemaps.init())
    // uglify doesn't seem to support ES6 syntax (arrow functions)
    //.pipe($.if('*.js', $.uglify())).on('error', gutil.log)
    .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
    .pipe($.sourcemaps.write())
    .pipe($.if('*.html', $.htmlmin({removeComments: true, collapseWhitespace: true})))
    .pipe(gulp.dest('dist/dialogs'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['lint', 'html'], () => {
  $.livereload.listen();

  gulp.watch([
    'app/**/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json'
  ]).on('change', $.livereload.reload);

  gulp.watch('app/scripts/**/*.js', ['lint']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('wiredep', () => {
  gulp.src('app/**/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('package', function () {
  var manifest = require('./dist/manifest.json');
  return gulp.src('dist/**')
      .pipe($.zip('CG Spunk-' + manifest.version + '.zip'))
      .pipe(gulp.dest('package'));
});

gulp.task('manifestJson', () => {
  gulp.src('app/manifest.json')
    .pipe($.mergeJson({
      fileName: 'manifest.json',
      edit: (parsedJson, file) => {
        if (!isFirefox && !!parsedJson.applications) {
          delete parsedJson.applications;
        }
        if (isEdge) {
          parsedJson.background = {
            page: 'background.html',
            persistent: true
          };
        } else {
          if (!!parsedJson['-ms-preload']) {
            delete parsedJson['-ms-preload'];
          }
          var chromeReloadIndex =
            parsedJson.background.scripts.indexOf('scripts/chromereload.js');
          if (chromeReloadIndex > -1) {
            parsedJson.background.scripts.splice(chromeReloadIndex, 1);
          }
        }
        return parsedJson;
      }
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', (cb) => {
  runSequence(
    'clean', 'lint', 'manifestJson',
    ['html', 'images', 'extras'],
    'size', cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence('build', cb);
});
