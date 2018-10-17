var gulp = require('gulp'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    build = require('./../config/default.json');


// PLUGINS

function doStuff(cfg) {
    return gulp.src(cfg.src)
      .pipe(uglify())
      .pipe(gulp.dest(cfg.dest));
  }
  

// gulp.task('move-dist-plugins', function() {
//     // return gulp.src(paths.devPlugins + '/**/*')
//     //     .pipe(gulp.dest(paths.distPlugins));
//     doStuff(build.config.dev.plugins);
// });

gulp.task('bundle.plugins', ['clean-plugins'] ,  function() {
    return gulp.src(build.config.dev.plugins)
        .pipe(plumber({
            handleError: function(error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe(concat('bundle.plugins.js'))
        .pipe(gulp.dest(build.config.dist.plugins));
});

gulp.task('clean-plugins', function() {
    return gulp.src(build.config.dist.plugins)
        .pipe(clean({ force: true }));
});