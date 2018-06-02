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



