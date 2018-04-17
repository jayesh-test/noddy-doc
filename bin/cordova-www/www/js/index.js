/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 window.onerror = function(e, url, line){
   alert(e);
   alert(url);
   alert(line);
 };
 
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);


        is_init({},function(status){
           if(status==1){
              /*just create from object*/
              project_init();    

           }else{

              music_obj.init_version_check({},function(status){
                      if(status==0){

                              music_obj.fetch_lot_from_server({},function(success_obj){
                                    //alert("success from server");

                                    //var obj={version:success_obj.version,version_history:success_obj.version_history,lot:success_obj.lot,category:success_obj.category};
                                    music_obj.create_category(success_obj,function(data1){
                                      music_obj.read_file_System({},function(data1){
                                        project_init();
                                      });
                                    });
                              });

                              
                      }else{
                          /*No need to get object*/
                          music_obj.read_file_System({},function(data1){
                            //alert("Everything fine");
                               project_init();
                          });
                      }
              });


           }
        });    

        // window.plugins.sim.getSimInfo(function(data){
        //     console.log(data);
        //     //alert("Success");
        //     $(".page-chunk[tag='current']").html(JSON.stringify(data));
        // },function(err){
        //     console.log(err);
        //     //alert("Fail");

        // });

        // /*Check this device contain localstorage json string*/
        /*if found then do not load register page*/


        /*else load register page data*/

            /**/

                //read_file(); 


            //project_init();    
            //youtube();    
            //admob_pro_free();    
            // var json_obj = window.localStorage.getItem("_ytb_USER_");
            // if(json_obj){
            //     /*Delete Policy and register page*/
            //     alert("Ok*-1");
            //     project_init();    
            // }else{
            //     //show_register_page();
            //     alert("Ok*-2");
            //     project_init(); 
            // }

            
    
        

    }
};


//app.initialize();

function is_init(obj,callback){

  /*Check is file present*/
  callback(0);
};


function music(){
  //this.current_project_url="http://localhost:5000";
  this.current_project_url="http://noddy-doc.herokuapp.com";
  //this.reward_category=["snl","kimmel","conan"];
  this.interstitial_category=[];
  this.current_chunk={ lot:{},category_list:{},current_version:0,version_history:{}};

  this.current_ad={interstitial:[],reward:[],banner:[]};
}
var music_obj = new music();


var swiper="";

music.prototype.fetch_lot_from_server=function(obj,callback){

    var version = obj.version;
    if(!version){
      version =0;
    }

    $.ajax({url:music_obj.current_project_url+"/music/lot",type:"GET",data:{version:version},
        success:function(success_obj){
          /*Fetch from*/
          //alert(1);
          console.log(success_obj);
          callback(success_obj);
        },
        fail:function(fail_obj){
          alert("Fail ajax request");
          console.log(fail_obj);
        }
   });

};


music.prototype.fetch_new_lot=function(obj,callback){
  /*Unlock and push into file*/
  var version = obj.version;


  /*Bring splash screen again*/
  $(".show-panel").removeClass("show-panel").addClass("hide-panel");
  $(".page-chunk[tag='splash_screen']").removeClass("hide-panel").addClass("show-panel");

  music_obj.fetch_lot_from_server({version:version},function(success_obj){
        var obj={version:success_obj.version,version_history:success_obj.version_history,lot:success_obj.lot,category:success_obj.category};

        $(".show-panel").append(JSON.stringify(success_obj));

        music_obj.create_category(success_obj,function(data1){
          music_obj.read_file_System({},function(data1){
              //project_init();

              /*Dim all version except version (version)*/
              
              // $(".your-current-collection").removeClass("your-current-collection");
              // $(".version-chunk[tag='"+version+"']").addClass("your-current-collection");


              /*Trigger first category content*/
              // $(".category-block").eq(0).trigger("click");


              /*Remove splash screen*/
              $(".show-panel").removeClass("show-panel").addClass("hide-panel");
              $(".page-chunk[tag='collection']").removeClass("hide-panel").addClass("show-panel");



          });
        });
  });


};

music.prototype.reward_unlock_tab=function(obj,callback){  
    /*Unlock and push into file*/
};

music.prototype.reward_unlock_version=function(obj,callback){  
    /*Load version with all new file system*/
};






music.prototype.version_file_push=function(obj,callback){

  var fs = obj.fs;
  var version=obj.version;


  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "version.txt";
  var filePath = fileDir + fileName;
    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
         fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                  //resolve();
                  //$(".list-ytb-videos").append("okay");
                    callback();
                    // fileEntry.file(function (file) {
                    //     $(".list-ytb-videos").append(file+"\n|");
                    //     var reader = new FileReader();
                    //     reader.onloadend = function() {
                    //         console.log("Successful file read: " + this.result);
                    //         $(".list-ytb-videos").append(this.result);
                    //     };
                    //     reader.readAsText(fileName);

                    // }, function(err){
                    //     $(".list-ytb-videos").append("READ ERROR");
                    // });


              };
              fileWriter.onerror = function (e) {
                  //reject(e);
                  alert("version err");
                  //$(".list-ytb-videos").append("reject");
              };
              fileWriter.write(version);
          });
    }, function(err) {
                  alert(err.toString());

       //$(".list-ytb-videos").append(err);
    });          
};

music.prototype.category_list_file_push=function(obj,callback){


  var fs = obj.fs;
  var category=obj.category;

  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "category_list.json";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
         fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                  //resolve();
                  //$(".list-ytb-videos").append("okay");
                    callback();
                    // fileEntry.file(function (file) {
                    //     $(".list-ytb-videos").append(file+"\n|");
                    //     var reader = new FileReader();
                    //     reader.onloadend = function() {
                    //         console.log("Successful file read: " + this.result);
                    //         $(".list-ytb-videos").append(this.result);
                    //     };
                    //     reader.readAsText(fileName);

                    // }, function(err){
                    //     $(".list-ytb-videos").append("READ ERROR");
                    // });


              };
              fileWriter.onerror = function (e) {
                  //reject(e);
                  //$(".list-ytb-videos").append("reject");
              };
              fileWriter.write(JSON.stringify(category));
          });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
    });      

};

music.prototype.category_lot_file_push=function(obj,callback){

  var fs = obj.fs;
  var lot=obj.lot;

  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "lot.json";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
         fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                  //resolve();
                  //$(".list-ytb-videos").append("okay");
                    callback();
                    // fileEntry.file(function (file) {
                    //     $(".list-ytb-videos").append(file+"\n|");
                    //     var reader = new FileReader();
                    //     reader.onloadend = function() {
                    //         console.log("Successful file read: " + this.result);
                    //         $(".list-ytb-videos").append(this.result);
                    //     };
                    //     reader.readAsText(fileName);

                    // }, function(err){
                    //     $(".list-ytb-videos").append("READ ERROR");
                    // });


              };
              fileWriter.onerror = function (e) {
                  //reject(e);
                  //$(".list-ytb-videos").append("reject");
                  alert("Fail..");
              };
              fileWriter.write(JSON.stringify(lot));
          });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
    });      

};

music.prototype.reward_list_file_push=function(obj,callback){

  var fs = obj.fs;
  var reward=obj.reward;

  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "reward_lot.json";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
         fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                  //resolve();
                  //$(".list-ytb-videos").append("okay");
                    callback();
                    // fileEntry.file(function (file) {
                    //     $(".list-ytb-videos").append(file+"\n|");
                    //     var reader = new FileReader();
                    //     reader.onloadend = function() {
                    //         console.log("Successful file read: " + this.result);
                    //         $(".list-ytb-videos").append(this.result);
                    //     };
                    //     reader.readAsText(fileName);

                    // }, function(err){
                    //     $(".list-ytb-videos").append("READ ERROR");
                    // });


              };
              fileWriter.onerror = function (e) {
                  //reject(e);
                  alert("Reward fail...");
              };
              fileWriter.write(JSON.stringify(reward));
          });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
    });   

};

music.prototype.version_history_list_file_push=function(obj,callback){


  var fs = obj.fs;
  var version_history=obj.version_history;

  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "version_history.json";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
         fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                  //resolve();
                  //$(".list-ytb-videos").append("okay");
                    callback();
                    // fileEntry.file(function (file) {
                    //     $(".list-ytb-videos").append(file+"\n|");
                    //     var reader = new FileReader();
                    //     reader.onloadend = function() {
                    //         console.log("Successful file read: " + this.result);
                    //         $(".list-ytb-videos").append(this.result);
                    //     };
                    //     reader.readAsText(fileName);

                    // }, function(err){
                    //     $(".list-ytb-videos").append("READ ERROR");
                    // });


              };
              fileWriter.onerror = function (e) {
                  //reject(e);
                  //$(".list-ytb-videos").append("reject");
              };
              fileWriter.write(JSON.stringify(version_history));
          });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
       //project_init();    
    });   
};



music.prototype.init_version_check=function(obj,callback){
  try{

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    var absPath = cordova.file.externalRootDirectory;
    var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');
    var fileName = "version.txt";
    var filePath = fileDir + fileName;

        fs.root.getFile(filePath,{ create: false }, function(){
          callback(1);
        },function(){
          callback(0);
        });

    },function(){
        callback(0);
    });


  }catch(err){
    //project_init();
    callback(0);
  }
   

};


music.prototype.create_category=function(obj,callback){
/*Create*/
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    music_obj.version_file_push({fs:fs,version:obj.version},function(){
          music_obj.category_lot_file_push({fs:fs,lot:obj.lot},function(){
            //alert("okay  done-1");
            //music_obj.category_list_file_push({fs:fs,category:obj.category},function(){
              //music_obj.reward_list_file_push({fs:fs,reward:obj.reward},function(){
                music_obj.version_history_list_file_push({fs:fs,version_history:obj.version_history},function(){
                    //alert("Okay Done Every thing");
                    callback();
                });
              //});
            //});
        });
     });
},function(err) {
    alert("Error File system");
});


           

          //$(".list-ytb-videos").append("create_category");
          
};


music.prototype.version_file_read=function(obj,callback){
  var fs = obj.fs;
  var version=obj.version;
  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');
  var fileName = "version.txt";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
                   fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            //console.log("Successful file read: " + this.result);
                            //alert(1);
                            music_obj.current_chunk.current_version=parseInt(this.result,10);

                            //$(".list-ytb-videos").append(this.result);
                            callback();

                        };

                        reader.readAsText(file);

                    }, function(err){
                        alert("version err -1 ");
                    });
    }, function(err) {
       //$(".list-ytb-videos").append(err);
       alert("version err -2 ");
    });          
};

music.prototype.category_lot_file_read=function(obj,callback){

  var fs = obj.fs;
  var lot=obj.lot;

  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "lot.json";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {

                   fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function() {

                           var category_lot  = JSON.parse(this.result);
                           var i=0,len=category_lot.length;
                           var html="";

                           var music = [];
                           for(i=0;i<len;i++){
                              //html+="<div class='swiper-slide-chunk'><video  poster='img/poster-2.png' class='video-swipe' volume=0.1 index="+i+" data-src-tag='"+category_lot[i]+"'  loop></video></div>";
                              music.push("<div class='swiper-slide-chunk'><video  poster='img/poster-2.png' class='video-swipe' volume=0.1 index="+i+" data-src-tag='"+category_lot[i]+"'  loop></video></div>");
                           }

                           //$(".swiper-wrapper").html(html);
                           //music_obj.current_chunk.lot=music;
                           music_obj.current_chunk.lot=category_lot;
                           if(swiper==""){
                           	swiper = new Swiper('.swiper-container', {
                           
              direction: 'horizontal',

              virtual:{
              	slides:music
              },
       //        cubeEffect: {
    			// slideShadows: false,
  			  // },

       //        pagination: {
       //          el: '.swiper-pagination',
       //          speed:10,
       //          watchSlidesVisibility: false
       //        }
          });


                           }else{
                           	 //music_obj.current_chunk.lot=music;
                           	 music_obj.current_chunk.lot=category_lot;
                           	 //alert("UPdate new chunk");
                           	 //$(".swiper-wrapper").html("");

                           	 swiper.virtual.slides=music;
                           	 window.localStorage.setItem("_BOM_CURRENT_INDEX_",0);
                           	 swiper.virtual.update();
                           	 
                           }



                          //alert("lot length = "+music_obj.current_chunk.lot.length);

                           /*Initialize swiper here*/                           
                           //alert(2);
                           callback();
                        };

                        reader.readAsText(file);

                    }, function(err){
                        //$(".list-ytb-videos").append("READ ERROR");
                    });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
    });      

};


music.prototype.category_list_file_read=function(obj,callback){


  var fs = obj.fs;
  var category=obj.category;
  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "category_list.json";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {

                      fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            //console.log("Successful file read: " + this.result);
                            //$(".list-ytb-videos").append(this.result);

                            var category_list_obj = Object.keys(music_obj.current_chunk.lot);
                            
                            var i=0,len=category_list_obj.length;
                            music_obj.current_chunk.category_list=category_list_obj;
                            
                            var html="";

                            /*Push into category*/
                            for(i=0;i<len;i++){
                              if(i==0){
                                html+="<span class='category-block active-category' category='"+category_list_obj[i]+"'> <span class='category-chunk'>"+category_list_obj[i]+"</span> </span>";
                              }else{
                                html+="<span class='category-block' category='"+category_list_obj[i]+"'> <span class='category-chunk'>"+category_list_obj[i]+"</span> </span>";
                              }                              
                            }

                            /*For loop Reward*/
                            $(".pic-foot-filter").find(".content-block").html(html);
                            //alert(3);
                            

                            callback();         
                        };
                        reader.readAsText(file);

                    }, function(err){
                        //$(".list-ytb-videos").append("READ ERROR");
                    });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
    });      

};


music.prototype.reward_list_file_read=function(obj,callback){

  var fs = obj.fs;
  var reward_lot=obj.reward_lot;

  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "reward_lot.json";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                           var reward_lot  = JSON.parse(this.result);
                             music_obj.current_chunk.reward_lot=reward_lot;

                             
                           // var category_list_obj = JSON.parse(this.result);
                           //$(".page-chunk[tag='splash_screen']").append(this.result+"\n");

                            var i=0,len=reward_lot.length;
                            var html="";

                            /*Push into category*/
                            for(i=0;i<len;i++){
                               $(".category-block[category='"+reward_lot[i]+"']").addClass("locked-category-chunk").html("Unlock");
                            }
                            //alert(4);
                           callback();
                        };

                        reader.readAsText(file);

                    }, function(err){
                        //$(".list-ytb-videos").append("READ ERROR");
                    });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
    });   

};

music.prototype.version_history_list_file_read=function(obj,callback){
  var fs = obj.fs;
  var version_history=obj.version_history;

  var absPath = cordova.file.externalRootDirectory;
  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

  var fileName = "version_history.json";
  var filePath = fileDir + fileName;

    fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
          fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function() {

                           var version_history  = JSON.parse(this.result);
                           music_obj.current_chunk.version_history=version_history;

                           var i=0,len=version_history.length;
                           var version_history_html="";


                           for(i=0;i<len;i++){
                              version_history_html+="<div class='version-chunk' tag='"+version_history[i]+"'>Collection-"+version_history[i]+"</div>";
                           }

                           /*Version*/

                           //$(".page-chunk[tag='splash_screen']").append(this.result+"\n");
                           $(".version-block-list").html(version_history_html);

                           $(".version-chunk").eq((parseInt(music_obj.current_chunk.current_version,10)-1) ).addClass("active-version");

                           callback();
                        };
                        reader.readAsText(file);                    
                    
                    }, function(err){
                        //$(".list-ytb-videos").append("READ ERROR");
                    });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
    });   
};



music.prototype.read_file_System=function(obj,callback){
    /*Create */


  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    music_obj.version_file_read({fs:fs},function(){
      music_obj.category_lot_file_read({fs:fs},function(){
        //alert("Read okay");
        //music_obj.category_list_file_read({fs:fs},function(){            
              //music_obj.reward_list_file_read({fs:fs},function(){
                music_obj.version_history_list_file_read({fs:fs},function(){
                    //alert("Remove spalash screen to main project..");
                    //$(".list-ytb-videos").append("\n"+JSON.stringify(music_obj.current_chunk));                    
                    callback();
                });
              //});
            //});
        });
     });
  },function(err) {
      alert("Error File system");
  });

};


music.prototype.load_interstitial=function(op){
  //alert("Reward category lock");
  //admob.rewardvideo.prepare();
  //alert(op.tag);

  admob.interstitial.prepare();

  // if(music_obj.current_ad.interstitial.length==0){
  // 	admob.interstitial.prepare();
  // }else{

  // }
  
  //admob.interstitial.show();
  


}

music.prototype.check_and_load_category=function(op){
  var tag = op.tag;

  /*Load from*/
  if(music_obj.current_chunk.lot[tag]){
      /**/
      var collection_html="";
      var  collection =music_obj.current_chunk.lot[tag];
      var i=0,len =music_obj.current_chunk.lot[tag].length;
      for(i=0;i<len;i++){
        collection_html+="<div class='video-chunk' ytb-id='"+collection[i].ytb_code+"'> <span class='video-thumbnail'> <img src='https://img.youtube.com/vi/"+collection[i].ytb_code+"/0.jpg'> </span> <span class='video-title'>"+collection[i].ytb_title+"</span> </div>";
      }

      $(".list-ytb-videos").html(collection_html);
      $(".pic-foot-filter").removeClass("show-block").addClass("hide-block");


      setTimeout(function(){
        $('html, body').animate({
          scrollTop: 0
        },50);
      },1000);
      
  }else{
     alert("Something went wrong.");
  }

  // if(music_obj.interstitial_category.indexOf(tag)>-1){
  //   Wait Till
  // }else{
  //     console.log("Load page");
  // }
}


music.prototype.interstitial_ad_done=function(){
	 /*Get first id and chec*/


	 if(music_obj.current_ad.interstitial[0].type=="unlock_category"){
	 	/*Remove*/	
	 	var category=music_obj.current_ad.interstitial[0].category;
	 	$(".category-block[category='"+category+"']").removeClass("locked-category-chunk");
	 	/*Remove From file system*/

	 	music_obj.current_ad.interstitial.length=0;

	 	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

				  var fs = obj.fs;
				  var reward_lot=obj.reward_lot;

				  var absPath = cordova.file.externalRootDirectory;
				  var fileDir = cordova.file.externalDataDirectory.replace(cordova.file.externalRootDirectory, '');

				  var fileName = "reward_lot.json";
				  var filePath = fileDir + fileName;

				  fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
				        fileEntry.file(function (file) {
							var reader = new FileReader();
								reader.onloadend = function() {
				                    var reward_lot  = JSON.parse(this.result);

				                    reward_lot = reward_lot.splice(reward_lot.indexOf(category),1);
				                    music_obj.current_chunk.reward_lot=reward_lot;


										fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
									         fileEntry.createWriter(function (fileWriter) {
									              fileWriter.onwriteend = function () {
									                  //resolve();
									                  //$(".list-ytb-videos").append("okay");
									                    //callback();
									                    // fileEntry.file(function (file) {
									                    //     $(".list-ytb-videos").append(file+"\n|");
									                    //     var reader = new FileReader();
									                    //     reader.onloadend = function() {
									                    //         console.log("Successful file read: " + this.result);
									                    //         $(".list-ytb-videos").append(this.result);
									                    //     };
									                    //     reader.readAsText(fileName);

									                    // }, function(err){
									                    //     $(".list-ytb-videos").append("READ ERROR");
									                    // });


									              };
									              fileWriter.onerror = function (e) {
									                  //reject(e);
									                  alert("Reward fail...");
									              };
									              fileWriter.write(JSON.stringify(reward_lot));
									          });
									    }, function(err) {
									       //$(".list-ytb-videos").append("err-2");
									    });   

						                     // var i=0,len=reward_lot.length;
						                     // var html="";
						                     // callback();

				                 };

				                 reader.readAsText(file);

				         }, function(err){
				         });

				   }, function(err) {

				   });
	 	});
	 }else{
	 }

};

function admob_pro_free(){
    //alert("Ok-1");

    try{
    }catch(err){
        alert(err);
    }

};


/*DATABASE*/
function populateDB(tx) {
     tx.executeSql('CREATE TABLE IF NOT EXISTS reward (id ,reward_name)');
     //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
}

function populateDB(tx) {
     tx.executeSql('CREATE TABLE IF NOT EXISTS reward (id ,reward_name)');
     //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
}

/*DATABASE*/


function youtube(){

   try {
        window.InAppYouTube.openVideo('9bZkp7q19f0', {
          fullscreen: true
        }, function(result) {
          // console.log(JSON.stringify(result));
        }, function(reason) {
          // console.log(reason);
        });
      } catch(e) {
        // Exception!
        alert("Youtube video not found");
      }


};

function project_init(){

//alert("Init");

var back_button_press_counter=0;
document.addEventListener("backbutton", function(e){
	back_button_press_counter++;

	if(back_button_press_counter>=2){
		navigator.app.exitApp();
	}else{
		/*Home page*/
		$(".show-panel").removeClass("show-panel").addClass("hide-panel");
		$(".page-chunk[tag='collection']").removeClass("hide-panel").addClass("show-panel");
	}

	setTimeout(function(){
		back_button_press_counter=0;
	},1000);


	e.preventDefault();
},false); 


admob.rewardvideo.config({
      id: 'ca-app-pub-9006184694584118/5715538641'
      // isTesting: false,
    });

    admob.interstitial.config({
    id: 'ca-app-pub-9006184694584118/8422550891'
    // isTesting: false,
  });

//alert("project_list");
//cordova.InAppBrowser.open('https://www.youtube.com/watch?v=L7u1sAqs7Js', '_self');
document.addEventListener('admob.interstitial.events.LOAD_FAIL', function(event) {
  alert("Sorry,load not yet loaded.You can't unlock this category now.");
  //music_obj.current_ad.interstitial.length=0;
});

document.addEventListener('admob.interstitial.events.LOAD', function(event) {
  //console.log(event)
  //document.getElementById('showAd').disabled = false

  //if(music_obj.current_ad.interstitial.length==1){
  	//admob.interstitial.show();
  	//music_obj.current_ad.interstitial.length=0;
  //}

});

document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
  //console.log(event)
  music_obj.interstitial_ad_done();
  //admob.interstitial.prepare();
});



document.addEventListener('admob.rewardvideo.events.LOAD_FAIL', function(event) {
  //alert("fail rewardvideo");  
  
  /*Launch*/
})

document.addEventListener('admob.rewardvideo.events.LOAD', function(event) {
  //console.log(event)
  //document.getElementById('showAd').disabled = false
  	admob.rewardvideo.show();
});

document.addEventListener('admob.rewardvideo.events.CLOSE', function(event) {
  //console.log(event)
  //admob.rewardvideo.prepare()
});

        	
	
  	

$(document).on("click","#reward-ad-btn",function(){
  	admob.rewardvideo.prepare();
});

$(document).on("click","#inter-ad-btn",function(){
	admob.interstitial.prepare()
});

            $(".user-page").show();

            var flag=false;

try{

  // var src = $(".video-swipe").eq(0).attr("data-src-tag");
  // $(".video-swipe").eq(0).attr("src",src).attr("autoplay",true);
  // $(".video-swipe").eq(0)[0].volume=1;

  $(document).on("click",".swiper-slide-chunk",function(){
      var play_stat = $(this).find(".video-swipe")[0].paused;        
      if(play_stat==false){
          $(this).find(".video-swipe")[0].pause();
      }else{
          $(this).find(".video-swipe")[0].play();
      }
  });

 //$(".swiper-wrapper").html(html);

          try{
         
          }catch(err){
              alert("Swiper Error");
          }

          //console.log( $(".video-swipe").first()  ); 

          var  $first_video = $(".video-swipe").first();
          $first_video.addClass("swiper-slide-active");
          //console.log( $first_video[0]);
          var src = $first_video.attr("data-src-tag");

	      $first_video[0].volume=1;
	      $first_video.attr("src",src);
	      $first_video.attr("autoplay",true);

            


          try{

                    var current_index = window.localStorage.getItem("_BOM_CURRENT_INDEX_");
                    if(!current_index){
                       current_index=0;
                    }

                    if(current_index==0){
                        swiper.slideTo(0, 10,function(){});
                    }else{
                        swiper.slideTo(0, 10,function(){});
                    }

                    swiper.on('transitionEnd',function(e){

                      // var $video = $(".video-swipe");

                      //$video = $(".video-swipe");

                      try{
                      	$(".swiper-slide-prev").find(".video-swipe")[0].src="";
                      	$(".swiper-slide-prev").find(".video-swipe")[0].volume=0;

                      	
                      }catch(err){

                      }

                      $(".swiper-slide-next").find(".video-swipe")[0].src="";
                      $(".swiper-slide-next").find(".video-swipe")[0].volume=0;	
                      

                      var src = $(".swiper-slide-active").find(".video-swipe").attr("data-src-tag");
                      $(".swiper-slide-active").find(".video-swipe").attr("src",src);
                      $(".swiper-slide-active").find(".video-swipe").attr("autoplay",true);
                      $(".swiper-slide-active").find(".video-swipe")[0].volume=1;



                      // console.log("swiper.previousIndex = "+swiper.previousIndex);
                      // console.log("swiper.realIndex = "+swiper.realIndex);

                      // $video.eq(swiper.previousIndex).removeAttr("autoplay").removeAttr("src");

                      // $video.eq(swiper.previousIndex)[0].src="";
                      // $video.eq(swiper.previousIndex)[0].volume=0;


                      // var src = $video.eq(swiper.realIndex).attr("data-src-tag");

                      // $video.eq(swiper.realIndex)[0].volume=1;
                      // $video.eq(swiper.realIndex).attr("src",src);
                      // $video.eq(swiper.realIndex).attr("autoplay",true);


                    });

                   //  swiper.on('slideChangeTransitionEnd',function(e){

                   //    var $video = $(".video-swipe");
                   //    console.log("swiper.previousIndex = "+swiper.previousIndex);
                   //    console.log("swiper.realIndex = "+swiper.realIndex);

                   //    $video.eq(swiper.previousIndex).removeAttr("autoplay").removeAttr("src");

                   //    $video.eq(swiper.previousIndex)[0].src="";
                   //    $video.eq(swiper.previousIndex)[0].volume=1;


                   //    var src = $video.eq(swiper.realIndex).attr("data-src-tag");

                   //    $video.eq(swiper.realIndex)[0].volume=1;
                   //    $video.eq(swiper.realIndex).attr("src",src);
                   //    $video.eq(swiper.realIndex).attr("autoplay",true);

                   //    //window.localStorage.setItem("_BOM_CURRENT_INDEX_",swiper.realIndex);


                   //   /*Remove Everything else*/
                   //   //$(".swiper-slide").not(".swiper-slide-next").not(".swiper-slide-prev").not(".swiper-slide-active").find(".video-swipe").remove();


                   // });
               


          }catch(err){
            alert(err.toString());
          }  


      
            $('.header-chunk').on({ 'touchstart' : function(){
                // var $this = $(this);
                // var tag = $this.attr("tag");
                // if(tag=="info"){
                //   $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                //   $(".page-chunk[tag="+tag+"]").removeClass("hide-panel").addClass("show-panel");
                //   $(".header-chunk[tag='"+tag+"']").attr("tag","collection");
                // }else if(tag=="collection"){
                //   $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                //   $(".page-chunk[tag="+tag+"]").removeClass("hide-panel").addClass("show-panel");
                //   $(".header-chunk[tag='"+tag+"']").attr("tag","info");
                // }

            },'click' : function(){

                var $this = $(this);
                var tag = $this.attr("tag");
                if(tag=="info"){
                  $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                  $(".page-chunk[tag="+tag+"]").removeClass("hide-panel").addClass("show-panel");
                  $(".header-chunk[tag='"+tag+"']").attr("tag","collection");

                  try{
                    $(".video-swipe")[0].pause();
                  }catch(err){
                     alert("..");
                  }
                  

                }else if(tag=="collection"){
                  $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                  $(".page-chunk[tag="+tag+"]").removeClass("hide-panel").addClass("show-panel");
                  $(".header-chunk[tag='"+tag+"']").attr("tag","info");
                }


                // var $this = $(this);
                //     $(".active-header-chunk").removeClass("active-header-chunk");
                //     $this.addClass("active-header-chunk");
                //     var tag = $this.attr("tag");
                //     $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                //     $(".page-chunk[tag="+tag+"]").removeClass("hide-panel").addClass("show-panel");

                //     if(tag=='ytb'){
                //         $(".header-panel").addClass("switch-header");
                //     }else{                    
                //         $(".header-panel").removeClass("switch-header");
                //     }

            } });


            $(document).on("click",".version-chunk",function(){
              var tag = $(this).attr("tag");
                  /*Show splash screen*/
                      $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                      $(".page-chunk[tag='splash_screen']").removeClass("hide-panel").addClass("show-panel");


                      music_obj.fetch_lot_from_server({version:tag},function(success_obj){
                          music_obj.create_category(success_obj,function(data1){
                              //music_obj.read_file_System({},function(data1){


                              	    /*Reload Page*/
                              	    window.location.reload(true);

                                  /*Append*/

                          //         $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                          //         $(".page-chunk[tag='collection']").removeClass("hide-panel").addClass("show-panel");



                                    

                          //           //$(".version-chunk").eq(tag-1).addClass("active-version");
                          //           $(".version-chunk").eq((parseInt(tag,10)-1) ).addClass("active-version");

                          //           swiper.slideTo(0, 10,function(){});

		                        //             /*Play First*/
				                      // try{
				                      // 	$(".swiper-slide-prev").find(".video-swipe")[0].src="";
				                      // 	$(".swiper-slide-prev").find(".video-swipe")[0].volume=0;
				                      // }catch(err){

				                      // }
				                      
				                      // $(".swiper-slide-next").find(".video-swipe")[0].src="";
				                      // $(".swiper-slide-next").find(".video-swipe")[0].volume=0;	
				                      

				                      // var src = $(".swiper-slide-chunk").first().find(".video-swipe").attr("data-src-tag");
				                      // $(".swiper-slide-chunk").first().find(".video-swipe").attr("src",src).attr("autoplay",true);
				                      // $(".swiper-slide-chunk").first().find(".video-swipe").attr("autoplay",true);

				                      // $(".swiper-slide-chunk").first().find(".video-swipe")[0].volume=1;



                                    window.localStorage.setItem("_BOM_CURRENT_INDEX_",0);


                                  //project_init();
                              //});
                          });
                      });

            });




//music_obj.check_and_load_category({tag:$(".category-block").eq(0).attr("category")});



/*Show Now..*/

$(".show-panel").removeClass("show-panel").addClass("hide-panel");
$(".page-chunk[tag='collection']").removeClass("hide-panel").addClass("show-panel");
$(".header-panel").addClass("show-header-panel");



}catch(err){
   alert(err);
}

// $(".your-current-collection").removeClass("your-current-collection");
// $(".version-chunk[tag='"+music_obj.current_chunk.current_version+"']").addClass(".your-current-collection");

// $('html, body').animate({
//           scrollTop: 0
// },50);


            
}




