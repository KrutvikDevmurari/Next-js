// const request = require('request');
import request from 'request'
// const fs = require('fs');
import fs from 'fs'

function downloadImage(url: any, destination: any) {
    request(url)
        .pipe(fs.createWriteStream(destination))
        .on('close', () => {
            console.log('Image downloaded successfully!');
        })
        .on('error', (err: any) => {
            console.error('Error downloading the image:', err);
        });
}

export default downloadImage;