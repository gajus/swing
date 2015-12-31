import gulp from 'gulp';
import jsonfile from 'jsonfile';
import webpack from 'webpack';
import del from 'del';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import webpackConfig from './webpack.config';

gulp.task('lint', () => {
    return gulp
        .src(['./src/**/*.js','./tests/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('clean', ['lint'], () => {
    return;
    return del([
            './dist/es5/*',
            './dist/browser/*'
        ]);
});

gulp.task('build-browser', ['clean'], (done) => {
    webpack(webpackConfig, (error, stats) => {
        if (error) {
            throw new gutil.PluginError('webpack', error);
        }

        gutil.log('[webpack]', stats.toString());

        console.log('WHAT');

        done();
    });
});

gulp.task('build-es5', ['clean'], () => {
    return gulp
        .src('./src/*')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/es5'));
});

gulp.task('test', ['build-browser', 'build-es5'], (done) => {
    return gulp
        .src('./test/*', {
            read: false
        })
        .pipe(mocha());
});

gulp.task('version', ['test'], () => {
    let pkg = jsonfile.readFileSync('./package.json'),
        bower = jsonfile.readFileSync('./bower.json');

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.keywords = pkg.keywords;
    bower.license = pkg.license;
    bower.authors = [pkg.author];

    jsonfile.writeFileSync('./bower.json', bower);
});

gulp.task('default', ['version']);

gulp.task('watch', () => {
    gulp.watch(['./src/**/*', './tests/**/*'], ['default']);
});
