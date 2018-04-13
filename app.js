var app = function () {

/*core module*/
var express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    path = require('path');

var http = require('http');
var request=require("request");

    
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
        var type=os.type();
        var arch=os.arch();
        var networkInterfaces=os.networkInterfaces();
        

        res.render("jayesh-test.html",{layout:false,networkInterfaces:networkInterfaces,arch:arch,type:type,total_memory:total_memory,freemem:freemem,cpuavg:cpuavg,uptime:uptime,_CPU_:_CPU_});  
//});

  }catch(err){

    var os=require("os");
        var total_memory=os.totalmem();
        var freemem=os.freemem();
        var cpuavg=os.loadavg();
        var uptime=os.uptime();
        var _CPU_=os.cpus();
        var type=os.type();
        var arch=os.arch();
        var networkInterfaces=os.networkInterfaces();

        res.render("jayesh-test.html",{layout:false,networkInterfaces:networkInterfaces,arch:arch,type:type,total_memory:total_memory,freemem:freemem,cpuavg:cpuavg,uptime:uptime,_CPU_:_CPU_});  


  }


});


var crypto  = require("crypto");

function encrypt(key, data) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var crypted = cipher.update(data, 'utf-8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
}

function decrypt(key, data) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
}



/*Music*/
app.get("/music/version",function(req,res){
  var version = req.query.version;
  if(!version){
    version=1;
  }
  fs.readFile(process.cwd()+"/public/json_obj/music/music_version.txt","utf-8",function(err,data){
     if(err){
        res.json({current_version:1,version:version});
     }else{
        res.json({current_version:parseInt(data,10),version:version});
     }
  });
});


// app.get("/music/lot_encrypt",function(req,res){
//      var key = "music_mix12_keyjson_obj10_";
//      var lot_json = require(process.cwd()+"/public/json_obj/music/music_video_list.json");
//      var new_data= encrypt(key,JSON.stringify(lot_json).toString());
//      //var lot = JSON.parse(decrypt(key,old_encrypt_data));

//      fs.writeFile(process.cwd()+"/public/json_obj/music/music_video_list.json",new_data,function(err,data){
//         res.send(new_data);
//      });
// });

app.get("/music/lot",function(req,res){
  var lot_json = require(process.cwd()+"/public/json_obj/music/music_video_list.json");
  res.json({lot:lot_json});
});

/*Music*/



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



