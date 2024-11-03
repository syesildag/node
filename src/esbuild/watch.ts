import * as esbuild from 'esbuild';
import process from './base';

process(main);

async function main(dir: string, fileNames: string[], options: esbuild.BuildOptions) {

   const ctx = await esbuild.context(options);

   await ctx.watch();

   console.log('Watching for changes in directory:', dir);
}