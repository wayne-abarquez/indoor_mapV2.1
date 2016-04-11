'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del'],
    lazy: true
});

gulp.task('images', function () {
    return gulp.src(paths.srcImages + '/**/*')
        .pipe(gulp.dest(paths.destImages + '/'));
});

gulp.task('fonts', function () {
    return gulp.src(paths.bower + '/**/*')
        .pipe($.filter('**/*.{eot,otf,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(paths.destFonts + '/'));
});

gulp.task('clean', function (done) {
    $.del(
        [
            paths.destImages + '/',
            paths.destFonts  + '/',
            paths.destCss    + '/',
            paths.destJs     + '/',
            paths.tmp        + '/'
        ]
        , done);
});

gulp.task('buildapp', ['styles', 'scripts', 'images', 'fonts']);