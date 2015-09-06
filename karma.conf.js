module.exports = function (config) {
    config.set({
        preprocessors: {
            'tests/**/*.js': [
                'babel'
            ]
        },
        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            },
            filename: function (file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        },
        basePath: '',
        frameworks: [
            'mocha',
            'sinon-chai'
        ],
        files: [
            'dist/browser/swing.js',
            'tests/*.js'
        ],
        reporters: [
            'progress'
        ],
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [
            'PhantomJS'
        ],
        singleRun: false
    });
};
