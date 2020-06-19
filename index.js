//https://github.com/akhil-kn/node-m3u8-to-mp3
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');

var today = new Date()
var min = String(today.getMinutes())
var hour = String(today.getHours())
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = dd+mm+yyyy+'-'+hour+'_'+min;

const config = {
    "cover": "./assets/radiocn.jpg",
    "name": today,
    "m3u8_path": "https://rdamchp1-lh.akamaihd.net/i/rdamchp_1_0@193678/master.m3u8",
    "bitrate": "96"
};

const file_path = `Music/${config.name}.mp3`;


const stream = ffmpeg(config.m3u8_path)
    	//.duration('1:00')
    	.on('start', () => { console.log('Processing started !'); })
    	.on('progress', (progress) => {console.log('Timemark: ' + progress.timemark);})
    	.on('end', () => { addCover(); })
    	.on('error', (err) => { console.log('An error occurred: ' + err.message); })
    	.audioCodec('libmp3lame')
    	.audioBitrate(config.bitrate)
    	.mergeToFile(config.name+'_temp.mp3', './Music')

    
const stop = (audio) => {
   return audio.ffmpegProc.stdin.write('q');
}


function addCover() {
    const cmd = `ffmpeg -i ${config.name}_temp.mp3 -i ${config.cover} -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="RadioCN" -metadata:s:v comment="RadioCN" \"${file_path}\" && del ${config.name}"_temp.mp3"`;
    exec(cmd, () => {
        console.log(`Processing finished !\nfile path : ${encodeURI(file_path)}`);
    });
}


setTimeout(() => {
    // safely end the ffmpeg process without destroying the file.
    
    stop(stream)
    
  }, 3580000);