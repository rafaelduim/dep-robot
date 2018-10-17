var gulp = require('gulp'),
    util = require('gulp-util'),
    build = require('./../config/default.json');

gulp.task('move-dist-fonts', function() {
    return gulp.src(build.config.dev.fonts + '/**/*')
        .pipe(gulp.dest(build.config.dist.fonts));
})