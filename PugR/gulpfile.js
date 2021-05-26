const gulp=require("gulp"),
  { src, dest } = require('gulp'),
  browser   = require('browser-sync').create(),
  htmlmin = require("gulp-htmlmin"),
  //Css
  sourcemaps=require("gulp-sourcemaps"),
  scss=require("gulp-sass"),
  csso=require("gulp-csso"),
  autoprefixer=require("gulp-autoprefixer"),
  mediaqueries = require('gulp-group-css-media-queries'),
  concat=require("gulp-concat-css"),
  cssminify=require("gulp-css-minify"),
  clean_css     = require('gulp-clean-css'),
  rename        = require('gulp-rename'),
  pug=require("gulp-pug"),
  del=require("del"),
  imageMin=require("gulp-imagemin"),
  flatten=require("gulp-flatten")
let project_folder = "dist",
    source_folder  = "src";

    let path = {
        build:{
            html:  project_folder + "/",
            css:   project_folder + "/css/",
            img:  project_folder+ "/img/",
            fonts: project_folder + "/fonts/"
          
        },
        src:{
            html:    source_folder + "/pug/index.pug",
            css:   source_folder + "/**/*.scss",
            img:    source_folder+ "/img/**/*.{jpg,png,svg,gif,ico,webp}",
            fonts: source_folder + "/fonts/*.ttf"
          
        },
        watch:{
            html:  source_folder + "/pug/**/*.pug",
            css:   source_folder + "/scss/**/*.scss",
            img:   source_folder+ "/img/**/*.{jpg,png,svg,gif,ico,webp}"
          
       
        }, 
        clean: "./" + project_folder + "/"
    }

    function  pugs(){
        return src(path.src.html)
        .pipe(pug({
            pretty:true
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(browser.stream())
    }
    function html() {
        return src(path.src.html)
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(dest(path.build.html))
            .pipe(browser.stream())
    }
 

    function css() {
        return src(path.src.css)
            .pipe(sourcemaps.init())
            .pipe(scss().on('error', scss.logError))
            .pipe(csso({
                restructure: true,
                sourceMap: true,
                debug: true
            }))
            .pipe(
                autoprefixer({
                    overrideBrowserslist: ["last 5 version"],
                    cascade: true
                })
            )
            .pipe(mediaqueries())
            .pipe(concat("style.css"))
            .pipe(dest(path.build.css))
            .pipe(cssminify())
            .pipe(clean_css())
            .pipe(
                rename({
                    extname: ".min.css"
                })
            )
            .pipe(dest(path.build.css))
            .pipe(sourcemaps.write('../maps'))
            .pipe(browser.stream())
    }
  
    function imagemin(){
        return src(path.src.img)
        .pipe(imageMin())
        .pipe(flatten({includeParents:0}))
        .pipe(gulp.dest(path.build.img))
        .pipe(browser.stream())
    }


    function watchFiles(params){
        gulp.watch([path.watch.html], pugs);
        gulp.watch([path.watch.css], css);
        gulp.watch([path.watch.img], imagemin)
     
    }
    function browserSync(){
        browser.init({
            server:{
                baseDir:  "./" + project_folder + "/"
            },
            port: 3000,
            notify: false
        })
    }
    function clean(params){
        return del(path.clean);
    }
    
let watch =gulp.series(clean,pugs,html,css,imagemin,gulp.parallel(watchFiles,browserSync));
exports.html=html;
exports.pugs=pugs;
exports.watch=watch;
exports.css= css;
exports.browserSync=browserSync;
exports.imagemin=imagemin
exports.default=watch
















