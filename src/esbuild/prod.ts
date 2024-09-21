import * as esbuild from 'esbuild'
import { getAbsoluteFileNamesFromDirSync } from '../utils/fileNames';

function main() {
   [
      'static/lib/webpack',
      'static/lib/webpack/pages'
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
         target: 'es2022'
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