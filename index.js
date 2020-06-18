//https://github.com/akhil-kn/node-m3u8-to-mp3
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');

const config = {
    "cover": "./assets/radiocn.jpg",
    "name": `track_${new Date().getTime()}`,
    "m3u8_path": "https://rdamchp1-lh.akamaihd.net/i/rdamchp_1_0@193678/master.m3u8",
    "bitrate": "320"
};

const command = ffmpeg(config.m3u8_path);
const file_path = `Music/${config.name}.mp3`;

command
    .on('start', () => { console.log('Processing started !'); })
    //.on('progress', (progress) => { console.log('Processing: ' + Math.floor(progress.percent) + '% done'); })
    .on('progress', (progress) => {console.log('Timemark: ' + progress.timemark);})
    .on('end', () => { addCover(); })
    .on('error', (err) => { console.log('An error occurred: ' + err.message); })
    .audioCodec('libmp3lame')
    .audioBitrate(config.bitrate)
    .mergeToFile('temp.mp3', './Music');
    

function addCover() {
    const cmd = `ffmpeg -i temp.mp3 -i ${config.cover} -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" \"${file_path}\" && del "temp.mp3"`;
    exec(cmd, () => {
        console.log(`Processing finished !\nfile path : ${encodeURI(file_path)}`);
    });
}