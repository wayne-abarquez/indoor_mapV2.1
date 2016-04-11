'use strict';

var gulp = require('gulp');

gulp.paths = {
    src: 'src',
    bower: 'src/bower_components',
    tmp: 'src/.tmp',
    srcImages: 'src/images',
    srcSass: 'src/sass',
    srcCss: 'src/css',
    srcJs: 'src/js',
    srcLibJs: 'src/lib_js',
    destImages: 'images',
    destFonts: 'fonts',
    destCss: 'css',
    destJs: 'js'
};

require('require-dir')('./gulp');

gulp.task('build', ['clean'], function () {
    gulp.start('buildapp');
});


