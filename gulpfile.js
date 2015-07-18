var karma = require('karma').server,
    gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    jsonfile = require('jsonfile'),
    gitdown = require('gitdown'),
    bundler;

bundler = browserify('./src/swing.js');
// bundler.transform(babelify);

gulp.task('lint', function () {
    return gulp
        .src(['./src/**/*.js','./tests/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.v())
        .pipe(eslint.failOnError());
});

gulp.task('clean', ['lint'], function (cb) {
    del(['dist'], cb);
});

gulp.task('bundle', ['clean'], function () {
    return bundler
        .bundle()
        .on('error', function(err) {
            console.log(err.message);
        })
        .pipe(source('swing.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('version', ['bundle'], function () {
    var pkg = jsonfile.readFileSync('./package.json'),
        bower = jsonfile.readFileSync('./bower.json');

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.keywords = pkg.keywords;
    bower.license = pkg.license;
    bower.authors = [pkg.author];

    jsonfile.writeFileSync('./bower.json', bower);
});

gulp.task('gitdown', function () {
    return gitdown
        .read('./.gitdown/README.md')
        .write('./README.md');
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './package.json'], ['default']);
    gulp.watch(['./.gitdown/*'], ['gitdown']);
});

gulp.task('test', ['default'], function (cb) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb);
});

gulp.task('default', ['version']);
