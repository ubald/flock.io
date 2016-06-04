var isDev = process.env.NODE_ENV !== 'production';

module.exports = [
    require('./webpack/webpack.config.server' + ( isDev ? '.dev' : '.production' ) ),
    require('./webpack/webpack.config.client' + ( isDev ? '.dev' : '.production' ) )
];