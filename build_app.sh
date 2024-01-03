#!/bin bash

echo "--- Install client deps ---"
cd client && npm i --legacy-peer-deps
echo -e "n\n\n"

echo "--- Build client with webpack ---"
npm run build
echo -e "n\n\n"

echo "--- Install server deps ---"
cd ../server && npm i 
echo -e "n\n\n"

echo "--- Start server ---"
pm2 start ecosystem.config.js --p 3002