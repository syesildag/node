import * as esbuild from 'esbuild';
import { getAbsoluteFileNamesFromDirSync } from '../utils/fileNames';
import { isProduction } from '../utils/environment';

export const entryPoints = [
   'static/lib/bundle',
   'static/lib/bundle/pages'
];

export default function process(fun: (dir: string, fileNames: string[], options: esbuild.BuildOptions) => void) {
   entryPoints.forEach(async (dir) => {
      const fileNames = getAbsoluteFileNamesFromDirSync('src/' + dir);
      console.log(`esbuild: ${fileNames}`);

      const options: esbuild.BuildOptions = {
         entryPoints: fileNames,
         outdir: 'dist/' + dir,
         bundle: true,
         minify: isProduction(),
         sourcemap: true,
         splitting: true,
         format: 'esm',
         platform: 'browser',
         target: 'es2022',
         tsconfig: 'tsconfig.json',
         chunkNames: 'chunks/[name]-[hash]',
         loader: {
            '.ttf': 'file',
         },
      };

      fun(dir, fileNames, options);
   });
}