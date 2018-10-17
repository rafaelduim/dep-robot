var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoPrefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    taskListing = require('gulp-task-listing'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    buffer = require('vinyl-buffer'),
    gih = require('gulp-include-html');

var paths = {
    image: '../images/sprite/',
    dist: '../dist',
    distCSS: '../dist/assets/css',
    distJS: '../dist/assets/js',
    distImage: '../dist/assets/images',
    distPlugins: '../dist/assets/plugins',
    distFonts: '../dist/assets/fonts',
    dev: 'dev',
    devSASS: 'sass',
    devImage: 'images',
    devHtml: 'html',
    devHtmlInclude: 'html-partial'
};

var names = {
    sprite: 'sprite.png',
    spriteSass: '_sprites.scss',
}

// Add a task to render the output 
gulp.task('help', taskListing);


//Tarefa padrão
gulp.task('default', ['full-images', 'move-dist-html'], function() {
    gulp.start('min')
});

gulp.task('watch', function() {
    gulp.watch(paths.devSASS + '/**/*.scss', ['min']);
    gulp.watch([paths.devImage + '/**/**/*'], ['full-images']);
    gulp.watch([paths.devHtml + '/**/**/*'], ['move-dist-html']);
    gulp.watch([paths.devHtmlInclude + '/**/**/*'], ['move-dist-html']);
});

// SASS

gulp.task('sass', ['clean-css'], function() {
    return gulp.src(paths.devSASS + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.distCSS));
});

gulp.task('min', ['sass'], function() {
    gulp.src(paths.distCSS + '/**/*.css')
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.distCSS));
});

// Images

gulp.task('sprite', function() {
    var spriteData = gulp.src(paths.devImage + '/sprite/**/*').pipe(spritesmith({
        imgName: names.sprite,
        cssName: names.spriteSass,
        imgPath: paths.image + names.sprite,
        padding: 1
    }));
    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(paths.distImage + '/sprite/'));
    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(gulp.dest(paths.devSASS + '/helpers/'));
    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});

gulp.task('images', function() {
    gulp.src(paths.devImage + '/*')
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest(paths.distImage));
    gulp.src(paths.devImage + '/icones/*')
        .pipe(gulp.dest(paths.distImage + '/icones'));
    gulp.src(paths.devImage + '/favicon/*')
        .pipe(gulp.dest(paths.distImage + '/favicon'));
});

gulp.task('full-images', ['clean-images'], function() {
    gulp.start('sprite');
    gulp.start('images');
});


// HTML

gulp.task('move-dist-html', function() {
    return gulp.src(paths.devHtml + '/**/*')
        .pipe(gih())
        .pipe(gulp.dest(paths.dist));
})

// Clean na pasta de dist
gulp.task('clean-css', function() {
    return gulp.src(paths.distCSS)
        .pipe(clean({ force: true }));
})
gulp.task('clean-images', function() {
    return gulp.src(paths.distImage)
        .pipe(clean({ force: true }));
});