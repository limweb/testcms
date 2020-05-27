// const webpack = require('webpack')
require('dotenv').config()
const withSass = require('@zeit/next-sass')
// var path = require('path');

module.exports = withSass(({
    webpack(config, options) {

        // config.module.rules.push({ test: /\.css$/, loader: ['style-loader', 'css-loader'] });
        
        config.node = {
            ...config.node,
            fs: 'empty',
            child_process: 'empty',
            net: 'empty',
            tls: 'empty',
        }

        // config.resolve = {
        //     extensions: ['.js'],
        //         alias: {
        //         fs: path.resolve(__dirname, './src/mock-fs.js')
        //     }
        // }

        return config
    },

    env: {
        'MAIN_API_ENDPOINT': process.env.MAIN_API_ENDPOINT,
        'PREVIEW_ENDPOINT': process.env.PREVIEW_ENDPOINT
    },

    
}))

// file_name : froala_editor.min.js/froala_editor.pkgd.min.js 