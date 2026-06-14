const path = require('path');
const webpack = require('webpack');
const { version } = require('./package.json');

const buildTime = new Date().toLocaleTimeString('en-GB', {
  hour12: false,
});

module.exports = (_, argv = {}) => {
  const isDevBuild = argv.mode === 'development';

  return {
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new webpack.DefinePlugin({
        __FSET_BUILD_TIME__: JSON.stringify(buildTime),
        __FSET_IS_DEV_BUILD__: JSON.stringify(isDevBuild),
        __FSET_PACKAGE_VERSION__: JSON.stringify(version),
      }),
    ],
  };
};
