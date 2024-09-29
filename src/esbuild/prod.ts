import * as esbuild from 'esbuild'
import { getAbsoluteFileNamesFromDirSync } from '../utils/fileNames';

function main() {
   [
      'static/lib/bundle',
      'static/lib/bundle/pages'
   ].forEach(async (dir) => {
      const fileNames = getAbsoluteFileNamesFromDirSync('src/' + dir);
      console.log(`esbuild: ${fileNames}`);
      const result = await esbuild.build({
         entryPoints: fileNames,
         outdir: 'dist/' + dir,
         bundle: true,
         minify: true,
         sourcemap: true,
         splitting: true,
         format: 'esm',
         platform: 'browser',
         target: 'es2022',
         tsconfig: 'tsconfig.json',
         chunkNames: 'chunks/[name]-[hash]',
      });

      result.errors.forEach(error => {
         console.error(error);
      });

      result.warnings.forEach(warning => {
         console.warn(warning);
      });

      result.outputFiles?.forEach(file => {
         console.log(file.path);
      });
   });
}

main();