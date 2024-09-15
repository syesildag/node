import * as esbuild from 'esbuild'
import {getAbsoluteFileNamesFromDirSync} from '../utils/fileNames';

async function main() {
   const fileNames = getAbsoluteFileNamesFromDirSync('src/static/lib/webpack');
   const ctx = await esbuild.context({
      entryPoints: fileNames,
      outdir: 'dist/static/lib/webpack',
      bundle: true,
   });

   await ctx.watch();
   console.log('watching...');
}

main();