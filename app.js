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
var port = normalizePort(process.env.PORT || 5000);

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
    ////         console.log('Express server listening on port 80');
    // }); 


/*get*/


/*******************App-Highway*******************/
var fs = require("fs");
var list=["1.mp4"];
app.get("/",function(req,res){
  res.render("test.html",{layout:false,port:port});      
});




/******************DATE-CHAT********************/
// var date_men=[];
// var date_women=[];

// app.get("/date_chat/register",function(req,res){
//    /**/
// });

// app.get("/date_chat/pairing",function(req,res){
//    /**/
// });

// app.get("/date_chat/message",function(req,res){
//    /**/
// });

// app.get("/date_chat/media",function(req,res){
//    /**/
// });

// app.get("/date_chat/media",function(req,res){
// });

// app.get("/date_chat/spot_match",function(req,res){
//     /*If you match */
// });

/******************DATE-CHAT********************/



/*****************************************Me-Alone*****************************************/




/*#process_uncaught*/
process.on('uncaughtException', function (err) {
  //console.log("Uncaught error");
  //console.log(err);
});
/*#process_uncaught*/


/*#404_error*/
app.use(function(req, res, next){
  var err = new Error(req.url),user_id=-1;
      err.status = 404;  
      console.log("404 error");
      console.log(req.url); 
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


var debug = require('debug')('myapp:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */


app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

// var io = require('socket.io')({
//     log: false,
//     agent: false,
//     origins: '*:*',
//     transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
// });
// io.listen(server);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


var io = require('socket.io').listen(server,{log: 10,"transport":['websocket','xhr-polling'],"polling duration":10,'origins':'*:*'});



var _ALONE_={
  "all":{}
};

var MALE_BOX=[];
var FEMALE_BOX=[];

io.on('connection', function(client){

  client.on("disconnect",function(data,callback){

    var csocket_id = client.id;
     if(csocket_id.indexOf("/")==-1){
       //csocket_id=csocket_id.substr(0);
       csocket_id="/#"+csocket_id;
     }

     //console.log("disconnect");
     try{
      delete _ALONE_['all']['male'][csocket_id];
      delete _ALONE_['all']['female'][csocket_id];
      

      MALE_BOX.splice(MALE_BOX.indexOf(csocket_id), 1);
      FEMALE_BOX.splice(FEMALE_BOX.indexOf(csocket_id), 1);

     }catch(err){

     }
     ////console.log(_ALONE_);
  });

  client.on("stats",function(data,callback){

    var live_user_count =  Object.keys(io.sockets.connected).length;
    var female_count = FEMALE_BOX.length;
    var male_count = MALE_BOX.length;

    callback({status:1,live_user_count:live_user_count,male_count:male_count,female_count:female_count});      

  });

  client.on("leave_session",function(data,callback){

     var csocket_id = client.id;
     if(csocket_id.indexOf("/")==-1){
       //csocket_id=csocket_id.substr(0);
       csocket_id="/#"+csocket_id;
     }


    //console.log("Leave session");
    try{
      delete _ALONE_['all']['male'][csocket_id];
      delete _ALONE_['all']['female'][csocket_id];
      

      MALE_BOX.splice(MALE_BOX.indexOf(csocket_id), 1);
      FEMALE_BOX.splice(FEMALE_BOX.indexOf(csocket_id), 1);

     }catch(err){

     }

  });

  ////console.log(client.id);
  client.on("chat",function(data,callback){

     var csocket_id = client.id;
     if(csocket_id.indexOf("/")==-1){
       //csocket_id=csocket_id.substr(0);
       csocket_id="/#"+csocket_id;
     }

      /*check parameters*/
      async.waterfall([
         function(recall){
           /*check parameter*/
           if(typeof(data.type)=="undefined" || typeof(data.my_id)=="undefined" || typeof(data.mate_id)=="undefined" || typeof(data.chat_text)=="undefined"){
            recall({err:"Parameter missing"},{});
           }else{
            if(data.type=="text"){
              io.to(data.mate_id).emit("chat_text",data);
            }else{
              io.to(data.mate_id).emit("chat_svg",data);
            }
            recall(null,{});
           }
         }         
      ],function(err,results){
         if(err){
           //console.log(err);
         }
      });
  });

  client.on("pic",function(data,callback){
    /*Not in first release*/
  });

  client.on("exchange_profile_pic",function(data,callback){
    io.to(data.socket_id).emit("exchange_profile_pic",data);
  });

  client.on("match_accept",function(data,callback){
    //console.log("Accept....");
    //console.log(data);
    io.to(data.socket_id).emit("match_accept",data);
  });


  client.on("match_reject",function(data,callback){
    //console.log("Accept....");
    //console.log(data);

    io.to(data.socket_id).emit("match_reject",data);
    // if(data.preference=="male"){
    //  io.to(data.socket_id).emit("match_reject",data);
    // }else{
    //  io.to(data.socket_id).emit("match_reject",data);
    // }
  });


  client.on("leave_current_mate",function(data,callback){
     var mate_id = data.mate_id;

     var csocket_id = client.id;
     if(csocket_id.indexOf("/")==-1){
       //csocket_id=csocket_id.substr(0);
       csocket_id="/#"+csocket_id;
     }
     
     io.to(mate_id).emit("leave_current_mate",{});

     try{
      delete _ALONE_['all']['male'][csocket_id];
      delete _ALONE_['all']['female'][csocket_id];


      

     }catch(err){

     }

     //console.log(_ALONE_);
     callback({});
     
  });

  client.on("search",function(data,callback){

    var csocket_id = client.id;
     if(csocket_id.indexOf("/")==-1){
       //csocket_id=csocket_id.substr(0);
       csocket_id="/#"+csocket_id;
     }


    /*search by preference who inside pool and waiting*/
    async.waterfall([
      function(recall){
        /*check*/
        //console.log("search == =");
        //console.log(data);
        if(typeof(data.my_id)=="undefined" ||  typeof(data.region)=="undefined" || typeof(data.username)=="undefined" || typeof(data.bio)=="undefined" || typeof(data.preference)=="undefined"){
          recall("Parameter Missing",{});
        }else{

           //console.log("Alone");
           //console.log(_ALONE_);

           //console.log("Male");
           //console.log(MALE_BOX);

           //console.log("FeMale");
           //console.log(FEMALE_BOX);

           if(data.preference=="female"){
            var flag=0;


            /*Check is this female found*/
            var pop_female=-1;

            //console.log("FEMALE_BOX.length = "+FEMALE_BOX.length);
            while(FEMALE_BOX.length>0){
               pop_female = FEMALE_BOX.shift();
               //console.log("%%%%");
               //console.log(pop_female);
               //console.log("%%%%");

               if(pop_female){
                 //console.log("Female pop");
                 break;
               }
            }
            if(pop_female!=-1){
              //console.log("Female found");

              //console.log("^^^^^^^^^^^^^^^^^^^^^^^");
            //console.log(pop_female);
            //console.log("^^^^^^^^^^^^^^^^^^^^^^^");


            if(io.sockets.sockets[pop_female]!=undefined){


              //MALE_BOX.splice(MALE_BOX[client.id], 1);
              
              //delete MALE_BOX[client.id];
              //delete FEMALE_BOX[client.id];

              //console.log("Female Found..........");


              //console.log("^&&&&&&&&&&&&");
              //console.log(MALE_BOX);
              //console.log(FEMALE_BOX);
              //console.log("^&&&&&&&&&&&&");


              io.to(pop_female).emit("stranger_found",data);
              MALE_BOX.splice(MALE_BOX.indexOf(csocket_id), 1);

              client.emit("stranger_found_confirm",_ALONE_['all']['female'][pop_female]);


            }else{
              //console.log("Socket not connected "+Object.keys(io.sockets.connected).length);
            }

            recall(null,{entry:pop_female});

            }else{
              //console.log("No female found");
              recall(null,{entry:0});
            }

            
            
           }else{
            
            var flag=0;



            /*Check is this female found*/
            
            var pop_male=-1;
            //console.log("MALE_BOX.length = "+MALE_BOX.length);
            while(MALE_BOX.length>0){

               pop_male = MALE_BOX.shift();

               //console.log("%%%%");
               //console.log(pop_male);
               //console.log("%%%%");

               if(pop_male){
                 //console.log("Pop male");
                 break;
               }
            }

            if(pop_male!=1){              

              //console.log("^^^^^^^^^^^^^^^^^^^^^^^");
              //console.log(pop_male);
              //console.log("^^^^^^^^^^^^^^^^^^^^^^^");

            if(io.sockets.sockets[pop_male]!=undefined){
                

                //console.log("MALE Found..........");
              io.to(pop_male).emit("stranger_found",data);




              //delete MALE_BOX[client.id];
              //delete FEMALE_BOX[client.id];

              


              FEMALE_BOX.splice(FEMALE_BOX.indexOf(csocket_id), 1);

              //console.log("^&&&&&&&&&&&&");
              //console.log(MALE_BOX);
              //console.log(FEMALE_BOX);
              //console.log("^&&&&&&&&&&&&");

              client.emit("stranger_found_confirm",_ALONE_['all']['male'][pop_male]);


            }else{
              //console.log("Socket not connected "+Object.keys(io.sockets.connected).length);
            }


            /*Pop from array female*/


            

            //FEMALE_BOX.splice(FEMALE_BOX[client.id], 1);
            recall(null,{entry:pop_male});

            }else{
             recall(null,{entry:0});              

            }
            
           }
           
        }
      }
    ],function(err,results){
       if(err){
        callback({status:0,err:err});
       }else{
        // if(data.preference=="male"){
        //   FEMALE_BOX.splice(MALE_BOX[client.id], 1);
        // }else{
        //   MALE_BOX.splice(MALE_BOX[client.id], 1);
        // }
        callback({status:1,entry:results.entry});
       }
    });
  });

  client.on("register",function(data,callback){
    //console.log("Register");

    var csocket_id = client.id;
    //console.log(csocket_id);
     if(csocket_id.indexOf("/")==-1){
       //csocket_id=csocket_id.substr(0);
       csocket_id="/#"+csocket_id;
     }

    

    async.waterfall([
      function(recall){
        /*check*/
        //if(typeof(data.region)=="undefined" || typeof(data.username)=="undefined" || typeof(data.bio)=="undefined" || typeof(data.preference)=="undefined"){
        if(typeof(csocket_id)=="undefined"){
          recall("Parameter Missing",{});
          //recall(null,{});
        }else{
           if(data.preference=="female"){

             _ALONE_["all"]['male']={};
             //_ALONE_["all"]['male'][csocket_id]={socket_id:csocket_id,name:data.username,bio:data.bio}; 
             _ALONE_["all"]['male'][csocket_id]={socket_id:csocket_id}; 

             /*Push into*/
             //if(data.region=="india"){
              ////console.log("PUSH into india");
              MALE_BOX.push(csocket_id);
              //console.log("Male pushed");
              //console.log(MALE_BOX);

             //}else{
              ////console.log("Rest country not allow");
             //}
            
           }else{
              
              _ALONE_["all"]['female']={};
              //_ALONE_["all"]['female'][csocket_id]={socket_id:csocket_id,name:data.username,bio:data.bio}; 
              _ALONE_["all"]['female'][csocket_id]={socket_id:csocket_id}; 
 
             //if(data.region=="india"){
              ////console.log("PUSH into india");
              ////console.log("Female pushed");
              FEMALE_BOX.push(csocket_id); 
              //console.log("Female pushed");
              //console.log(FEMALE_BOX);
             //}else{
              ////console.log("Rest country not allow");
             //}
           }

           /**/
           // var female_count = Object.keys(_ALONE_[data.region]['female']).length;
           // var male_count = Object.keys(_ALONE_[data.region]['male']).length;

          
           // var live_user_count =  Object.keys(io.sockets.connected).length;
           // var female_count = FEMALE_BOX.length;
           // var male_count = MALE_BOX.length;

           recall(null,{});
        }
      }
    ],function(err,results){
       if(err){
        callback({status:0,err:err});
       }else{

        ////console.log(MALE_BOX);
        ////console.log(FEMALE_BOX);
        //callback({status:1,live_user_count:results.live_user_count,male_count:results.male_count,female_count:results.female_count});
        callback({status:1});
       }
    });
  });
});

/*****************************************Me-Alone*****************************************/


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}




// for(var i =0;i<array.length;i++){
////   console.log("i = "+array[i]);


// var file = fs.createWriteStream("file.jpg");
// var request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
//       response.pipe(file);
//     });


// }


/*Testing area*/


/*#500_error*/
  return app;
}();


module.exports = app;



