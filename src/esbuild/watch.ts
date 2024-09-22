import * as esbuild from 'esbuild'
import { getAbsoluteFileNamesFromDirSync } from '../utils/fileNames';

async function main() {
   [
      'static/lib/bundle',
      'static/lib/bundle/pages'
   ].forEach(async (dir) => {
      const fileNames = getAbsoluteFileNamesFromDirSync('src/' + dir);
      const ctx = await esbuild.context({
         entryPoints: fileNames,
         outdir: 'dist/' + dir,
         bundle: true,
      });

      await ctx.watch();
      console.log('watching ' + dir);
   });
}

main();