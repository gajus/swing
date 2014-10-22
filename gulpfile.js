var pkg = require('./package.json'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    del = require('del');

gulp.task('lint', function () {
    return gulp
        .src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', ['lint'], function (cb) {
    del(['dist'], cb);
});

gulp.task('distribute', ['clean'], function () {
    return gulp
        .src('./src/swing.js')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './package.json'], ['default']);
});

gulp.task('default', ['distribute']);