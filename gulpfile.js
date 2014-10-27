var pkg = require('./package.json'),
    karma = require('karma').server,
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    fs = require('fs'),
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

gulp.task('version', ['bundle'], function () {
    var bower = require('./bower.json');

    gulp
        .src('./dist/swing.js')
        .pipe(header('/**\n * @version <%= version %>\n * @link https://github.com/gajus/swing for the canonical source repository\n * @license https://github.com/gajus/swing/blob/master/LICENSE BSD 3-Clause\n */\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('swing.min.js'))
        .pipe(header('/**\n * @version <%= version %>\n * @link https://github.com/gajus/swing for the canonical source repository\n * @license https://github.com/gajus/swing/blob/master/LICENSE BSD 3-Clause\n */\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'));

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.version = pkg.version;
    bower.keywords = pkg.keywords;
    bower.license = pkg.license;
    bower.authors = [pkg.author];

    fs.writeFile('./bower.json', JSON.stringify(bower, null, 4));
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './package.json'], ['default']);
});

gulp.task('test', ['default'], function (cb) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb);
});

gulp.task('default', ['version']);