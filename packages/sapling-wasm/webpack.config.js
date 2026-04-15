const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const path = require('path')

const WasmPreloadPlugin = require('./plugins/WasmPreloadPlugin')
const WebpackPatchPlugin = require('./plugins/WebpackPatchPlugin')

const dist = path.resolve(__dirname, 'dist')

module.exports = {
  entry: {
    node: path.resolve(__dirname, 'src/index.ts')
  },
  devtool: 'source-map',
  target: ['es2020', 'node'],
  output: {
    path: dist,
    filename: 'index.[name].js',
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.js', '.ts', '.wasm']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.node.json')
        },
        exclude: /node_modules/
      }
    ],
    exprContextCritical: false
  },
  plugins: [
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, '../sapling'),
      outDir: path.resolve(__dirname, 'pkg'),
      outName: 'index',
      forceMode: 'production',
      extraArgs: '--target bundler --mode normal -- --features wasm_bindings'
    }),
    new WasmPreloadPlugin({
      targetFiles: ['index.node.js']
    }),
    new WebpackPatchPlugin({
        targetFiles: ['index.node.js']
    })
  ],
  experiments: {
    asyncWebAssembly: true
  }
}
