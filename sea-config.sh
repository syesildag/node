#!/usr/bin/env bash
npm run build;
npx esbuild dist/index.js --bundle --platform=node --outfile=deploy/index.js;
node --experimental-sea-config sea-config.json;
cp $(which node) deploy/index;
npx postject deploy/index NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2;
cp -r -t deploy dist/static;
cp -t deploy dist/schema.graphql;
rm deploy/index.js;