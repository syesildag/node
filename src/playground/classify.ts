import * as fs from 'fs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs-node';

async function main() {

   if (process.argv.length !== 3)
      throw new Error('Incorrect arguments: npm run classify <IMAGE_FILE>');

   const imagePath = process.argv[2]; //"static/images/cat.jpg"

   let imageBuffer: Buffer;
   if (fs.existsSync(imagePath))
      imageBuffer = fs.readFileSync(imagePath);
   else
      throw new Error(`No File: ${imagePath}`);

   const tfimage = tf.node.decodeJpeg(imageBuffer);
   const mobilenetModel = await mobilenet.load();
   const predictions = await mobilenetModel.classify(tfimage);
   console.log(predictions);
}

main();