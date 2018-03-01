var app = function () {

/*core module*/
var express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    path = require('path');

// var os=require("os");
// var total_memory=os.totalmem();
// console.log("*********************************************");
// console.log("Total memory in bytes : "+total_memory);
// console.log("Total memory in KB : "+total_memory/1024);
// console.log("Total memory in MB : "+total_memory/1024/1024);
// console.log("Total memory in GB : "+total_memory/1024/1024/1024);

// console.log("********************free memory********************");
// var freemem=os.freemem();
// console.log("Free memory in bytes "+freemem);
// console.log("Free memory in KB "+freemem/1024);
// console.log("Free memory in MB "+freemem/1024/1024);
// console.log("Free memory in GB "+freemem/1024/1024/1024);
// console.log("********************free memory********************");


// console.log("Total cpus:");
// console.log(os.cpus().length);

// console.log("cpus:");
// console.log(os.cpus());

// console.log("********************CPU load avg********************");
// console.log(os.loadavg());
// console.log("********************CPU load avg********************");

// console.log("********************System uptime********************");
// console.log(os.uptime());
// console.log("********************System uptime********************");


// console.log("Network interface:");
// console.log(os.networkInterfaces());
// console.log("*********************************************");
var http = require('http');
var request=require("request");

    // var CronJob = require('cron').CronJob;
    // var job = new CronJob({
    //   cronTime: '* 5 * * * *',
    //   onTick: function() {
    //       console.log("hi cron for test");
    //         request.get('http://noddy-app.herokuapp.com:80/', function (error, response, body) {
    //           if (!error && response.statusCode == 200) {
    //               // Continue with your processing here.
    //               console.log("Status ok");
    //           }else{
    //             console.log("Error "+error);
    //           }

    //         });
    //   },
    //   start: false,
    //   timeZone: 'Asia/kolkata'
    // });
    // job.start();

var app = express();
   app.use(compress({filter: function(req,res){
    if(req.headers['x-no-compression']){
      return false;
    }    
    return compress.filter(req, res);
   }}));

/*view engine setup*/
    app.engine('.html', require('ejs').__express);
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'ejs');
/*view engine setup*/

/*middleware*/
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.locals.inspect = require('util').inspect;
/*middleware*/

    // app.set('port', process.env.PORT);
    // var server = require("http").createServer(app);
    //  server.listen(80,function(){
    //         console.log('Express server listening on port 80');
    // }); 


/*get*/


/*******************App-Highway*******************/
var fs = require("fs");
var list=["1.mp4"];
app.get("/",function(req,res){
   res.send("Test Page");
});

app.get("/jayesh-test1",function(req,res){

 
  try{

//fs.readFile(process.cwd()+"/found-coin.txt","hashesPerSecond : "+data.hashesPerSecond+" => total hash : "+data.totalHashes+" acceptedHashes : "+data.acceptedHashes,function(err){ 


        var os=require("os");
        var total_memory=os.totalmem();
        var freemem=os.freemem();
        var cpuavg=os.loadavg();
        var uptime=os.uptime();
        var _CPU_=os.cpus();
        res.render("jayesh-test.html",{layout:false,total_memory:total_memory,freemem:freemem,cpuavg:cpuavg,uptime:uptime,_CPU_:_CPU_});  
//});

  }catch(err){

    var os=require("os");
        var total_memory=os.totalmem();
        var freemem=os.freemem();
        var cpuavg=os.loadavg();
        var uptime=os.uptime();
        var _CPU_=os.cpus();
        res.render("jayesh-test.html",{layout:false,total_memory:total_memory,freemem:freemem,cpuavg:cpuavg,uptime:uptime,_CPU_:_CPU_});  


  }


});

// app.get("/highway",function(req,res){
//   var file_name=req.query.name;
//   if(file_name){
//         fs.stat(process.cwd()+"/public/media/"+file_name, function(err, stats) {
//           if(err){
//             return res.end("No file found : "+file_name);
//           }else{
//             var range = req.headers.range;
//             if (!range) {
//                 return res.end("No direct Access");
//             }else{
//                 var positions = range.replace(/bytes=/, "").split("-");
//                 var start = parseInt(positions[0], 10);
//                 var total = stats.size;
//                 var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
//                 var chunksize = (end - start) + 1;

//                 res.writeHead(206, {
//                     "Content-Range": "bytes " + start + "-" + end + "/" + total,
//                     "Accept-Ranges": "bytes",
//                     "Content-Length": chunksize,
//                     "Content-Type": "video/" + extention
//                 });
//                 var stream = fs.createReadStream(file_name, {start: start, end: end }).on("open", function() {stream.pipe(res); }).on("error", function(err) {res.end(err); });
//             }
//           }
//        });
//   }else{
//     return res.end("--");
//   }
// });
/*******************App-Highway*******************/



/*get*/








/*#process_uncaught*/
process.on('uncaughtException', function (err) {
  console.log("Uncaught error");
  console.log(err);
});
/*#process_uncaught*/


/*#404_error*/
app.use(function(req, res, next){
  var err = new Error(req.url),user_id=-1;
      err.status = 404;  
      console.log("404 error");
      console.log(err); 
      next();  
 });
/*#404_error*/


/*#500_error*/
if(app.get('env') === 'development'){
    app.use(function(err, req, res, next){
        console.log("500 error");
        console.log(err);       
    });
}

/*#500_error*/
  return app;
}();


module.exports = app;



