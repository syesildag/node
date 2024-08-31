import "dotenv/config";
import webpack, { WebpackOptionsNormalized, WebpackPluginInstance } from "webpack";
import path, { dirname } from 'path';
import entriesJson from "./entries.json" assert {type: 'json'};
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

interface Entry {
   name: string;
};

function getEntries(entriesNames: string[], envBundleName?: string) {
   return entriesNames.reduce((bundle, bundleName) => (
      envBundleName && !bundleName.includes(envBundleName)
         ? bundle
         : {
            ...bundle,
            [bundleName]: ["./static/lib/webpack/src/" + bundleName + ".ts"],
         }), {});
}

function progressPluginhandler(percentage: number, message: string, ...args: string[]) {
   console.info(percentage, message, ...args);
};

let config: (env: NodeJS.ProcessEnv) => WebpackOptionsNormalized[] = (env: any) => {

   let NODE_ENV = env.NODE_ENV;
   let development = NODE_ENV === "development";
   //let production = NODE_ENV === "production";

   const entriesNames = entriesJson.map(entry => entry.name);

   let plugins: WebpackPluginInstance[] = [];
   let stats = {};

   if (development) {
      plugins = [new webpack.HotModuleReplacementPlugin(), new webpack.ProgressPlugin(progressPluginhandler)];
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

   let defaultConfig: WebpackOptionsNormalized = {
      cache: { type: 'filesystem' },
      experiments: {},
      externals: {},
      externalsPresets: {},
      infrastructureLogging: {},
      node: {},
      optimization: {},
      resolveLoader: {},
      snapshot: {},
      watchOptions: {},
      entry: entries,
      devtool: development ? "source-map" : false,
      devServer: {
         allowedHosts: "all",
         hot: true,
         static: [path.resolve(__dirname, './static/lib/webpack/dist/')],
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
      plugins,
      module: {
         defaultRules: [],
         parser: {},
         generator: {},
         noParse: [fileURLToPath(import.meta.resolve('typescript/lib/typescript.js'))],
         rules: [
            {
               test: /\.tsx?$/,
               use: [
                  {
                     loader: fileURLToPath(import.meta.resolve('ts-loader')),
                     options: {
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
         path: path.resolve(__dirname, "./static/lib/webpack/dist/"),
         filename: "[name].js",
         publicPath: "/static/lib/webpack/dist/",
         pathinfo: !development
      },
      mode: NODE_ENV,
      stats
   };

   return [defaultConfig];
};

export default config;