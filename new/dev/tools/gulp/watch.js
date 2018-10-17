var gulp = require('gulp'),
    util = require('gulp-util'),
    build = require('./../config/default.json');

    
gulp.task('watch', function() {
    gulp.watch(build.config.dev.scss + '/**/*.scss', ['bundle.styles']);
    gulp.watch([build.config.dev.images + '/**/*'], ['bundle.images']);
    gulp.watch([build.config.dev.html + '/**/*'], ['bundle.html']);
});
