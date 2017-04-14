var gulp         = require('gulp');
var sass         = require('gulp-sass');
var spritesmith  = require('gulp.spritesmith');
var plumber      = require('gulp-plumber');
var sourcemaps   = require('gulp-sourcemaps');
var rename       = require("gulp-rename");
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
browserSync      = require('browser-sync').create();
var pug          = require('gulp-pug');
var csso         = require('gulp-csso');
var livereload   = require('gulp-livereload');
var concat       = require('gulp-concat');
var babel        = require('gulp-babel');
var svgo         = require('gulp-svgo');
var svgSprite    = require('gulp-svg-sprite');
var cheerio      = require('gulp-cheerio');
var replace      = require('gulp-replace');
var html2jade    = require('gulp-html2jade');
var deleteLines  = require('gulp-delete-lines');
var postcss      = require("gulp-postcss");
var autoprefixer = require('autoprefixer');
var mqpacker     = require('css-mqpacker');
var pxtorem      = require('postcss-pxtorem');
var uglify       = require("gulp-uglify");
var path         = require('path');
var runSequence  = require('run-sequence');

// var gcmq         = require('gulp-group-css-media-queries');
// var cache        = require('gulp-cached');
// var autoprefixer = require('gulp-autoprefixer');
// var shorthand    = require('gulp-shorthand');
// var cssnano      = require('gulp-cssnano');
// var pxtorem      = require('gulp-pxtorem');
// var prettify = require('gulp-html-prettify');
// var htmlbeautify = require('gulp-html-beautify');
// var svgmin    = require('gulp-svgmin');
//var clean     = require('gulp-clean');
// var deletefile = require('gulp-delete-file');
//var html2pug  = require('gulp-html2pug');
//var customProperties = require("postcss-custom-properties");
//var cssvariables = require('postcss-css-variables');

var paths = {
  js    : './app/js/',
  images: './app/img/',
  fonts : './app/fonts/',
  sass  : './app/scss/',
  pug   : './app/html/',
  dest  : {
    root: './public/'
  }
};

var sources = {
  jsSrc      : function() {
    var scripts = [paths.js + 'main.js'];
    return gulp.src(scripts)
  },
  libsJsSrc  : function() {
    return gulp.src([
      '/vendor/jquery/dist/jquery.min.js',
      '/vendor/swiper/dist/js/swiper.min.js',
      '/vendor/imagelightbox/dist/imagelightbox.min.js',
      '/vendor/magnific-popup/dist/jquery.magnific-popup.min.js'
    ])
  },
  imgSrc     : function() {
    return gulp.src([
      paths.images + '**/*.png',
      paths.images + '**/*.jpg',
      paths.images + '**/*.gif',
      paths.images + '**/*.jpeg',
      paths.images + '**/*.svg',
      paths.images + '**/*.ico'
    ])
  },
  fontsSrc   : function() {
    return gulp.src([
      paths.fonts + '**/*.woff2',
      paths.fonts + '**/*.woff',
      paths.fonts + '**/*.ttf',
      paths.fonts + '**/*.eot'
    ])
  },
  sassSrc    : function() {
    return gulp.src([paths.sass + 'style.scss'])
  },
  libsSassSrc: function() {
    return gulp.src([
      '/vendor/swiper/dist/css/swiper.min.css',
      '/vendor/imagelightbox/dist/imagelightbox.min.css',
      '/vendor/magnific-popup/dist/magnific-popup.css'
    ])
  },
  pugSrc     : function() {
    return gulp.src([
      paths.pug + '*.pug'
    ])
  }
};

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./"
    },
    port  : 3009,
    open  : true,
    notify: false
  });
});

gulp.task('js', function() {

  sources.jsSrc()
         //.pipe(concat('main.js'))
         .pipe(plumber())
         .pipe(sourcemaps.init())
         .pipe(babel({presets: ['es2015', 'es2016']}))
         .pipe(concat('scripts.js', {newLine: '\n\r'}))
         .pipe(uglify())
         .pipe(sourcemaps.write('.'))
         .pipe(plumber.stop())
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'js'));
});

/*gulp.task('js', function() {
  gulp.src('./js-src/!*.js')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel({presets: ['es2015', 'es2016']}))
      .pipe(concat('scripts.js', {newLine: '\n\r'}))
      .pipe(sourcemaps.write('.'))
      .pipe(plumber.stop())
      .pipe(gulp.dest('./js'))
      .pipe(reload({stream: true}));
});*/

gulp.task('libsJs', function() {
  sources.libsJsSrc()
         .pipe(concat('libs.js'))
         //.pipe(uglify())
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'js'));
});

gulp.task('sass', function() {
  var plugins = [
    //atImport,
    //mixins,
    //customProperties,
    //nested,
    //simpleVars,
    //minmax,
    //cssvariables,
    //csscomb(csscombOptions),
    pxtorem({
      rootValue        : 10,
      mediaQuery       : false,
      minPixelValue    : 0,
      selectorBlackList: [],
      //replace          : true,
      //propList: []
    }),
    mqpacker({sort: true}),
    autoprefixer({browsers: ['last 4 versions', 'ie > 9', 'and_chr >= 2.3']})
  ];
  sources.sassSrc()
         .pipe(plumber())
         .pipe(sourcemaps.init())
         .pipe(sass({
           //outputStyle : 'compressed'
           //,
           //includePaths: ['node_modules/susy/sass']
         }))
         .pipe(postcss(plugins))
         .pipe(rename({suffix: ".min"}))
         .pipe(csso())
         .pipe(sourcemaps.write('.'))
         //.pipe(autoprefixer())
         .pipe(plumber.stop())
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'css'));
});

//.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
//gulp.task('sass', function() {
//
//  return gulp.src('./scss/**/*.scss')
//             .pipe(plumber())
//             .pipe(sourcemaps.init())
//             .pipe(sass().on('error', sass.logError))
//             .pipe(postcss(plugins))
//             .pipe(rename({suffix: ".min"}))
//             .pipe(csso())
//             .pipe(sourcemaps.write('.'))
//             .pipe(plumber.stop())
//             .pipe(gulp.dest('./css'))
//             .pipe(reload({stream: true}));
//});

gulp.task('libsSass', function() {

  sources.libsSassSrc()
         .pipe(concat('libs.css'))
         .pipe(sass())
         //.pipe(autoprefixer())
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'css'));
});

gulp.task('pug', function() {

  //var locals = {};

  var locals = {
    pretty        : true,
    "indent_size" : 2,
    "indent_char" : " ",
    "eol"         : "\n",
    "indent_level": 0,
    "extra_liners": 'span'
  };

  sources.pugSrc()
         .pipe(plumber())
         .pipe(pug({locals: locals}))
         //.on('error', console.log)
         .pipe(plumber.stop())
         .pipe(gulp.dest(paths.dest.root));
});

//gulp.task('html', function buildHTML() {
//
//  return gulp.src('./html/*.pug')
//             .pipe(plumber())
//             .pipe(pug({pretty: true}))
//             //.pipe(pug())
//             //.pipe(prettify({
//             //  indent_char: ' ',
//             //  indent_size: 2,
//             //  "unformatted": ['li']
//             //}))
//             //.pipe(cheerio({
//             //  run          : function($) {
//             //    var a = $('a');
//             //    for (i in a) {
//             //      a[i] = '\n' + toString(a[i]);
//             //    }
//             //  },
//             //  parserOptions: {xmlMode: false}
//             //}))
//             .pipe(plumber.stop())
//             .pipe(gulp.dest('./'))
//             .pipe(reload({stream: true}));
//});

gulp.task('images', function() {
  sources.imgSrc()
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'images'));
});

gulp.task('fonts', function() {
  sources.fontsSrc()
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'fonts'));
});

gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: paths.dest.root
    },
    files : [
      paths.app + '**/*.*',
      paths.dest.root + '**/*.*'
    ],
    port  : 8000,
    ui    : {port: 8001}
  });
});

gulp.task('compile', ['pug', 'sass', 'js', 'images', 'fonts', 'libsJs', 'libsSass']);
//gulp.task('compile', ['pug', 'sass', 'js', 'images', 'fonts']);

gulp.task('default', function() {
  runSequence('watch', 'server');
});

gulp.task('watch', ['compile'], function() {
  gulp.watch([paths.images + '**/*.*'], ['img'], reload({stream: true}));
  gulp.watch([paths.fonts + '**/*.*'], ['fonts'], reload({stream: true}));
  gulp.watch([paths.pug + '**/*.pug'], ['pug'], reload({stream: true}));
  gulp.watch([paths.sass + '**/*.scss'], ['sass'], reload({stream: true}));
  gulp.watch([paths.js + '**/*.js'], ['js'], reload({stream: true}));
});

// Таск делает из svg-спрайта файл jade/pug
//gulp.task('h2j', function() {
//  gulp.src('./img/sprite.svg')
//      .pipe(html2jade({
//        nspaces : 2,
//        bodyless: true
//      }))
//      // удалить строку svg
//      .pipe(deleteLines({
//        'filters': [
//          /svg/i
//        ]
//      }))
//      // удалить строку svg
//      .pipe(deleteLines({
//        'filters': [
//          /  /i
//        ]
//      }))
//      // добавить префикс и изменить расширение файла
//      .pipe(rename({
//        prefix : "_",
//        extname: ".pug"
//      }))
//      .pipe(gulp.dest('./html/svg'));
//});

//gulp.task('svgo', function() {
//  gulp.src('./source/svg/**/*.svg')
//      .pipe(plumber())
//      // делаем спрайт
//      .pipe(svgo())
//      // удаляем все атрибуты fill, style, stroke и теги стилей
//      .pipe(cheerio({
//        run          : function($) {
//          $('[fill]').removeAttr('fill');
//          $('[stroke]').removeAttr('stroke');
//          $('[class]').removeAttr('class');
//          $('[style]').removeAttr('style');
//          $('style').remove('style');
//        },
//        parserOptions: {xmlMode: true}
//      }))
//      // cheerio plugin create unnecessary string '&gt;', so replace it.
//      .pipe(replace('&gt;', '>'))
//      // build svg sprite
//      .pipe(svgSprite({
//        mode: {
//          symbol: {
//            sprite: '../img/sprite.svg',
//            render: {
//              scss: {
//                dest    : '../scss/_svg-sprite.scss',
//                template: './scss/templates/_sprite_template.scss'
//              }
//            }
//          }
//        }
//      }))
//      .pipe(plumber.stop())
//      .pipe(gulp.dest('.'))
//      .pipe(reload({stream: true}));
//});

//gulp.task('sprite', function() {
//  var spriteData = gulp.src('./source/png/*.png')
//                       .pipe(spritesmith({
//                         imgName  : 'sprite.png',
//                         cssName  : '_sprite.scss',
//                         cssFormat: 'css',
//                         padding  : 10
//                       }));
//
//  spriteData.img.pipe(gulp.dest('./img'));
//  spriteData.css.pipe(gulp.dest('./scss'));
//});

//gulp.task('watch', function() {
//  livereload.listen({
//    port: 3009
//  });
//
//  //gulp.watch('./img/sprite.svg', ['svg2pug']);
//  //gulp.watch('./source/svg/*.svg', ['svgo']);
//  gulp.watch('./html/**/**/*.pug', ['html']);
//  gulp.watch('./html/components/**/*.pug', ['html']);
//  //gulp.watch('./source/png/**/*.png', ['sprite']);
//  gulp.watch('./scss/**/**/*.scss', ['sass']);
//  //gulp.watch('./postcss/**/*.css', ['css']);
//  gulp.watch('./js-src/**/**/*.js', ['js']);
//  //gulp.watch('./js-coffee/**/*.coffee', ['coffee']);
//});
//
//gulp.task('default', ['html', 'sprite', 'sass', 'js', 'browserSync', 'watch']);

