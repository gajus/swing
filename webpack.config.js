var webpack = require('webpack'),
    minimize = !!Number(process.env.MINIMIZE),
    plugins;

plugins = [
    new webpack.OldWatchingPlugin(),
    // new webpack.NewWatchingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin()
];

if (minimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {
    devtool: 'source-map',
    context: __dirname + '/src',
    entry: {
        swing: './index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
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
