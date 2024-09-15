import fs from 'fs';

export function getAbsoluteFileNamesFromDirSync(srcDir: string) {
   return fs
      .readdirSync(srcDir, { withFileTypes: true })
      .filter(file => file.isFile())
      .map(file => `${srcDir}/${file.name}`);
}

export function getAbsoluteFileNamesFromDir(srcDir: string) {
   return new Promise((resolve, reject) => {
      fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
         if (err)
            reject(err);
         else
            resolve(files.filter(file => file.isFile()).map(file => `${srcDir}/${file.name}`));
      });
   });
}
