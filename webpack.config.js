const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ['./client/assets/js/index.js', './client/assets/styles/styles.scss'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'client/dist')
    },
    module: {
        loaders: [
            {
                test: /\.(scss|sass)$/i,
                include: [
                    path.resolve(__dirname, 'client/assets/styles')
                ],
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './[name].bundle.css',
            allChunks: true,
        })
    ]
};