const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 60);


schedule.scheduleJob(rule, function(){
    console.log('Rodando Script a cada 1 hora');
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
        const cmd = `ffmpeg -i ${config.name}"_temp.mp3" -i ${config.cover} -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" \"${file_path}\" && del ${config.name}"_temp.mp3"`;
        exec(cmd, () => {
        console.log(`Processing finished !\nfile path : ${encodeURI(file_path)}`);
        });
    }

    setTimeout(() => {
        stop(stream)
    }, 3580000); //(1000*60*60)-20000
  
});