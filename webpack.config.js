var webpack,
    filename,
    plugins;

webpack = require('webpack');
filename = '[name].js',

plugins = [
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.OldWatchingPlugin(),
    // new webpack.NewWatchingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
];

module.exports = {
    devtool: 'source-map',
    context: __dirname + '/src',
    entry: {
        swing: './index'
    },
    output: {
        path: __dirname + '/dist/browser',
        filename: filename
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                loader: 'babel'
            }
        ]
    },
    resolve: {
        extensions: [
            '',
            '.js'
        ]
    }
};
