var webpack = require('webpack'),
    minimize,
    filename,
    plugins;

minimize = Boolean(Number(process.env.MINIMIZE));

filename = minimize ? '[name].min.js' : '[name].js',

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
