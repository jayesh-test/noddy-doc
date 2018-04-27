var http = require('https');
var fs = require('fs')



http.get("https://www.youtube.com/get_video_info?video_id=mj2S1LrGLOQ", function(res) {
  var chunks = []
  res.on('data', function(chunk){chunks.push(chunk)
  }).on('end', function(){
    var data = Buffer.concat(chunks).toString()
    var videoInfo = parseVideoInfo(data)
    downloadVideo(videoInfo)
  })
}).on('error', function(e) {
  console.log("Got error: " + e.message)
});

function parseVideoInfo(videoInfo) {
    var rxUrlMap = /url_encoded_fmt_stream_map=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
    urlmap = unescape(videoInfo.match(rxUrlMap)[1])
    
    var rxUrlG = /url=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/g
    var rxUrl  = /url=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
    var urls = urlmap.match(rxUrlG)
    urls = map(urls, function(s) {return s.match(rxUrl)[1]} )
    urls = map(urls, unescape)

    

    // fs.writeFile(process.cwd()+"/tt.mp4",urls,function(){
    // });

    var rxTitle  = /title=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
    //var title = argv.o ? argv.o : videoInfo.match(rxTitle)[1]
    
    return { title: "Test", urls: urls }
}

function downloadVideo(videoInfo) {
    var url = videoInfo.urls[0];
    var filename = videoInfo.title + ".flv"
    
  
    // http.get(url,
    //   function(res) {
    //     var stream = fs.createWriteStream(filename)
    //     res.pipe(stream)
    //   })
      
    console.log("Downloading to "+filename);
}



function map (a,f) {
    for(i=0;i<a.length;i++){
        a[i]= f(a[i])
    }
    return a
}