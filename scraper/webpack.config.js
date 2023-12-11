const path = require('path');

module.exports = {
  entry: {
    index: './index.ts'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        
        shared: {
          test: /[\\/]shared[\\/]/,
          name: 'shared',
          chunks: 'all'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
      }
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2'
    }
  },
};