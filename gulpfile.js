let gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    spritesmith  = require('gulp.spritesmith'),
    plumber      = require('gulp-plumber'),
    sourcemaps   = require('gulp-sourcemaps'),
    rename       = require("gulp-rename"),
    rimraf       = require('rimraf'),
    //browserSync  = require('browser-sync'),
    browserSync  = require('browser-sync').create(),
    reload       = browserSync.reload;
let pug          = require('gulp-pug'),
    csso         = require('gulp-csso'),
    livereload   = require('gulp-livereload'),
    concat       = require('gulp-concat'),
    babel        = require('gulp-babel'),
    svgo         = require('gulp-svgo'),
    html2jade    = require('gulp-html2jade'),
    deleteLines  = require('gulp-delete-lines'),
    postcss      = require("gulp-postcss"),
    autoprefixer = require('autoprefixer'),
    mqpacker     = require('css-mqpacker'),
    pxtorem      = require('postcss-pxtorem'),
    uglify       = require('gulp-uglify'),
    path         = require('path'),
    runSequence  = require('run-sequence');

//  ######### svg sprite #########
let svgSprite = require('gulp-svg-sprite'),
    svgmin    = require('gulp-svgmin'),
    cheerio   = require('gulp-cheerio'),
    replace   = require('gulp-replace');
//  ######### !svg sprite #########

// let gcmq         = require('gulp-group-css-media-queries');
// let cache        = require('gulp-cached');
// let autoprefixer = require('gulp-autoprefixer');
// let shorthand    = require('gulp-shorthand');
// let cssnano      = require('gulp-cssnano');
// let pxtorem      = require('gulp-pxtorem');
// let prettify = require('gulp-pug-prettify');
// let htmlbeautify = require('gulp-pug-beautify');
// let svgmin    = require('gulp-svgmin');
//let clean     = require('gulp-clean');
// let deletefile = require('gulp-delete-file');
//let html2pug  = require('gulp-html2pug');
//let customProperties = require("postcss-custom-properties");
//let cssvariables = require('postcss-css-variables');

let paths = {
  js    : './src/js/',
  libs  : './src/vendor/',
  images: './src/img/',
  svg   : './src/svg/',
  fonts : './src/fonts/',
  sass  : './src/scss/',
  pug   : './src/pug/',
  dest  : {
    root: './build/'
  }
};

let sources = {
  jsSrc      : function() {
    let scripts = [
      paths.js + 'header.js',
      paths.js + 'nav-menu.js',
      paths.js + 'swiper.js',
      paths.js + 'magnific-popup.js',
      paths.js + 'gallery.js',
      paths.js + 'catalog.js',
      paths.js + 'svg-cache.js',
      paths.js + 'browser-updater.js'
    ];
    return gulp.src(scripts)
  },
  libsJsSrc  : function() {
    let libs = [
      paths.libs + 'jquery/dist/jquery.min.js',
      paths.libs + 'swiper/dist/js/swiper.min.js',
      paths.libs + 'imagelightbox/dist/imagelightbox.min.js',
      paths.libs + 'magnific-popup/dist/jquery.magnific-popup.min.js'
    ];
    return gulp.src(libs)
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
      paths.libs + 'swiper/dist/css/swiper.min.css',
      paths.libs + 'imagelightbox/dist/imagelightbox.min.css',
      paths.libs + 'magnific-popup/dist/magnific-popup.css'
    ])
  },
  pugSrc     : function() {
    return gulp.src([
      paths.pug + '*.pug', '!' + paths.pug + '_*.pug'
    ])
  }
};

//clean build folder
gulp.task('cleanBuildDir', function(cb) {
  //rimraf('build/', cb);
  rimraf(paths.dest.root, cb);
});

gulp.task('js', function() {
  sources.jsSrc()
         .pipe(plumber())
         .pipe(sourcemaps.init())
         .pipe(babel({presets: ['es2015', 'es2016']}))
         .pipe(concat('scripts.js', {newLine: '\n\r'}))
         .pipe(uglify())
         .pipe(sourcemaps.write('.'))
         .pipe(plumber.stop())
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'js'))
  //.pipe(reload({stream: true}));
  ;
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
         .pipe(plumber())
         .pipe(concat('libs.js'))
         .pipe(plumber.stop())
         .pipe(gulp.dest(paths.dest.root + 'js/'))
  //.pipe(reload({stream: true}));
  ;
});

gulp.task('sass', function() {
  let plugins = [
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
         .pipe(gulp.dest(paths.dest.root + 'css'))
  //.pipe(reload({stream: true}));
  ;
});

gulp.task('libsSass', function() {

  sources.libsSassSrc()
         .pipe(plumber())
         .pipe(concat('libs.css'))
         .pipe(csso())
         .pipe(plumber.stop())
         .pipe(gulp.dest(paths.dest.root + 'css'))
  //.pipe(reload({stream: true}));
  ;
});

gulp.task('pug', function() {
  //let locals = {
  //  pretty        : true,
  //  "indent_size" : 2,
  //  "indent_char" : " ",
  //  "eol"         : "\n",
  //  "indent_level": 0,
  //  "extra_liners": 'span'
  //};
  ////sources.pugSrc()
  //return gulp.src('./src/pug/*.pug')
  //           .pipe(plumber())
  //           .pipe(pug({locals: locals}))
  //           //.on('error', console.log)
  //           .pipe(plumber.stop())
  //           .pipe(gulp.dest(paths.dest.root))
  //           //.pipe(reload({stream: true}))
  //           //.pipe(reload({stream: true}))
  //            ;

  return gulp.src('./src/pug/*.pug')
             //.pipe(cache('linting'))
             .pipe(plumber())
             .pipe(pug({pretty: true}))
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.dest.root))
             .pipe(reload({stream: true}));
});

//gulp.task('pug', function buildHTML() {
//
//  return gulp.src('./pug/*.pug')
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
//             //    let a = $('a');
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

gulp.task('img', function() {
  sources.imgSrc()
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'img'))
  //.pipe(reload({stream: true}));
  ;
});

gulp.task('fonts', function() {
  sources.fontsSrc()
         //.on('error', console.log)
         .pipe(gulp.dest(paths.dest.root + 'fonts'))
  //.pipe(reload({stream: true}));
  ;
});

//  ######### svg sprite #########
gulp.task('svg', function() {
  return gulp.src(paths.svg + '*.svg')
             .pipe(plumber())
             // minify svg
             .pipe(svgmin({
               js2svg: {
                 pretty: true
               }
             }))
             // remove all fill and style declarations in out shapes
             .pipe(cheerio({
               run          : function($) {
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
                   sprite : '../sprite.svg',
                   render : {
                     scss: {
                       dest    : '../../scss/_svg-sprite.scss',
                       template: paths.sass + 'templates/_sprite_template.scss'
                     }
                   },
                   example: true
                 }
               }
             }))
             .pipe(plumber.stop())
             .pipe(gulp.dest(paths.images))
      //.pipe(reload({stream: true}));
      ;
});
//  ######### !svg sprite #########

gulp.task('default', ['pug', 'sass', 'js', 'img', 'svg', 'fonts', 'libsJs', 'libsSass', 'watch', 'browserSync']);

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: paths.dest.root
    },
    //files : [
    //  //paths.app + '**/*.*',
    //  paths.dest.root + '*.html'
    //],
    port  : 3000,
    open  : true,
    notify: false,
    ui: false
    //,
    //ui    : {port: 8001}
  });
});

gulp.task('watch', function() {
  livereload.listen({
    port: 2999
  });

  //gulp.watch([paths.images + '**/*.*'], ['img']);
  //gulp.watch([paths.svg + '**/*.*'], ['svg']);
  //gulp.watch([paths.fonts + '**/*.*'], ['fonts']);
  gulp.watch(['./src/pug/**/*.pug'], ['pug']);
  gulp.watch(['./src/scss/**/*.scss'], ['sass']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
  //gulp.watch(['./build/*.html']).on("change", reload);
});

//gulp.task('watch', function() {
//  livereload.listen({
//    port: 3009
//  });
//
//  //gulp.watch('./img/sprite.svg', ['svg2pug']);
//  //gulp.watch('./source/svg/*.svg', ['svgo']);
//  gulp.watch('./pug/**/**/*.pug', ['pug']);
//  gulp.watch('./pug/components/**/*.pug', ['pug']);
//  //gulp.watch('./source/png/**/*.png', ['sprite']);
//  gulp.watch('./scss/**/**/*.scss', ['sass']);
//  //gulp.watch('./postcss/**/*.css', ['css']);
//  gulp.watch('./js-src/**/**/*.js', ['js']);
//  //gulp.watch('./js-coffee/**/*.coffee', ['coffee']);
//});
//
//gulp.task('default', ['pug', 'sprite', 'sass', 'js', 'browserSync', 'watch']);

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
//      .pipe(gulp.dest('./pug/svg'));
//});

//gulp.task('sprite', function() {
//  let spriteData = gulp.src('./source/png/*.png')
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



