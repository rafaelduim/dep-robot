var gulp = require('gulp'),
    util = require('gulp-util'),
    gih = require('gulp-include-html'),
    build = require('./../config/default.json');

gulp.task('bundle.html', function() {
    return gulp.src(build.config.dev.html + '/*.html')
        .pipe(gih())
        .pipe(gulp.dest(build.config.dist.base));
})