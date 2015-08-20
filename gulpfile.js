var gulp = require('gulp'),
    Server = require('karma').Server,
    eslint = require('gulp-eslint'),
    del = require('del'),
    jsonfile = require('jsonfile'),
    gitdown = require('gitdown');

gulp.task('lint', function () {
    return gulp
        .src(['./src/**/*.js','./tests/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('version', ['lint'], function () {
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
    gulp.watch(['./src/**/*', './tests/**/*', './package.json'], ['default']);
    gulp.watch(['./.gitdown/**/*'], ['gitdown']);
});

gulp.task('test', ['default'], function (done) {
    var server;

    server = new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });

    server.start(function () {
        done();
    });
});

gulp.task('default', ['version']);
