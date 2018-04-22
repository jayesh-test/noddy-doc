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
    //console.log(videoInfo);

    var url = videoInfo.urls[0];
    var filename = videoInfo.title + ".flv";
    var res1=op.res1;

    fs.writeFile(process.cwd()+"/url_list",JSON.stringify(videoInfo.urls),function(){
      //res1.send("Ok");
      //return 0;
    });

    console.log(url);

    var video_html="<video width='400' controls> <source src="+url+" type='video/mp4'> Your browser does not support HTML5 video. </video>";

    res1.send(video_html);
    

    //var request = require("request");
    //request.get(url).pipe(res1);

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



function scrape_from_youtube(video_id,callback) {

var http = require('https');
var fs = require('fs');

  https.get("https://pickvideo.net/download?video="+video_id,function(res) {
    var chunks = [];
    res.on('data', function(chunk){
      chunks.push(chunk);
    }).on('end', function(){


              var data = Buffer.concat(chunks).toString();
              
              var cheerio = require('cheerio');
              var $ = cheerio.load(data);
              var format = {};
              var dom = $(".downloadsTable").first().find("tr td:first-child");
              //var expire_link_timstamp_regex=/(?<=expire=)(.*)\d{10}/gmi;
              //var expire_link_timstamp_regex=/expire=\d{10}/gmi;


                  dom.each(function(i,val){

                     //var expire_timestamp_val = $(val).next().next().next().find("a").attr("href");

                      //console.log(expire_timestamp[0]);

                      format[$(val).html()]={link:$(val).next().next().next().find("a").attr("href"),size:$(val).next().next().html(),format:$(val).next().html()} 


                     // if(expire_timestamp[0]){
                     //  expire_timestamp=expire_timestamp[0].split("=")[1];
                     //  format[$(val).html()]={expire:expire_timestamp[0],link:$(val).next().next().next().find("a").attr("href"),size:$(val).next().next().html(),format:$(val).next().html()}
                     // }else{
                     //  format[$(val).html()]={expire:0,link:$(val).next().next().next().find("a").attr("href"),size:$(val).next().next().html(),format:$(val).next().html()} 
                     // }
                     
                  });

                    // var expire_timestamp = expire_link_timstamp_regex.exec(format[Object.keys(format)[0]].link);
                    // console.log(expire_timestamp);
                    // console.log(format[Object.keys(format)[0]].link);


                  //console.log(data);
                  callback({format:format});
                  /*Send*/

              /*Search for dom*/
              //res1.send(data);
              //res1.json({response:format});
              /*Searh dom for 720p*/
          });
       });


};





// app.get("/redis/test",function(req,res){


//       var redis = require('redis');
//   var config = {
//     port: 19630,
//     secret: 'secret',
//     redisConf: {
//       host: 'redis-19630.c16.us-east-1-2.ec2.cloud.redislabs.com', // The redis's server ip 
//       port: 19630,
//       pass: 'MK1xuD8LKfw16UwFmhed73WXd7JDn0mT'
//     }
//   };
// var redisClient = redis.createClient(config.redisConf);


//       redisClient.auth('MK1xuD8LKfw16UwFmhed73WXd7JDn0mT',function(err){
//           console.log(err);
//       });


//        redisClient.on('connect', function() {

//       redisClient.set("test","1",function(err,data){
//           console.log(err);
//           redisClient.get("test",function(err,data){
//             console.log(err);
//             console.log(data);
//             res.send(data);
//           });
//       });

//       console.log('connected to redis!!');
//      });

//      redisClient.on('error', function(err) {
//        console.log("Error...");
//        console.log(err);
//      });




// });



// app.get("/ytb/scrape1",function(req,res1){

//   var http = require('https')
//   var fs = require('fs')


//   https.get("https://pickvideo.net/download?video=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQ1TXk7ZdiQE",function(res) {
//         var chunks = []
//         res.on('data', function(chunk){chunks.push(chunk)
//         }).on('end', function(){



//           var data = Buffer.concat(chunks).toString()
//           fs.writeFile(process.cwd()+"/pick_video.html",data,function(){
//       //res1.send("Ok");
//       //return 0;
//     }); 

//           res1.send(data);

//           //console.log(data);

          
//         })
//       }).on('error', function(e) {
//         console.log("Got error: " + e.message)
//       });


  
// });

app.get("/ytb/test_mongo",function(req,res1){

  /*Working*/
   var MongoClient = require('mongodb').MongoClient;

  // var db = null;
  // MongoClient.connect('mongodb://ytb_user_mlab149:ytb_mlab_pwd12@ds247439.mlab.com:47439/ytb_test', function(err,database) {
  //          if(err){
  //             res1.send(err);
  //          }else{
  //           console.log(err);
  //           //console.log(database);
  //           var db1 = database.db('ytb_test');

  //            db1.collection('ytb').insert({url:[1,2]},function(err,doc) {
  //               if(err){
  //              res1.send(err);
  //           }else{

  //                 db1.collection('ytb').find({}).toArray(function(err,doc) {
  //                 if(err){
  //                    res1.send(err);
  //                 }else{
  //                   res1.send(JSON.stringify(doc));
  //                 }
  //                });

                    
  //           }
  //          });




  //         }
  // });



// db.ytb.update(
//    {"ytb_code":1},
//    {"ytb_code":1,test:"1243"},
//    {
//      upsert: true     
//    }
// )

// MongoClient.connect('mongodb://ytb_user_mlab149:ytb_mlab_pwd12@ds247439.mlab.com:47439/ytb_test', function(err,database) {
//            if(err){
//               res1.send(err);
//            }else{
//             var db1 = database.db('ytb_test');
//            db1.collection('ytb').insert({url:[1,2]},function(err,doc) {
//                 if(err){
//                res1.send(err);
//             }else{

//                   db1.collection('ytb').find({}).toArray(function(err,doc) {
//                   if(err){
//                      res1.send(err);
//                   }else{
//                     res1.send(JSON.stringify(doc));
//                   }
//                  });

                    
//             }
//            });


//           }
//   });

});


/*Mongo*/
var MongoClient = require('mongodb').MongoClient;
var mongo_database = "";
MongoClient.connect('mongodb://ytb_user_mlab149:ytb_mlab_pwd12@ds247439.mlab.com:47439/ytb_test', function(err,database) {
  if(err){
      mongo_database="";
      console.log(err);
  }else{
    console.log("Remote Mongodb connect...");
      mongo_database = database.db('ytb_test');
  }
});

  // var db = null;
  // MongoClient.connect('mongodb://ytb_user_mlab149:ytb_mlab_pwd12@ds247439.mlab.com:47439/ytb_test', function(err,database) {
  //          if(err){
  //             res1.send(err);
  //          }else{
  //           console.log(err);
  //           //console.log(database);
  //           var db1 = database.db('ytb_test');

  //            db1.collection('ytb').insert({url:[1,2]},function(err,doc) {
  //               if(err){
  //              res1.send(err);
  //           }else{

  //                 db1.collection('ytb').find({}).toArray(function(err,doc) {
  //                 if(err){
  //                    res1.send(err);
  //                 }else{
  //                   res1.send(JSON.stringify(doc));
  //                 }
  //                });

                    
  //           }
  //          });




  //         }
  // });



// db.ytb.update(
//    {"ytb_code":1},
//    {"ytb_code":1,test:"1243"},
//    {
//      upsert: true     
//    }
// )

app.get("/ytb/check_version",function(req,res1){
    /*Check which*/

    var fs = require('fs')
    var version = req.query.version;

    fs.readFile(path+"/ytb_version.txt","utf-8",function(err,data){
                if(err){
                   res1.send({status:1,current_version:1,version:1});
                }else{
                   var current_version = parseInt(data,10);
                   res1.send({status:1,current_version:current_version,version:version});                                                       
                }
    });

});

app.get("/ytb/scrape",function(req,res1){

  var https = require('https');
  var fs = require('fs')
  var video_id = req.query.id;
  var expire_time = req.query.expire_time;

  if(video_id){
      
      /*No:Scrape fresh and push into mongodb*/
      mongo_database.collection('ytb').find({ytb_code:video_id,expire:{$gt:expire_time}}).toArray(function(err,doc){
         if(err){
            scrape_from_youtube(video_id,function(format_obj){
                console.log(format_obj);
                res1.send("Scrape and push");
            });
         }else{
              //console.log(doc);

              if(doc.length>0){
                  /*Someone already push new epire date just use it*/
                    console.log("use first document");
                    //res1.send(JSON.stringify(doc));
                    var format={};
                    for(i in doc[0].url){
                      format[i]={link:doc[0].url[i]};
                    }

                    /*Generate links here*/
                    res1.send({status:1,response:{format:format}});
              }else{
                  console.log("First user to pull expire url");
                  scrape_from_youtube(video_id,function(format_obj){
                    //console.log(format_obj);
                    //var expire_time = format_obj.format[Object.keys(format_obj.format)[0]].link;

                    var expire_link_timstamp_regex=/expire=\d{10}/gmi;
                    var expire_timestamp = expire_link_timstamp_regex.exec(format_obj.format[Object.keys(format_obj.format)[0]].link);
                    //console.log(expire_timestamp[0].toString());
                    //console.log(expire_timestamp[0].toString().split("=")[1]);
                    var expire_time=expire_timestamp[0].toString().split("=")[1];

                    var links_url = {};
                    //console.log("expire_time = "+expire_time);

                    for(i in format_obj.format){
                        links_url[i]=format_obj.format[i].link;
                    }

                    /*Push into mongodb*/
                    mongo_database.collection('ytb').update({"ytb_code":video_id},{"ytb_code":video_id,add_date:Date.now(),url:links_url,expire:parseInt(expire_time,10)},{upsert: true },function(err,doc){
                       if(err){
                         console.log("Fail to push into mongodb");
                         console.log(err);
                       }else{
                         console.log("okay pushed");
                       }
                    });
                    res1.send({status:1,links_url:links_url,response:format_obj,expire_time:expire_time});
                  });


                  
                  //res1.send("Scrape and push");
                  /*Use*/
                  // scrape_from_youtube(ytb_code,function(format_obj){
                  // });
              }
         }
      });
   }else{
     res1.send({status:0,err:"Video id not passed"});
   }
});


// app.get("/ytb/scrape",function(req,res1){

//   var http = require('http')
//   var fs = require('fs')
//   //var video_id = "tCddpGLE0aw";
//   //var video_id = "tCddpGLE0aw";
//   var video_id = req.query.id;

//   if(video_id){


//        http.get("http://www.youtube.com/get_video_info?video_id="+video_id, function(res) {
//           var chunks = [];
//         res.on('data', function(chunk){chunks.push(chunk)

//         }).on('end', function(){
//           var data = Buffer.concat(chunks).toString()
//            var videoInfo = parseVideoInfo(data)
//           if(videoInfo.title=="-"){
//             console.log(data);
//             //res1.send("not ok");
//             res1.send({video_id:video_id,videoInfo:[]});
//           }else{
//             //downloadVideo({videoInfo:videoInfo});

//             /*Send this urls to user*/
//             //res1.send({video_id:video_id,videoInfo:videoInfo});
//             var videoInfo = parseVideoInfo(data)

//             downloadVideo({res1:res1,videoInfo:videoInfo});
//             //res1.send("ok");
//           }
          
//         })
//       }).on('error', function(e) {
//         console.log("Got error: " + e.message)
//       });

//   }



  

// });



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

                  /*Read how many version-file present*/
                  var dir = process.cwd()+"/public/json_obj/ytb";
                  var file_list=[];

                  fs.readdir( dir, function(err, list) {
                    if(err){
                      async_recall(null,{version_history:[],version:version,lot:JSON.parse(data)});
                    }else{
                      var regex = new RegExp("ytb_video_list-");
                      list.forEach( function(item) {
                        if( regex.test(item) ){ 
                            //console.log(item);
                            item =  item.substring(item.indexOf("-")+1,item.indexOf("."));
                            file_list.push(item);
                        }
                      });
                      async_recall(null,{version_history:file_list,version:version,lot:JSON.parse(data)});
                    }
                });
                  //async_recall(null,{version_history:["1","2"],version:version,lot:JSON.parse(data)});
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
          console.log(err);
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

                  var dir = process.cwd()+"/public/json_obj/music";
                  var file_list=[];

                  fs.readdir( dir, function(err, list) {
                    if(err){
                      async_recall(null,{version_history:[],version:version,lot:JSON.parse(data)});
                    }else{

                      var regex = new RegExp("music_video_list-");
                      list.forEach( function(item) {
                        if( regex.test(item) ){ 
                            //console.log(item);
                            item =  item.substring(item.indexOf("-")+1,item.indexOf("."));
                            file_list.push(item);
                        }
                      });
                      //async_recall(null,{version_history:file_list,version:version,lot:JSON.parse(data)});
                      async_recall(null,{version_history:file_list,version:version,lot:JSON.parse(data)});
                    }
                });

                  
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



