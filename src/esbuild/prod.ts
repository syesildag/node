import * as esbuild from 'esbuild';
import process from './base';

process(main);

async function main(dir: string, fileNames: string[], options: esbuild.BuildOptions) {

   let result = await esbuild.build(options);

   result.errors.forEach(error => {
      console.error(error);
   });

   result.warnings.forEach(warning => {
      console.warn(warning);
   });

   result.outputFiles?.forEach(file => {
      console.log(file.path);
   });
}