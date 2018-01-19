'use strict';

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const gulp         = require('gulp'),
      plumber      = require('gulp-plumber'),
      sourcemaps   = require('gulp-sourcemaps'),
      rename       = require('gulp-rename'),
      pug          = require('gulp-pug'),
      sass         = require('gulp-sass'),
      htmlPrettify = require('gulp-html-prettify'),
      concat       = require('gulp-concat'),
      babel        = require('gulp-babel'),
      uglify       = require('gulp-uglify'),
      svgo         = require('gulp-svgo'),
      svgSprite    = require('gulp-svg-sprite'),
      cheerio      = require('gulp-cheerio'),
      replace      = require('gulp-replace'),
      //rimraf       = require('rimraf'),
      browserSync  = require('browser-sync').create(),
      //reload       = browserSync.reload;
      //livereload = require('gulp-livereload'),
      debug        = require('gulp-debug'),
      csso         = require('gulp-csso'),
      postcss      = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      mqpacker     = require('css-mqpacker'),
      pxtorem      = require('postcss-pxtorem'),
      gulpIf       = require('gulp-if'),
      del          = require('del'),
      //path = require('path'),
      //cached = require('gulp-cached'),
      newer        = require('gulp-newer'), // gulp-changed
      notify       = require('gulp-notify'),
      eslint       = require('gulp-eslint'),
      fs           = require('fs'),
      combine      = require('stream-combiner2').obj,
      through2     = require('through2').obj;

const paths = {
  js:     './src/js/',
  libs:   './src/vendor/',
  images: './src/img/',
  svg:    './src/svg/',
  fonts:  './src/fonts/',
  sass:   './src/scss/',
  pug:    './src/pug/',
  dest:   {
    root: './build/'
  }
};

const sources = {
  jsSrc:       [
    paths.js + 'header.js',
    paths.js + 'nav-menu.js',
    paths.js + 'swiper.js',
    paths.js + 'magnific-popup.js',
    paths.js + 'gallery.js',
    paths.js + 'catalog.js',
    paths.js + 'svg-cache.js',
    paths.js + 'browser-updater.js'
  ],
  libsJsSrc:   [
    paths.libs + 'jquery/dist/jquery.min.js',
    paths.libs + 'swiper/dist/js/swiper.min.js',
    paths.libs + 'imagelightbox/dist/imagelightbox.min.js',
    paths.libs + 'magnific-popup/dist/jquery.magnific-popup.min.js'
  ],
  imgSrc:      paths.images + '**/*.{png,jpg,jpeg,gif,svg,ico}',
  fontsSrc:    paths.fonts + '**/*.{woff,woff2,ttf, eot}',
  sassSrc:     paths.sass + 'style.scss',
  libsSassSrc: [
    paths.libs + 'swiper/dist/css/swiper.min.css',
    paths.libs + 'imagelightbox/dist/imagelightbox.min.css',
    paths.libs + 'magnific-popup/dist/magnific-popup.css',
    paths.libs + 'normalize-css/normalize.css'
  ],
  pugSrc:      [paths.pug + '*.pug', '!' + paths.pug + '_*.pug']

};

gulp.task('pug', function() {

  return gulp.src(sources.pugSrc)
             .pipe(plumber())
             .pipe(pug({pretty: true}))
             .pipe(htmlPrettify({indent_char: ' ', indent_size: 2}))
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.dest.root));

});

gulp.task('sass', function() {
  const AUTOPREFIXER_BROWSERS = [
    'last 2 versions',
    'ie >= 10',
    'android >= 4.4'
  ];

  const POSTCSS_PLUGINS = [
    pxtorem({
              rootValue:         10,
              mediaQuery:        false,
              minPixelValue:     0,
              selectorBlackList: []
            }),
    mqpacker({sort: true}),
    autoprefixer({browsers: AUTOPREFIXER_BROWSERS})
  ];

  return gulp.src(sources.sassSrc)
             .pipe(debug())
             .pipe(plumber(notify.onError(function(err) {
               return {
                 title:   'SCSS',
                 message: err.message
               };
             })))
             .pipe(gulpIf(isDevelopment, sourcemaps.init()))
             .pipe(sass({}))
             .pipe(debug({title: 'sass'}))
             .pipe(postcss(POSTCSS_PLUGINS))
             .pipe(debug({title: 'postcss'}))
             .pipe(rename({suffix: '.min'}))
             .pipe(gulpIf(!isDevelopment, csso()))
             .pipe(debug({title: 'csso'}))
             .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
             .pipe(plumber.stop())
             //.on('error', console.log)
             .pipe(debug())
             .pipe(gulp.dest(paths.dest.root + 'css'));
});

gulp.task('libsCss', function() {

  return gulp.src(sources.libsSassSrc)
             .pipe(plumber())
             .pipe(concat('libs.css'))
             .pipe(csso())
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.dest.root + 'css'));
});

gulp.task('js', function() {
  return gulp.src(sources.jsSrc)
             .pipe(plumber())
             .pipe(sourcemaps.init())
             .pipe(babel({presets: ['env']}))
             .pipe(concat('scripts.js', {newLine: '\n\r'}))
             .pipe(uglify())
             .pipe(sourcemaps.write('.'))
             .pipe(plumber.stop())
             //.on('error', console.log)
             .pipe(gulp.dest(paths.dest.root + 'js'));
});

gulp.task('libsJs', function() {
  return gulp.src(sources.libsJsSrc)
             .pipe(plumber())
             .pipe(concat('libs.js'))
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.dest.root + 'js/'));
});

gulp.task('lint', function() {

  let eslintResults = {};

  let cacheFilePath = process.cwd() + '/tmp/lintCache.json';

  try {
    eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
  } catch (e) {
  }

  return gulp.src([paths.js + '**/*.js', '!node_modules/**'], {read: false})
             //.pipe(debug({title: 'src'}))
             .pipe(gulpIf(
               function(file) {
                 return eslintResults[file.path] && eslintResults[file.path].mtime == file.stat.mtime.toJSON();
               },
               through2(function(file, enc, callback) {
                 file.eslint = eslintResults[file.path].eslint;
                 callback(null, file);
               }),
               combine(
                 through2(function(file, enc, callback) {
                   file.contents = fs.readFileSync(file.path);
                   callback(null, file);
                 }),
                 eslint(),
                 //debug({title: 'eslint'}),
                 through2(function(file, enc, callback) {
                   eslintResults[file.path] = {
                     eslint: file.eslint,
                     mtime:  file.stat.mtime
                   };
                   callback(null, file);
                 })
               )
             ))
             .pipe(eslint.format())
             .on('end', function() {
               fs.writeFileSync(cacheFilePath, JSON.stringify((eslintResults)));
             })
             .pipe(eslint.failAfterError());

});

gulp.task('img', function() {
  return gulp.src(sources.imgSrc)
             .pipe(gulp.dest(paths.dest.root + 'img'));
});

gulp.task('fonts', function() {
  return gulp.src(sources.fontsSrc)
             .pipe(gulp.dest(paths.dest.root + 'fonts'));
});

//  ######### svg sprite #########
gulp.task('svg', function() {
  return gulp.src(paths.svg + '*.svg')
             .pipe(plumber())
             // minify svg
             //.pipe(svgmin({
             //  js2svg: {
             //    pretty: true
             //  }
             //}))
             .pipe(svgo({
                          js2svg: {
                            indent: 2, // optional, default is 4
                            pretty: true
                          }
                        }))
             // remove all fill and style declarations in out shapes
             .pipe(cheerio({
                             run:           function($) {
                               $('[fill]').removeAttr('fill');
                               $('[stroke]').removeAttr('stroke');
                               $('[style]').removeAttr('style');
                             },
                             parserOptions: {xmlMode: true}
                           }))
             // cheerio plugin create unnecessary string '&gt;', so replace it.
             .pipe(replace('&gt;', '>'))
             // build svg sprite
             .pipe(svgSprite({
                               mode: {
                                 symbol: {
                                   sprite:  '../sprite.svg',
                                   render:  {
                                     scss: {
                                       dest:     '../../scss/_svg-sprite.scss',
                                       template: paths.sass + 'templates/_sprite_template.scss'
                                     }
                                   },
                                   example: true
                                 }
                               }
                             }))
             .pipe(replace('<?xml version="1.0" encoding="utf-8"?>', ''))
             .pipe(cheerio({
                             run:           function($) {
                               $('[xmlns]').removeAttr('xmlns');
                               $('svg').css('display', 'none');
                             },
                             parserOptions: {xmlMode: true}
                           }))
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.images));
});
//  ######### !svg sprite #########

//clean build folder
/*gulp.task('cleanBuildDir', function(cb) {
 rimraf(paths.dest.root, cb);
 });*/

//clean build folder
gulp.task('clean', function() {
  return del(paths.dest.root);
});

gulp.task('copy', function() {
  return gulp.src('./src/**/*.*')
             .pipe(gulp.dest(paths.dest.root));
});

gulp.task('assets', function() {
  return gulp.src(paths.fonts + '**/*.*', {since: gulp.lastRun('assets')})
             .pipe(newer(paths.dest.root))
             .pipe(debug({title: 'assets'}))
             .pipe(gulp.dest(paths.dest.root));
});

gulp.task('watch', function() {
  gulp.watch(paths.pug + '**/*.pug', gulp.series('pug'));
  gulp.watch(paths.sass + '**/*.scss', gulp.series('sass'));
  gulp.watch(paths.js + '**/*.js', gulp.series('js'));
});

gulp.task('serve', function() {
  browserSync.init({
                     server: {
                       baseDir: paths.dest.root
                     },
                     port:   3000,
                     open:   true,
                     notify: false,
                     ui:     false
                     //,
                     //ui    : {port: 8001}
                   });

  browserSync.watch(paths.dest.root + '**/*.*').on('change', browserSync.reload);
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('pug', 'sass', 'js', 'img', 'svg', 'fonts', 'libsCss', 'libsJs')
));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));