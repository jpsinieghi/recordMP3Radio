function clipVideo() {

    var params = {
      input: "https://rdamchp1-lh.akamaihd.net/i/rdamchp_1_0@193678/master.m3u8",
      start: 0,
      duration: 10,
      output: 'output_file'
    };

    return new Promise(function(resolve, reject) {

        ffmpeg(params.input)
            .setStartTime(params.start)
            .setDuration(params.duration)
            .save(params.output)
            .on('start', function(commandLine) {
                console.log('start : ' + commandLine);
            })
            .on('progress', function(progress) {
                console.log('In Progress !!' + Date());
            })
            .on('end', function() {
                console.log("downlaod resolved");
                return resolve(params.clippedFile);

            })
            .on('error', function(err) {
                console.log("reject");
                return reject(err);
            })
    });
}