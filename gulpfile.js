var gulp        = require('gulp');
var sass        = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var plumber     = require('gulp-plumber');
var sourcemaps  = require('gulp-sourcemaps');
// var gcmq         = require('gulp-group-css-media-queries');
var rename      = require("gulp-rename");
// var cache        = require('gulp-cached');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
//var autoprefixer = require('gulp-autoprefixer');
var pug         = require('gulp-pug');
// var shorthand    = require('gulp-shorthand');
// var cssnano      = require('gulp-cssnano');
var csso         = require('gulp-csso');
var livereload   = require('gulp-livereload');
//var pxtorem      = require('gulp-pxtorem');
var concat       = require('gulp-concat');
var babel        = require('gulp-babel');
var htmlbeautify = require('gulp-html-beautify');
//var prettify = require('gulp-html-prettify');

var svgo      = require('gulp-svgo');
// var svgmin    = require('gulp-svgmin');
var svgSprite = require('gulp-svg-sprite');
var cheerio   = require('gulp-cheerio');
var replace   = require('gulp-replace');
//var clean     = require('gulp-clean');
// var deletefile = require('gulp-delete-file');

//var html2pug  = require('gulp-html2pug');
var html2jade   = require('gulp-html2jade');
var deleteLines = require('gulp-delete-lines');

var postcss      = require("gulp-postcss");
var autoprefixer = require('autoprefixer');
var cssvariables = require('postcss-css-variables');
//var customProperties = require("postcss-custom-properties");
var mqpacker     = require('css-mqpacker');
var pxtorem      = require('postcss-pxtorem');

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

//gulp.task('clean-svg', function() {
//  return gulp.src('./img/sprite.svg', {read: false})
//             .pipe(clean());
//});

//gulp.task('deletefile', function() {
//  gulp.src('./img/sprite.svg')
//      .pipe(deletefile())
//});

//gulp.task('pug', function() {
//  // Backend locales
//  return gulp.src('./img/sprite.svg')
//             .pipe(html2pug())
//             .pipe(gulp.dest('./html'));
//});

// Таск делает из svg-спрайта файл jade/pug
gulp.task('h2j', function() {
  gulp.src('./img/sprite.svg')
      .pipe(html2jade({
        nspaces : 2,
        bodyless: true
      }))
      // удалить строку svg
      .pipe(deleteLines({
        'filters': [
          /svg/i
        ]
      }))
      // удалить строку svg
      .pipe(deleteLines({
        'filters': [
          /  /i
        ]
      }))
      // добавить префикс и изменить расширение файла
      .pipe(rename({
        prefix : "_",
        extname: ".pug"
      }))
      .pipe(gulp.dest('./html/svg'));
});

gulp.task('svgo', function() {
  gulp.src('./source/svg/**/*.svg')
      .pipe(plumber())
      // делаем спрайт
      .pipe(svgo())
      // удаляем все атрибуты fill, style, stroke и теги стилей
      .pipe(cheerio({
        run          : function($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[class]').removeAttr('class');
          $('[style]').removeAttr('style');
          $('style').remove('style');
        },
        parserOptions: {xmlMode: true}
      }))
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe(replace('&gt;', '>'))
      // build svg sprite
      .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: '../img/sprite.svg',
            render: {
              scss: {
                dest    : '../scss/_svg-sprite.scss',
                template: './scss/templates/_sprite_template.scss'
              }
            }
          }
        }
      }))
      .pipe(plumber.stop())
      .pipe(gulp.dest('.'))
      .pipe(reload({stream: true}));
});

gulp.task('sprite', function() {
  var spriteData = gulp.src('./source/png/*.png')
                       .pipe(spritesmith({
                         imgName  : 'sprite.png',
                         cssName  : '_sprite.scss',
                         cssFormat: 'css',
                         padding  : 10
                       }));

  spriteData.img.pipe(gulp.dest('./img'));
  spriteData.css.pipe(gulp.dest('./scss'));
});

//.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
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
  return gulp.src('./scss/**/*.scss')
             .pipe(plumber())
             .pipe(sourcemaps.init())
             .pipe(sass().on('error', sass.logError))
             .pipe(postcss(plugins))
             .pipe(rename({suffix: ".min"}))
             .pipe(csso())
             .pipe(sourcemaps.write('.'))
             .pipe(plumber.stop())
             .pipe(gulp.dest('./css'))
             .pipe(reload({stream: true}));
});

gulp.task('js', function() {
  //gulp.src([
  //  './js-src/nav-menu.js',
  //])
  gulp.src('./js-src/*.js')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel({presets: ['es2015', 'es2016']}))
      .pipe(concat('scripts.js', {newLine: '\n\r'}))
      .pipe(sourcemaps.write('.'))
      .pipe(plumber.stop())
      .pipe(gulp.dest('./js'))
      .pipe(reload({stream: true}));
});

gulp.task('html', function buildHTML() {
  var options = {
    "indent_size" : 2,
    "indent_char" : " ",
    "eol"         : "\n",
    "indent_level": 0,
    "extra_liners": 'span'
  };
  return gulp.src('./html/*.pug')
             .pipe(plumber())
             .pipe(pug({pretty: true}))
             //.pipe(pug())
             //.pipe(prettify({
             //  indent_char: ' ',
             //  indent_size: 2,
             //  "unformatted": ['li']
             //}))
             //.pipe(cheerio({
             //  run          : function($) {
             //    var a = $('a');
             //    for (i in a) {
             //      a[i] = '\n' + toString(a[i]);
             //    }
             //  },
             //  parserOptions: {xmlMode: false}
             //}))
             .pipe(plumber.stop())
             .pipe(gulp.dest('./'))
             .pipe(reload({stream: true}));
});

gulp.task('watch', function() {
  livereload.listen({
    port: 3009
  });

  //gulp.watch('./img/sprite.svg', ['svg2pug']);
  //gulp.watch('./source/svg/*.svg', ['svgo']);
  gulp.watch('./html/**/**/*.pug', ['html']);
  gulp.watch('./html/components/**/*.pug', ['html']);
  //gulp.watch('./source/png/**/*.png', ['sprite']);
  gulp.watch('./scss/**/**/*.scss', ['sass']);
  //gulp.watch('./postcss/**/*.css', ['css']);
  gulp.watch('./js-src/**/**/*.js', ['js']);
  //gulp.watch('./js-coffee/**/*.coffee', ['coffee']);
});

gulp.task('default', ['html', 'sprite', 'sass', 'js', 'browserSync', 'watch']);

csscombOptions = {
  "remove-empty-rulesets"          : true,
  "always-semicolon"               : true,
  "color-case"                     : "lower",
  "block-indent"                   : "  ",
  "color-shorthand"                : true,
  "element-case"                   : "lower",
  "eof-newline"                    : true,
  "leading-zero"                   : true,
  "quotes"                         : "double",
  "sort-order-fallback"            : "abc",
  "space-before-colon"             : "",
  "space-after-colon"              : " ",
  "space-before-combinator"        : " ",
  "space-after-combinator"         : " ",
  "space-between-declarations"     : "\n",
  "space-before-opening-brace"     : " ",
  "space-after-opening-brace"      : "\n",
  "space-after-selector-delimiter" : "\n",
  "space-before-selector-delimiter": "",
  "space-before-closing-brace"     : "\n",
  "strip-spaces"                   : true,
  "tab-size"                       : true,
  "unitless-zero"                  : true,
  "vendor-prefix-align"            : true,
  "sort-order"                     : [
    ["$variable"],
    ["$extend"],
    ["$include"],
    [
      "font",
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "font-variant",
      "font-size-adjust",
      "font-stretch",
      "font-effect",
      "font-emphasize",
      "font-emphasize-position",
      "font-emphasize-style",
      "font-smooth",
      "line-height"
    ],
    [
      "position",
      "z-index",
      "top",
      "right",
      "bottom",
      "left"
    ],
    [
      "display",
      "visibility",
      "float",
      "clear",
      "overflow",
      "overflow-x",
      "overflow-y",
      "-ms-overflow-x",
      "-ms-overflow-y",
      "clip",
      "zoom",
      "flex-direction",
      "flex-order",
      "flex-pack",
      "flex-align",
      "flex-basis"
    ],
    [
      "-webkit-box-sizing",
      "-moz-box-sizing",
      "box-sizing",
      "width",
      "min-width",
      "max-width",
      "height",
      "min-height",
      "max-height",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left"
    ],
    [
      "table-layout",
      "empty-cells",
      "caption-side",
      "border-spacing",
      "border-collapse",
      "list-style",
      "list-style-position",
      "list-style-type",
      "list-style-image"
    ],
    [
      "content",
      "quotes",
      "counter-reset",
      "counter-increment",
      "resize",
      "cursor",
      "-webkit-user-select",
      "-moz-user-select",
      "-ms-user-select",
      "user-select",
      "nav-index",
      "nav-up",
      "nav-right",
      "nav-down",
      "nav-left",
      "-webkit-transition",
      "-moz-transition",
      "-ms-transition",
      "-o-transition",
      "transition",
      "-webkit-transition-delay",
      "-moz-transition-delay",
      "-ms-transition-delay",
      "-o-transition-delay",
      "transition-delay",
      "-webkit-transition-timing-function",
      "-moz-transition-timing-function",
      "-ms-transition-timing-function",
      "-o-transition-timing-function",
      "transition-timing-function",
      "-webkit-transition-duration",
      "-moz-transition-duration",
      "-ms-transition-duration",
      "-o-transition-duration",
      "transition-duration",
      "-webkit-transition-property",
      "-moz-transition-property",
      "-ms-transition-property",
      "-o-transition-property",
      "transition-property",
      "-webkit-transform",
      "-moz-transform",
      "-ms-transform",
      "-o-transform",
      "transform",
      "-webkit-transform-origin",
      "-moz-transform-origin",
      "-ms-transform-origin",
      "-o-transform-origin",
      "transform-origin",
      "-webkit-animation",
      "-moz-animation",
      "-ms-animation",
      "-o-animation",
      "animation",
      "-webkit-animation-name",
      "-moz-animation-name",
      "-ms-animation-name",
      "-o-animation-name",
      "animation-name",
      "-webkit-animation-duration",
      "-moz-animation-duration",
      "-ms-animation-duration",
      "-o-animation-duration",
      "animation-duration",
      "-webkit-animation-play-state",
      "-moz-animation-play-state",
      "-ms-animation-play-state",
      "-o-animation-play-state",
      "animation-play-state",
      "-webkit-animation-timing-function",
      "-moz-animation-timing-function",
      "-ms-animation-timing-function",
      "-o-animation-timing-function",
      "animation-timing-function",
      "-webkit-animation-delay",
      "-moz-animation-delay",
      "-ms-animation-delay",
      "-o-animation-delay",
      "animation-delay",
      "-webkit-animation-iteration-count",
      "-moz-animation-iteration-count",
      "-ms-animation-iteration-count",
      "-o-animation-iteration-count",
      "animation-iteration-count",
      "-webkit-animation-direction",
      "-moz-animation-direction",
      "-ms-animation-direction",
      "-o-animation-direction",
      "animation-direction",
      "text-align",
      "-webkit-text-align-last",
      "-moz-text-align-last",
      "-ms-text-align-last",
      "text-align-last",
      "vertical-align",
      "white-space",
      "text-decoration",
      "text-emphasis",
      "text-emphasis-color",
      "text-emphasis-style",
      "text-emphasis-position",
      "text-indent",
      "-ms-text-justify",
      "text-justify",
      "letter-spacing",
      "word-spacing",
      "-ms-writing-mode",
      "text-outline",
      "text-transform",
      "text-wrap",
      "text-overflow",
      "-ms-text-overflow",
      "text-overflow-ellipsis",
      "text-overflow-mode",
      "-ms-word-wrap",
      "word-wrap",
      "word-break",
      "-ms-word-break",
      "-moz-tab-size",
      "-o-tab-size",
      "tab-size",
      "-webkit-hyphens",
      "-moz-hyphens",
      "hyphens",
      "pointer-events"
    ],
    [
      "opacity",
      "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity",
      "-ms-filter:\\'progid:DXImageTransform.Microsoft.Alpha",
      "-ms-interpolation-mode",
      "color",
      "border",
      "border-width",
      "border-style",
      "border-color",
      "border-top",
      "border-top-width",
      "border-top-style",
      "border-top-color",
      "border-right",
      "border-right-width",
      "border-right-style",
      "border-right-color",
      "border-bottom",
      "border-bottom-width",
      "border-bottom-style",
      "border-bottom-color",
      "border-left",
      "border-left-width",
      "border-left-style",
      "border-left-color",
      "-webkit-border-radius",
      "-moz-border-radius",
      "border-radius",
      "-webkit-border-top-left-radius",
      "-moz-border-radius-topleft",
      "border-top-left-radius",
      "-webkit-border-top-right-radius",
      "-moz-border-radius-topright",
      "border-top-right-radius",
      "-webkit-border-bottom-right-radius",
      "-moz-border-radius-bottomright",
      "border-bottom-right-radius",
      "-webkit-border-bottom-left-radius",
      "-moz-border-radius-bottomleft",
      "border-bottom-left-radius",
      "-webkit-border-image",
      "-moz-border-image",
      "-o-border-image",
      "border-image",
      "-webkit-border-image-source",
      "-moz-border-image-source",
      "-o-border-image-source",
      "border-image-source",
      "-webkit-border-image-slice",
      "-moz-border-image-slice",
      "-o-border-image-slice",
      "border-image-slice",
      "-webkit-border-image-width",
      "-moz-border-image-width",
      "-o-border-image-width",
      "border-image-width",
      "-webkit-border-image-outset",
      "-moz-border-image-outset",
      "-o-border-image-outset",
      "border-image-outset",
      "-webkit-border-image-repeat",
      "-moz-border-image-repeat",
      "-o-border-image-repeat",
      "border-image-repeat",
      "outline",
      "outline-width",
      "outline-style",
      "outline-color",
      "outline-offset",
      "background",
      "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader",
      "background-color",
      "background-image",
      "background-repeat",
      "background-attachment",
      "background-position",
      "background-position-x",
      "-ms-background-position-x",
      "background-position-y",
      "-ms-background-position-y",
      "-webkit-background-clip",
      "-moz-background-clip",
      "background-clip",
      "background-origin",
      "-webkit-background-size",
      "-moz-background-size",
      "-o-background-size",
      "background-size",
      "box-decoration-break",
      "-webkit-box-shadow",
      "-moz-box-shadow",
      "box-shadow",
      "filter:progid:DXImageTransform.Microsoft.gradient",
      "-ms-filter:\\'progid:DXImageTransform.Microsoft.gradient",
      "text-shadow"
    ]
  ]
};