import fs from 'fs';

export function getAbsoluteFileNamesFromDirSync(srcDir: string) {
   return fs.readdirSync(srcDir).map(file => `${srcDir}/${file}`);
}

export function getAbsoluteFileNamesFromDir(srcDir: string) {
   return new Promise((resolve, reject) => {
      fs.readdir(srcDir, (err, files) => {
         if (err) {
            reject(err);
         } else {
            resolve(files.map(file => `${srcDir}/${file}`));
         }
      });
   });
}
