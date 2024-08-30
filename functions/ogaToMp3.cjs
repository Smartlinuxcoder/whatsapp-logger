const ffmpeg = require('fluent-ffmpeg');
const path = require('node:path');
const fs = require('node:fs');
ffmpeg.setFfmpegPath(require('ffmpeg-static'));

module.exports = async (filePath) => {

    const convertOggToMp3 = (inputFile, outputFile) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFile)
        .output(outputFile)
        .on('end', () => {
            console.log('Successfully converted oga file to mp3');
            resolve();
        })
        .on('error', (err) => {
            console.error('Error during conversion from oga to mp3: ', err);
            reject(err);
        })
        .run();
    });
    };

    const inputPath = path.join(filePath);
    const outputPath = path.join(filePath.replace('oga', 'mp3'));

    if (fs.existsSync(inputPath)) {
        convertOggToMp3(inputPath, outputPath)
    } else {
        console.error('Input file does not exist');
    }
}