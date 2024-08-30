const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('ffmpeg-static'));

module.exports = async (inputFile, outputFile) => {
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