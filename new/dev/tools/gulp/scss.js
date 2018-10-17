var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoPrefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    util = require('gulp-util'),
    build = require('./../config/default.json');

gulp.task('sass', ['clean-css'] ,  function() {
    return gulp.src(build.config.dev.scss + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer())
        .pipe(sourcemaps.write())
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(build.config.dist.css));
});

gulp.task('bundle.styles', ['sass'] ,  function() {
    return gulp.src(build.config.dist.css + "/**/*.css")
        .pipe(concat('bundle.styles.css'))
        .pipe(gulp.dest(build.config.dist.css));
});

gulp.task('min', ['sass'], function() {
    gulp.src(build.config.dist.css + '/**/*.css')
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(build.config.dist.css));
});

gulp.task('clean-css', function() {
    return gulp.src(build.config.dist.css)
        .pipe(clean({ force: true }));
})