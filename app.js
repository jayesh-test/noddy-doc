var app = function () {

/*core module*/
var express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    path = require('path');

var http = require('http');
var https = require('https');
var request=require("request");

var cors = require("cors");
/*middleware*/


var async = require("async");


    
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
    app.use(cors());

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

/*ytb*/

function parseVideoInfo(videoInfo) {
    var rxUrlMap = /url_encoded_fmt_stream_map=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/

    var match = videoInfo.match(rxUrlMap);

    if(match){
      urlmap = unescape(videoInfo.match(rxUrlMap)[1])
    
      var rxUrlG = /url=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/g
      var rxUrl  = /url=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
      var urls = urlmap.match(rxUrlG)
      urls = map(urls, function(s) {return s.match(rxUrl)[1]} )
      urls = map(urls, unescape)
      
      var rxTitle  = /title=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
      //var title = argv.o ? argv.o : videoInfo.match(rxTitle)[1]
      
      return { title: videoInfo.match(rxTitle)[1], urls: urls }
    }else{
      return { title:"-", urls: [] }
    }
}

function downloadVideo(op) {

    var videoInfo = op.videoInfo;

    var url = videoInfo.urls[0];
    var filename = videoInfo.title + ".flv";
    var res1=op.res1;



    // fs.writeFile(process.cwd()+"/url_list",JSON.stringify(videoInfo.urls),function(){
    //   res1.send("Ok");
    //   return 0;
    // }); 

    console.log(url);

    var video_html="<video width='400' controls> <source src="+url+" type='video/mp4'> Your browser does not support HTML5 video. </video>";
    //res1.send(video_html);

    var request = require("request");

    request.get(url).pipe(res1);

    // https.get(url,
    //   function(res) {
    //     var stream = fs.createWriteStream(filename)
    //     res1.pipe(stream)
    //   })
      
    //console.log("Downloading to "+filename);
}



function map (a,f) {
    for(i=0;i<a.length;i++){
        a[i]= f(a[i])
    }
    return a
}



app.get("/ytb/test",function(req,res1){

  var http = require('http')
  var fs = require('fs')
  //var video_id = "tCddpGLE0aw";
  //var video_id = "tCddpGLE0aw";
  var video_id = req.query.id;
  if(video_id){

       http.get("http://www.youtube.com/get_video_info?video_id="+video_id, function(res) {
        var chunks = []
        res.on('data', function(chunk){chunks.push(chunk)
        }).on('end', function(){
          var data = Buffer.concat(chunks).toString()
          var videoInfo = parseVideoInfo(data)
          if(videoInfo.title=="-"){
            console.log(data);
            res1.send("not ok");
          }else{
            //downloadVideo(videoInfo);
            downloadVideo({res1:res1,videoInfo:videoInfo});
            //res1.send("ok");
          }
          
        })
      }).on('error', function(e) {
        console.log("Got error: " + e.message)
      });

  }



  

});

app.get("/ytb/version",function(req,res){
  /**/
});

app.get("/ytb/lot",function(req,res){
   var version = req.query.version;
   var version_history=[];
   var lot = {};
   var category=[];
   var reward_category=[];  // Last three category is the reward category always

   var path = process.cwd()+"/public/json_obj/ytb";

      async.waterfall([
         function(async_recall){
            if(typeof(version)=="undefined" || version==0){

               fs.readFile(path+"/ytb_version.txt","utf-8",function(err,data){
                if(err){
                   async_recall(err,{version:1});
                }else{
                   async_recall(null,{version:parseInt(data,10)});
                }
               });
            }else{
              async_recall(null,{version:version});
            }
         },
         function(args,async_recall){
            var version = args.version;
            fs.readFile(path+"/ytb_video_list-"+version+".json","utf-8",function(err,data){
               if(err){
                  async_recall(err,{});
               }else{
                  async_recall(null,{version_history:["1","2"],version:version,lot:JSON.parse(data)});
               }
            });
            /*Get curr*/
         },
         function(args,async_recall){
            /*Category from lot*/
            var version=args.version;
            var version_history=args.version_history;
            var lot = args.lot;
            var category = Object.keys(lot);
            var reward =  category.splice(category.length-3);

            async_recall(null,{version_history:version_history,version:version,lot:lot,category:category,reward:reward});
         },
         function(args,async_recall){
            /*Category from lot*/
            var version_history=args.version_history;
            var version=args.version;
            var lot = args.lot;
            var category = args.category;
            var reward = args.reward;

            async_recall(null,{version_history:version_history,version:version,lot:lot,category:category,reward:reward});
         },
      ],function(err,results){
         if(err){
           res.json({status:0,err:err});
         }else{
           res.json({status:1,version:results.version,version_history:results.version_history,lot:results.lot,category:results.category,reward:results.reward});
         }
      });
   
});
/*ytb*/



/*Music*/
app.get("/music/lot",function(req,res){
   var version = req.query.version;
   var version_history=[];
   var lot = {};
   var category=[];
   var reward_category=[];  // Last three category is the reward category always

   var path = process.cwd()+"/public/json_obj/music";

      async.waterfall([
         function(async_recall){
            if(typeof(version)=="undefined" || version==0){

               fs.readFile(path+"/music_version.txt","utf-8",function(err,data){
                if(err){
                   async_recall(err,{version:1});
                }else{
                   async_recall(null,{version:parseInt(data,10)});
                }
               });
            }else{
              async_recall(null,{version:version});
            }
         },
         function(args,async_recall){
            var version = args.version;
            fs.readFile(path+"/music_video_list-"+version+".json","utf-8",function(err,data){
               if(err){
                  async_recall(err,{});
               }else{
                  async_recall(null,{version_history:["1","2","3","4","5"],version:version,lot:JSON.parse(data)});
               }
            });
            /*Get curr*/
         },
         function(args,async_recall){
            /*Category from lot*/
            var version=args.version;
            var version_history=args.version_history;
            var lot = args.lot;
            var category = Object.keys(lot);

            async_recall(null,{version_history:version_history,version:version,lot:lot,category:category});
         },
         function(args,async_recall){
            /*Category from lot*/
            var version_history=args.version_history;
            var version=args.version;
            var lot = args.lot;
            var category = args.category;

            async_recall(null,{version_history:version_history,version:version,lot:lot,category:category});
         },
      ],function(err,results){

        //console.log(err);
        //console.log(results);
         if(err){
           res.json({status:0,err:err});
         }else{
           res.json({status:1,version:results.version,version_history:results.version_history,lot:results.lot,category:results.category});
         }
      });
   
});

/*Music*/


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


/*Youtube*/
app.get("/ytb/lot",function(req,res){

    var category=['a','b','c','d'];
    var reward_category=['b','d'];
    var version_list = ['1','2'];

    var lot=[{a:{'ytb_code':1,ytb_title:"13",ytb_poster:"25"}}];
    res.json({lot:lot,version_list:version_list,category:category,reward_category:reward_category});
    
});

/*Youtube*/

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
  /*Category-1,2,3*/
  /*Load lot*/
  /*Send version*/
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



