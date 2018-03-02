var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require("url");


// require('speedtest-net')().on('uploadspeed', speed => {
//   console.log('Upload speed:',(speed * 125).toFixed(2),'KB/s');
// });

// require('speedtest-net')().on('downloadspeed', speed => {
//   console.log('Download speed:', (speed * 125).toFixed(2), 'KB/s');
// });

http.createServer(function (request, response) {
     
     var queryData = url.parse(request.url, true).query;
     var pro_path=process.cwd()+"/public/media";

     if(queryData){
        if(queryData.tag){
            var file_name=pro_path+"/"+queryData.tag;
            fs.stat(file_name,function(err, stats) {
              if(err){
                return response.end("No file found : "+file_name);
              }else{
                var range = request.headers.range;
                if (!range) {
                    return response.end("-");
                }else{
                    var positions = range.replace(/bytes=/, "").split("-");
                    var start = parseInt(positions[0], 10);
                    var total = stats.size;
                    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                    var chunksize = (end - start) + 1;

                    response.writeHead(206, {
                        "Content-Range": "bytes " + start + "-" + end + "/" + total,
                        "Accept-Ranges": "bytes",
                        "Content-Length": chunksize,
                        "Content-Type": "video/mp4"
                    });
                    var stream = fs.createReadStream(file_name,{start: start, end: end }).on("open", function() {stream.pipe(response); }).on("error", function(err) {console.log(err);res.end(err); });
                }
              }
           });
        }else{
          response.write("<html><body><video src='/?tag=1.mp4' controls=true> autoplay=true </video> </body></html>");
          response.end();
        }
     }else{
          response.write("<html><body><video src='/?tag=1.mp4' controls=true> autoplay=true </video> </body></html>");
          response.end();
     }

}).listen(process.env.PORT || 5000 );
console.log('Server running...');