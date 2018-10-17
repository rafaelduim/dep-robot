var gulp = require('gulp'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    util = require('gulp-util'),
    build = require('./../config/default.json');

gulp.task('bundle.scripts', ['clean-script'], function() {
    gulp.src(build.config.dev.js + '/*.js')
        .pipe(plumber({
            handleError: function(error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(build.config.dist.js))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(build.config.dist.js));
});

gulp.task('clean-script', function() {
    return gulp.src(build.config.dist.js)
        .pipe(clean({ force: true }));
})