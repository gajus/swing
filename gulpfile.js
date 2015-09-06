import gulp from 'gulp';
import karma from 'karma';
import eslint from 'gulp-eslint';
import jsonfile from 'jsonfile';
import webpack from 'webpack';
import gutil from 'gulp-util';

let Server = karma.Server;

gulp.task('lint', () => {
    return gulp
        .src(['./src/**/*.js','./tests/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('version', ['lint'], () => {
    let pkg = jsonfile.readFileSync('./package.json'),
        bower = jsonfile.readFileSync('./bower.json');

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.keywords = pkg.keywords;
    bower.license = pkg.license;
    bower.authors = [pkg.author];

    jsonfile.writeFileSync('./bower.json', bower);
});

gulp.task('build', ['version'], (done) => {
    webpack({}, (error, stats) => {
        if (error) {
            throw new gutil.PluginError('webpack', error);
        }

        gutil.log('[webpack]', stats.toString());

        done();
    });
});

gulp.task('test', ['build'], (done) => {
    let server;

    server = new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });

    server.start(() => {
        done();
    });
});

gulp.task('default', ['test']);

gulp.task('watch', () => {
    gulp.watch(['./src/**/*', './tests/**/*'], ['default']);
});
