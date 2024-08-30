import "dotenv/config";
import webpack from "webpack";
import path, { dirname } from 'path';
import entriesJson from "./entries.json" with {type: 'json'};
import { fileURLToPath } from 'url';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

function getEntries(entriesNames, envBundleName) {
   return entriesNames.reduce((bundle, bundleName) => (
      envBundleName && !bundleName.includes(envBundleName)
         ? bundle
         : {
            ...bundle,
            [bundleName]: ["./lib/webpack/src/" + bundleName + ".ts"],
         }), {});
}

let config = env => {

   let NODE_ENV = env.NODE_ENV;
   let development = NODE_ENV === "development";
   //let production = NODE_ENV === "production";

   const entriesNames = entriesJson.filter(entry => !entry.rel).map(entry => entry.name);

   let plugins = [];
   let stats = {};

   if (development) {
      plugins = [new ForkTsCheckerWebpackPlugin(), new ReactRefreshWebpackPlugin(), new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr|en-gb/)];
      stats = {
         all: false,
         builtAt: true,
      }
   }

   // noinspection JSUnresolvedVariable
   let envBundleName = env.BUNDLE;

   // noinspection JSUnresolvedFunction
   let entries = getEntries(entriesNames, envBundleName);

   console.log("entries:", entries);

   const serverPort = process.env.PORT;
   const webpackPort = process.env.WEBPACK_PORT;

   let defaultConfig = {
      entry: entries,
      devtool: development ? "source-map" : false,
      optimization: {
         splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
               defaultVendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  reuseExistingChunk: true,
               },
               default: {
                  minChunks: 2,
                  priority: -20,
                  reuseExistingChunk: true,
               },
               commons: {
                  name: 'commons_bundle',
                  chunks: 'initial',
                  minChunks: 2,
               },
               reactPackage: {
                  test: /[\\/]node_modules[\\/](react|react-dom|@mui|react-select|@emotion|lodash|moment|moment-timezone)[\\/]/,
                  name: 'vendor_react_mui',
                  chunks: "all",
                  priority: 10,
               },
            },
         },
      },
      devServer: {
         allowedHosts: "all",
         hot: true,
         static: [path.resolve(__dirname, './lib/webpack/dist/')],
         liveReload: true,
         proxy: [
            {
               context: ['/'],
               target: {
                  host: "127.0.0.1",
                  protocol: 'http:',
                  port: serverPort,
               },
            },
         ],
         port: webpackPort,
      },
      plugins: plugins,
      module: {
         noParse: [fileURLToPath(import.meta.resolve('typescript/lib/typescript.js'))],
         rules: [
            {
               test: /\.tsx?$/,
               use: [
                  {
                     loader: fileURLToPath(import.meta.resolve('ts-loader')),
                     options: {
                        getCustomTransformers: () => ({
                           before: [development && ReactRefreshTypeScript()].filter(Boolean),
                        }),
                        transpileOnly: development,
                     },
                  },
               ],
               exclude: /node_modules/
            },
            {
               test: /\.css$/i,
               use: [
                  'style-loader',
                  {
                     loader: 'css-loader',
                     options: {
                        importLoaders: 1,
                        modules: {
                           mode: 'global'
                        }
                     }
                  }
               ],
            }
         ]
      },
      resolve: {
         extensions: ['.tsx', '.ts', '.js', '.css']
      },
      output: {
         path: path.resolve(__dirname, "./lib/webpack/dist/"),
         filename: "[name].js",
         publicPath: "/lib/webpack/dist/",
         pathinfo: !development
      },
      mode: NODE_ENV,
      stats
   };

   return [defaultConfig];
};

export default config;