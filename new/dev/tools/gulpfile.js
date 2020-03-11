var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    autoPrefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    buffer = require('vinyl-buffer'),
    gih = require('gulp-include-html'),
    build = require('./config/default.json');

//#region SASS
function cleanCss() {
    return(
        gulp
            .src(build.config.dist.css,{allowEmpty:true})
            .pipe(clean({ force: true }))
    );
}
function buildSass() {
    return (
        gulp
            .src(build.config.dev.scss + '/**/*.scss',{allowEmpty:true})
            .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoPrefixer())
            .pipe(sourcemaps.write())
            .pipe(cssmin())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(build.config.dist.css))
    );
}
function buildBundleCss() {
    return (
        gulp
            .src(build.config.dist.css + "/**/*.css",{allowEmpty:true})
            .pipe(concat('bundle.styles.css'))
            .pipe(gulp.dest(build.config.dist.css))
    );
}

const compileSass = gulp.series(cleanCss, buildSass);
const compileBundleCss = gulp.series(buildSass, buildBundleCss);

exports.cleanCss = cleanCss;
exports.buildSass = buildSass;
exports.sass = compileSass;
exports.bundleStyles = compileBundleCss;

//#endregion

//#region IMAGES
function cleanImages() {
    return(
        gulp
            .src(build.config.dist.images,{allowEmpty:true})
            .pipe(clean({ force: true }))
    );
}
function buildSprite() {
    var spriteData = gulp.src(build.config.dev.images + '/sprite/**/*',{allowEmpty:true}).pipe(spritesmith({
        imgName: build.config.names.sprite,
        cssName: build.config.names.sprite_scss,
        imgPath: build.config.image_css + build.config.names.sprite,
        padding: 1
    }));

    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(build.config.dist.images + '/sprite/'));
    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(gulp.dest(build.config.dev.scss + '/helpers/'));
    // Return a merged stream to handle both `end` events

    return merge(imgStream, cssStream);
}
function buildImages() {
    return (
        gulp
            .src(build.config.dev.images + '/*',{allowEmpty:true})
            .pipe(buffer())
            .pipe(imagemin())
            .pipe(gulp.dest(build.config.dist.images))
    );
    
}


const compileBundleImages = gulp.series(cleanImages, gulp.parallel(buildSprite,buildImages));

exports.bundlebuildSprite = buildSprite;
exports.buildImages = buildImages;
exports.bundleImages = compileBundleImages;

//#endregion

//#region HTML
function cleanHTML() {
    return(
        gulp
            .src(build.config.dist.base + '/*.html' ,{allowEmpty:true})
            .pipe(clean({ force: true }))
    );
}
function buildHtml() {
    return (
        gulp.src(build.config.dev.html + '/*.html')
        .pipe(gih())
        .pipe(gulp.dest(build.config.dist.base))
    );
}
const compileHtml = gulp.series(cleanHTML, buildHtml);

exports.cleanHTML = cleanHTML;
exports.buildHtml = buildHtml;
exports.html = compileHtml;

//#endregion

//#region WATCH
function watch() {
    gulp.watch(build.config.dev.scss + '/**/*.scss', compileBundleCss);
    gulp.watch(build.config.dev.images + '/**/*', compileBundleImages);
    gulp.watch(build.config.dev.html + '/**/*', compileHtml);
}

exports.watch = watch;

//#endregion

//#region DEFAULT
const compileGulp = gulp.series(compileHtml, compileBundleCss, compileBundleImages);
exports.default = compileGulp;

//#endregion