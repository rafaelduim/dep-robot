var gulp = require('gulp'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    buffer = require('vinyl-buffer'),
    util = require('gulp-util'),
    build = require('./../config/default.json');


gulp.task('sprite', function() {
    var spriteData = gulp.src(build.config.dev.images + '/sprite/**/*').pipe(spritesmith({
        imgName: build.config.names.sprite,
        cssName: build.config.names.sprite_scss,
        imgPath: build.config.image_css + build.config.names.sprite,
        padding: 2
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
});

gulp.task('images', function() {
    gulp.src(build.config.dev.images + '/*')
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(build.config.dist.images));
    gulp.src(build.config.dev.images + '/icones/*')
        .pipe(gulp.dest(build.config.dist.images + '/icones'));
    gulp.src(build.config.dev.images + '/favicon/*')
        .pipe(gulp.dest(build.config.dist.images + '/favicon'));
});

gulp.task('bundle.images', ['clean-images'], function() {
    gulp.start('sprite');
    gulp.start('images');
});

gulp.task('clean-images', function() {
    return gulp.src(build.config.dist.images)
        .pipe(clean({ force: true }));
});