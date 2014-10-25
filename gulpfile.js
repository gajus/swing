var pkg = require('./package.json'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
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

gulp.task('bundle', ['clean'], function () {
    return gulp
        .src('./src/swing.js')
        .pipe(browserify({
            //debug : true
        }))
        .pipe(gulp.dest('./dist/'));
});

/*gulp.task('distribute', ['clean'], function () {
    return gulp
        .src('./src/swing.js')
        .pipe(gulp.dest('./dist/'));
});*/

gulp.task('watch', function () {
    gulp.watch(['./src/*', './package.json'], ['default']);
});

gulp.task('default', ['bundle']);