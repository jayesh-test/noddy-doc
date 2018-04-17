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
                           for(i=0;i<len;i++){
                              html+="<div class='swiper-slide-chunk'><video  poster='img/poster-2.png' class='video-swipe' volume=0.1 index="+i+" data-src-tag='"+category_lot[i]+"'  loop></video></div>";
                           }

                           $(".swiper-wrapper").html(html);
                           music_obj.current_chunk.lot=category_lot;


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

 var arr=[];
 var music_arr = ["https://mpaw-sinc1.muscdn.com/reg02/2018/03/13/18/6532375572008408064_nWikzdsVgk.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/13/18/6532375572008408064_nWikzdsVgk.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/13/20/6532406775633679375_ZFkfXqwoIQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/11/16/6521214575075922944_WBccdeWYpN.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/27/06/6527001292689118223_tMNgxeseOD.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/01/04/6527709104750728207_uOTTlKzqdN.mp4","https://mpal-ocne1.muscdn.com/reg02/2018/03/12/19/6532012292278588416_xyCnkXlCGF.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/02/10/6528174861053858816_FPsGQLWLpT.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/10/14/6531197472763548672_hPZjnXllcW.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/19/00/6523939501188862976_VZBgkpshre.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/14/6531578119336236047_jehNwcnUkz.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/07/08/6529999124794708992_vTpeKxxSre.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/20/17/6524560998727160832_gnbzUyzzMt.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/11/20/6531664152874734607_fhGIJitmwQ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/11/10/6531512633856627727_fMxACYoDlU.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/20/01/6524318689049711616_GBwNKgZtFl.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/10/21/6531306931594744847_NxxngEFaMN.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/20/6531661676784129039_mSfXmmjHLS.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/17/03/6523234525252686848_BZIGgjMbez.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/17/6531624325278077967_kANfhHFzeU.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/01/6531367013497967631_hgnbxtkKDF.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/20/21/6524635816218596352_ZqtJGGQpQb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/01/18/20/318496816763744256_hWcxgYdHob.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/09/18/6530893139454989312_TCeNuIWdmy.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/07/14/6530089919426073600_NzrCvlZUjm.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/08/22/6520186576738194447_uaVkKcagNV.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/09/21/6530934909928739855_aQLDnNbOCB.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/08/18/6530517255627740160_qeiEbZQSYv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/04/19/6529054917619880975_hwzDLAmqAQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/10/21/6531310094372574208_dgvjMZtRfV.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/05/00/6529125230529483776_LBOjbCSRqP.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/10/00/6530980972068869135_rppEHUzWBZ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/09/20/6530920546555679744_VGGwWACakn.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/07/16/6530122694610916352_BjOUzQRizT.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/08/19/6530536569298752512_hxWLGlteHK.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/01/18/6527921399514797056_YJNAMcbCBI.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/14/17/6522340714053899264_dDzPeDJGeJ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/09/18/6530887281232843791_PBltWPFJQk.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/09/16/6530859446732592143_IEJtqxMdXu.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/08/16/6530490301855831040_hugAPkdwUl.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/09/14/6520438588629324815_OdkIPzvfbD.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/09/01/6530620393684734976_goPaaByRFC.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/26/17/6526792318953985024_SCRQOxcDBT.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/04/23/6529108795317048320_RzkmOtjmeT.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/03/01/6528403599792280591_hDuOcvKKMe.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/19/20/6524235915605316623_ZQuWClFPPn.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/07/02/6519515087336641551_KMqJXrzcMP.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/09/21/6530929638766564367_JFEerudvNv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/09/02/6530642113464374287_FAKISMVCIN.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/25/12/6526338876468909071_IrCcaCwXLG.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/09/14/6530834455244837888_kOfTyTLded.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/25/19/6526452380370736128_rgTMGjVeYW.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/10/17/6520856537127195663_VIGVPDSxmf.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/04/15/6528989188002419712_krprZkSJDY.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/09/20/6530918833216033792_LwrZDObZvQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/02/13/6528222679160329231_goBDCXihof.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/18/21/6523893446455858191_nIJmIzllmM.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/27/22/6527235025832776704_PslHdzxJbf.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/17/16/6523436620257973248_qviLMhAsbs.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/08/21/6530563730571285504_uOWYOmRAeJ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/25/07/6526263564875863040_kjYZJspYnO.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/20/15/6524531974852318223_JrVUWYqQei.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/22/04/6525108077895619599_TbwLRoljiF.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/02/06/6528107119835616271_hCzzBVBBJW.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/18/20/6523873577828094976_ClJoYYTFXJ.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/02/02/6528039368341328896_LrCIrSfuza.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/07/20/6519786196086821888_QyTQzHWEvq.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/06/14/6529711884503880704_oQjHKycrsX.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/20/17/6524566131557012480_AWJrzJrXpC.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/25/17/6526414972694582287_UrkHXecIxO.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/25/23/6526517735680119808_VRdhFQIokb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/04/17/6529013746247930895_TUaDbzRinv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/07/13/6519678710029751311_ATifXPQloi.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/14/23/6522429818984731663_alxyLZyhie.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/07/21/6530196154527781903_YSZzHnjcRt.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/01/25/19/6514956483581449216_rfJzCWBFPq.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/27/15/6527127090951623695_JmRxIjRvGU.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/06/00/6529498895460865024_BwXwBzQnfX.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/06/23/6529859955158160399_VePzgOlaiP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/25/19/6526449892552872975_RKiEcaxYWu.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/24/02/6525819803607766031_vFUiLKaOZb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/01/19/6527931975972426752_TtQFjmTuqd.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/15/00/6522445690885379072_nnJbrkNLvw.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/26/23/6526890028537238543_NqkyZjKxDa.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/04/19/6529055662431802383_RXfklNiLmf.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/13/21/6522027206032495631_GesVVlGXpy.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/07/04/6529926092730405888_wTAndFeafT.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/21/02/6524713057673810944_dzrNMHFDgQ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/19/01/6523945916561363983_IxjuqBAFrN.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/18/02/6523598906188633088_SgAZhdfhCb.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/03/22/6528725742488917007_HoOSxXZYga.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/15/01/6522463474197468175_QGrbkgfjPi.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/07/14/6530085094391026703_WgZFpGJIyG.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/10/17/6520858720572806159_dOCpOtiFrf.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/08/20/6530551973261874176_mocsJaXgkp.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/27/18/6527172311294940175_BXcGhwCJQa.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/07/00/6529873431654044672_Upsdzdkmpw.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/25/19/6526448707380974607_OguHpvVGUp.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/15/22/6522786033094890511_nXvdSddegy.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/17/19/6523481661559018496_qnadjPjDUR.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/09/22/6530957906077029391_ucVxyEqMaD.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/09/19/6530903909861430287_pWgIIIRksy.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/12/01/6521343965323596815_AqyAORsnSe.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/09/18/6530895634784850959_UQtgVDtDxW.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/05/18/6529407705675731983_IIpdlvALRo.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/13/17/6521974829157979136_buPAesRhMx.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/12/22/6532069490362946575_EGLQkmeHgg.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/08/20/6530548197817848832_pHecDCoLQI.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/06/23/6529849722255971328_wyhFdnzRHo.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/20/6531665052737475599_SkfENAZkJx.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/12/03/6531768593279882240_UhyBCelyDN.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/13/13/6532292364906533903_YupTNPgYBA.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/13/17/6532360198265246735_GibEUXizES.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/12/21/6532057301077988352_NkYuScnOFE.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/13/06/6532186727547671567_QkCmZuQyeF.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/10/15/6531221216718492672_UbukyafwLt.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/10/12/6531169319441667087_ssJkihlcIl.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/12/17/6531982891012854799_ahMvXlPFph.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/09/22/6530952254579545103_KRtiUrBELE.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/14/14/6532678267550307343_OLwwdPbvfF.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/08/13/6530434315023553536_EKLifGNNnN.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/12/19/6532020500275663872_lEPoFBGbYa.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/14/16/6532712553032717327_PauYMuGOsh.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/01/6531365362322117647_GLEmGZNLsG.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/15/17/6533105520067220495_sQqOxTapkV.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/14/23/6532829515880616960_YVfaBOdcEx.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/08/16/6530495323549209600_yLuMHZhFUk.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/20/6531670872971809792_ZezJIhlWAp.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/04/23/6529107593636353024_cOTtaEsPkV.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/19/6533124972108321792_IRwHgJvHFR.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/03/19/6528674028079551488_mPrCXsgGla.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/17/6533104026882429967_GxlFEBTKgF.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/13/6533038386830119936_oDXLDJVxbN.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/21/23/6525023528243188736_QcxbhUBzxF.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/12/07/6531831383998862336_nbslYAgaVQ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/15/08/6522572798404072448_XaxNVQuqjr.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/14/22/6532813943834940416_LYkRvacdKt.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/21/13/6524874181731947535_DcmADEeOYh.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/12/15/6531964049746301952_VXpHbgHZGy.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/22/6533172346834916352_tcRxuClmWG.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/15/20/6533142404298445839_fmIBgGoEqF.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/18/6533117632919376911_ggVwhzevhN.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/12/00/6531729771947103232_gaJEpzlfpf.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/13/20/6532410818779157519_hODwgCTPoP.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/22/17/6525314576534213647_EMkovosgZO.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/01/6532860471257601039_JBCSGEClZZ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/22/23/6525407705564189696_oisUDVxisV.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/27/20/6527203108500542464_mIaJLCUwjn.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/14/6533059281351087119_jEFKmIffYL.mp4","https://mpaw-sinc1.muscdn.com/reg02/2017/12/25/11/309670966081757184_ivHxHrUriD.mp4","https://mpak-suse1.akamaized.net/reg02/2018/01/16/11/317641632907157504_icyFRqlXGT.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/20/6531669815315158031_hhYZEBiqwQ.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/19/01/6523943301383459840_OTNMuVLMQN.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/01/6532848684386751488_XhlGSZQnbm.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/21/12/6524866663421072384_kJnIkxKOfC.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/12/15/6521573795336033280_JpTywovDTv.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/06/16/6519363421882815503_lAOtcXsWTO.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/16/16/6533461077450036224_tenOEztryB.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/16/03/6533257746312074240_kGblgbVlAT.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/03/16/6528629014683194383_haDNYaJgKh.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/15/23/6533192389069116416_QsrGEhuWrH.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/16/19/6533507936755389440_saXUjUbkSW.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/17/11/6533753565863744527_apeYTkvVZW.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/01/30/23/6516861502396306447_UfglCjFmYh.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/18/13/6534156109341529103_cyaKoiqsdD.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/17/04/6533649071532413967_sQTGhgghSb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/22/17/6525312423157568512_eXxlpqSupG.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/16/15/6533448047773357056_XhyLNpeueV.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/27/23/6527253734689346560_ivZUkxzInC.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/17/02/6533609779858773007_WBLNyZUeBK.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/22/21/6525377870280266767_dWHPJlWCCw.mp4","https://mpaw-sinc1.muscdn.com/reg02/2017/12/26/19/310155477382950912_MjZuqVoVrP.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/17/19/6533868231306777600_IRsOmngluK.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/17/19/6533878994402546688_MSrYSNJNEY.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/13/17/6532366241095488512_LfRzxBMIdU.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/17/21/6533903649096078336_RFTqBEkfMe.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/16/22/6533544436616401920_pdrNxqZFxE.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/01/07/17/314472439177207808_roUZoFJynX.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/20/6534255422860170255_RlZPrBLNBI.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/18/00/6533945899826025472_kWeMlCDkYO.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/13/05/6532176798753494031_twrBPgghOs.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/18/6534228903874008079_PslZePcfYd.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/15/19/6533133070235603968_dfyxghfBdv.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/18/01/6533966707671700495_RFsQkICICk.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/01/30/14/6516722464012112911_WNNziqiUXf.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/14/16/6532721205164643328_jAQPczAlDs.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/01/23/6517606288703099904_HkdUzvhdAz.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/19/02/6534359824765817871_mSYDXNmwNE.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/20/6534256213566166031_JBFmPGwRIy.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/14/12/6532654732253598735_DhHtLTzTtG.mp4","https://mpaw-sinc1.muscdn.com/reg02/2017/12/30/02/311336622531342336_JsfHmaAFIM.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/16/20/6533513557529596943_yeJjWNNHDh.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/19/17/6534587565578654735_tFhgHqihTZ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/19/22/6534661371559154703_eGYNEtMedb.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/19/21/6534645484907140096_AqUFGbDZEC.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/20/00/6534701280223302656_cfGEiPZtWo.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/19/6531647691405923328_cXPdBmtFbW.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/16/16/6533451828711920655_EDgZMWSGrX.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/24/02/6525825830495458319_gBBRHSRwRm.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/17/03/6533629486007587855_IVGtBhLjlF.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/12/03/6531769856822383616_hNjkyibBFU.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/19/16/6534576029195834383_SXQCwbSJbv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/19/19/6534620147989091328_buqWQtNxJB.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/08/16/6530487634475619343_dxrJvoOckQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/20/18/6534964695034500111_nytCfzMHXN.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/19/17/6534578989921489935_khJDVakHNi.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/12/00/6531729444070003727_dBzjURbdlh.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/16/16/6533464218279089152_VOtSCpdWXK.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/20/6533153627555501056_RgpCXLkhJy.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/11/20/6531656986310743055_PuRxbVCzTZ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/20/23/6535052162538411008_xSLqKyalqD.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/20/21/6535024388297724943_KEDCGErBEr.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/20/18/6534972122970723328_ELoQJTdagT.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/21/18/6535349335205352448_ZrvQBQcLzx.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/19/6535366486192559119_kLigxvOFbW.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/20/05/6524376074032272399_PAazmwwtcq.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/18/13/6534157376889558031_ZWuWwNxkga.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/22/00/6535443204089582607_kKbAoqrMZn.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/20/6535376222656926735_SzQaxDbjLW.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/22/18/6535715390742336527_tbVxTjeOtc.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/05/6535148571799327744_tqZaoqAvfz.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/20/15/6534921477173548032_xKsCCssuNz.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/20/23/6535045293220566031_RGISmVtkQg.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/15/6535296079892583439_bGhsZYsfWQ.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/02/6535094404384822287_soTCMuqRuS.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/21/15/6535299607407105024_nEUrWkvgcM.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/19/04/6523991589826597903_OjDIHZoMuG.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/13/6535267612710933519_vTkrBBBNvF.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/20/6535372243344561152_aelgFlqpCE.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/21/6534281964596237312_znNbJPNpCN.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/18/6535716552937837583_rcVftPkEVi.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/20/23/6535054680735618063_SzaUAIiSvh.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/14/6535649360070317071_FDlefvnusn.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/20/12/6534883991424603151_qrXkclsnrb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/21/21/6535392156759102479_nFNASIvugA.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/20/17/6534951012778644480_AFGIzcYJLO.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/18/6535721780059837455_xwgzPBTzgl.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/21/22/6535405015836677135_eDwQzMGPtl.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/08/17/6530511163233408015_jaxNFKyIXv.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/22/00/6535435712844534784_NwLNDeTtfL.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/03/6535480090778686464_gZnPpvVRMU.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/22/02/6535464355402617871_tufDeSHUcw.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/10/06/6531068440143205391_ZkDqxaUtZw.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/04/19/6529048674213827584_VIJdckQbnt.mp4","https://mpal-ocne1.muscdn.com/reg02/2018/03/15/08/6532969243539936256_dEBrcQWkYQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/11/20/6531660648374342656_JMmAremujQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/21/6535763678766044175_JBMHYEABeV.mp4","https://mpak-ssgc1.akamaized.net/reg02/2018/03/12/19/6532022668441424896_WOUlKxuNyT.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/05/17/6529391749033366543_XxoYIQRfeA.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/14/6535653838622299136_bzWESXghlz.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/02/20/6528328886571242496_aqcJABmDuZ.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/22/07/6535538411745317903_SWgbPCSoWR.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/18/6535349457188328448_xzqiONJdFi.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/20/15/6534921751732687887_QCneFXkXDb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/21/13/6535268620472161280_GylSsBxKnO.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/14/15/6532691948057138191_buRSVtifCM.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/16/17/6533475513455875087_MtoFAZvFho.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/18/01/6533964388276130831_INbHybPeIb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/12/18/6532004656250360832_nOpDErWNde.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/18/15/6523795465203356687_ckAFfLxXDc.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/21/19/6535351446823506944_UKAYBmaQBC.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/22/05/6535515908402582543_dNpIJQmWDa.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/16/21/6533538958385615872_vbOXMMYXac.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/23/03/6535855039116743680_AGrMuCMCZJ.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/14/6535279134778594304_pYaWNvMAoh.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/20/16/6524551921519301647_dyUhaarsob.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/27/16/6527149394582574080_uQGnlVEbQK.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/01/16/6539392564527633423_kgFfCcZHHA.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/10/19/6520887138563658767_oNdRAEeGHr.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/20/16/6534946846949774351_HxzidlDGXi.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/01/19/6527943395732624399_TwoeHBJhgO.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/16/10/6533371630175917071_vuFYySgyld.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/01/20/6539450202992940047_RnCwnEOMjx.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/01/19/6527944391552668672_odPwSwlrcm.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/04/20/6529068440332801024_DgFcnpwkSK.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/26/03/6536967596451828736_RYmshVrWRM.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/24/00/6536184647552865295_GTApaRWlFo.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/19/22/6534667396123202560_CQGNZkBtoh.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/24/22/6536512206811452416_xTXPGZQHYJ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/01/21/6539472580523332623_CRwmtqGSXc.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/23/18/6536085018001806351_zYwPOsheWT.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/14/03/6532511564593894415_HdhSNugQLE.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/01/29/14/6516362586735252480_bRbHxgbqfl.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/01/22/6539492307484283904_qrrMatpwVR.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/31/14/6538999033975804943_zJeAlWxVHA.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/13/00/6532101984193877007_QDvBHHZVpL.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/17/17/6533849950155969536_WdpYByJcOr.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/01/23/6539503673263789056_AEHqhbzMrb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/31/14/6538996227642496000_ddUbOkWTQQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/14/20/6532784298309719040_TlDGBNYAwV.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/15/6535302542610404352_kaGwlPowhi.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/10/20/6531297233822815247_oAyGyLkCME.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/14/18/6532745314091144192_qWlboXMyVq.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/19/6533133811234903040_tPMWJoRfVE.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/02/04/6539572563574526976_FMeWeHqGpk.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/01/19/6539443206365385743_GjePzAdZMu.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/30/17/6538670750679700495_HIMCqKowax.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/12/6535253566087500815_KaCHwiwdnO.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/15/17/6522703691361817600_KQVagbFszo.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/29/16/6538273793897403407_WUeuEpOzmr.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/26/17/6537176754082026496_yiSOWDUSWV.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/24/16/6536431182500860928_CtpmfBKoDo.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/01/16/6539394122686403599_DLIhbLOMXo.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/28/01/6537671139425014799_YslQCWlvfH.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/19/12/6534501115432539151_BgqaxtuKmT.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/20/00/6534692964784935951_vChzAFMXHD.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/30/15/6538636383362225167_SutmfYJAag.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/26/10/6537076059475547136_vQorPFIWxn.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/26/05/6537000524212868096_hfaukdEWTw.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/20/18/6534964853570802688_IakiUnmXBV.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/28/22/6537999465599472655_PTkiFiVMem.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/11/05/6531425894018323471_TpHNnnnifl.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/16/01/6533232563392091151_TDXmlYIIfa.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/24/06/6525877464642638848_AJPxYQIkJu.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/02/18/6528292325041378304_VOuVeYOUkE.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/23/12/6536000154971935759_SYALdfTMqG.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/31/22/6539118304139678720_DjhBytRzBT.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/31/20/6539078118848599040_oEMrABQcgp.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/10/22/6531322031613432832_izKckjJcqY.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/21/15/6524904371203871744_fKsZkHXfhY.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/20/17/6534959733244171264_RDXvNLFkVr.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/29/01/6538052196641018880_zHuLZXgKJz.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/26/20/6537230162059072527_CCRGGmXSbY.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/12/18/6532010918853743631_UPUqibVpOK.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/01/22/6539484151433663488_zJvGbnuAsh.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/21/04/6535121560045360128_BcNNgWDpOB.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/22/23/6535786592181687296_EiSgGkEzsZ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/08/09/6530387282334061583_rOvEYXDBKv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/20/6534256824227468288_mLLNzmsrzJ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/27/19/6537583702757610511_ZQHAGYbire.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/26/02/6536946285759435776_cdYWKUMcRr.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/19/6534241208422634511_oXwtYOYcxX.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/08/23/6530589373820310528_nklnZJLQSC.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/01/20/6539450287814349824_upcWtQkVGH.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/11/18/6531629508989031439_SZUejJcKUL.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/02/13/6539723269820388352_iWNEbVflHH.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/04/6541806447963935759_tLDGYQdSNP.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/04/17/6540517345532580879_uNIngGFKaI.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/08/15/6541969560684205071_EQEPAWfRga.mp4","https://mpak-suse1.akamaized.net/reg02/2018/01/10/01/315308372457918464_cWkXRKgRVE.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/08/19/6542031351430779904_eDGffyXpgT.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/07/17/6541633044640437263_XWjDaZWGqb.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/08/05/6541815236846949391_YPELqFUhBM.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/08/17/6542001954359350287_SILWQqxEJI.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/07/23/6541724525636097039_GVdoCXkRfy.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/30/02/6538429760844862464_vbhIvUClhE.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/15/17/6533104125733770255_meIySuKhYT.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/04/03/6528800961975030784_RqmBBRHHib.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/07/20/6541689162213364736_qfAASUTIrD.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/18/05/6534031621404759055_GaeKhNmnNp.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/09/6541877521560900608_pUZnpMoABu.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/11/23/6531712504161113103_CxeTXxyXXI.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/19/6542037855269557248_ctSttkSewk.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/01/03/6517303707355321359_ozDGPTCBXb.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/23/06/6535900002676397056_UgbfIXsmei.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/03/02/6539926229535953935_dTLQuMMGch.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/07/20/6541684793287906304_QPkTHcleMo.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/17/17/6533836895405757455_EFSMxalbWj.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/07/16/6541619120801059840_rZjcMBZbfb.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/05/03/6540674471441732623_hDjYWjVILb.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/23/07/6535914126198182912_NHfqKsDfde.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/06/23/6541357230204130319_BNzFbnMacP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/21/19/6535359179387835407_oNaejGmhsr.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/16/02/6533246560560501775_WWCBhPPuLw.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/17/6542007905493718031_pJeDHllBij.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/16/6541991442934404111_AqyFwPtcZt.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/05/17/6540901745751495695_wrwwiSnApL.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/14/18/6532745744514814976_gapgOzPgOg.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/29/00/6538033081402528783_ycbDluisnP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/30/23/6538755958909178895_tNaKVeDPcC.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/04/19/6540548237957272591_SNFGEBPdLC.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/03/19/6540188639593239567_qXUgruHlZR.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/05/20/6529431561853473792_EEiOUghKpE.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/31/14/6538989143265907727_QDzrIPdarJ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/06/17/6541260717075469312_WYtVECjmZW.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/02/14/6539727555920925711_QqjRfelZRS.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/08/06/6541830207580410880_CfdROxVBHp.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/07/12/6541563962163467279_KorNpdRabz.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/23/18/6536087283106321408_DeamrrNCef.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/18/17/6523823275577971727_fBIkKfPYHQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/05/20/6529432891204588544_LQuORgKMHV.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/01/22/6539484435086054400_xugrMTLiiY.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/07/20/6541682332384891904_RuxlmpsZqA.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/06/15/6541234926170166272_MFoDsVbupM.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/28/10/6537820339349492736_EwQeplXQQn.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/07/02/6541411909525050368_zcMFUcWiZP.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/27/20/6537600688883504128_PqgwLWQipA.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/06/13/6541195733234619392_UQGoUFszAd.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/26/22/6537255990524384271_kJzDvGxUPB.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/05/17/6540900877140513807_DdRpuPJtAx.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/30/00/6538406021675619328_gJrZklOOww.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/07/21/6541705110848820239_rqCkLoQYfF.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/02/6541776729365566479_LpTXiMroKb.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/06/13/6541200283765052431_eLgYdMmprv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/20/15/6524529215855924224_qpKiEZBtLX.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/30/10/6538564364964729871_BwBBugDHwV.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/20/16/6524543469120132096_amxJkMoYxg.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/06/23/6541356228772107279_qlioFrnjce.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/06/14/6541222822927143936_sLykfzzbjP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/01/30/01/6516524267989931008_sgbWWmqoEY.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/06/16/6541250725157016576_nUUeUpwWnF.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/30/19/6538694735425442816_LsvHvShLZW.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/06/22/6541348094527673359_lglJxhokly.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/18/16/6523807820167517184_mohDlofwEh.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/02/18/17/6523816702843556864_gzhJFOruyv.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/06/21/6541323707166495744_DJKemkFMYp.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/02/19/6528314497734546432_yWqbzWRWfy.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/27/19/6537587605016417295_GLZVJgaekZ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/06/21/6541331890312320015_ENBViEgtUd.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/27/03/6537336498159621120_hbxWcHcAdJ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/21/23/6535423540412290063_gfVlQuIXRc.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/24/16/6536425514985329679_XsDBSqmmtE.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/01/17/6539414403626832896_rvRDxqesee.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/07/12/6541563677823210511_ILKsHoRXNZ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/05/02/6540663835529843727_eckjTsuddh.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/14/19/6532755762295346191_UiDcqgOQxh.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/27/14/6537504947288691727_staGcnbSYU.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/05/18/6540909521240331264_XQtSubjHDd.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/05/17/6540887259279791104_tcpKWUMsjf.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/25/21/6526478488277357583_KscIaElmUo.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/18/6534232142984008704_msFGtcIDPv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/23/13/6536000533486900239_YGWHOqmufm.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/17/19/6533871337608320000_dILbIYEvGc.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/18/16/6534203059856217088_ySUppseIKr.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/20/17/6534954933765018639_gBYMvYMOgo.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/04/19/6540559267433288719_fEqtkIGPKZ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/16/6534198504561054720_XRfnBCaWxn.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/11/07/6531465471210820608_HxjZFmnGma.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/05/00/6540632964017951759_TmtuJNivIR.mp4","https://mpal-ocne1.muscdn.com/reg02/2018/04/04/11/6540431728798864384_fAivhseYqv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/09/17/6530878757777970191_BDPIsUnioV.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/15/6540120878716294159_iaMWQsffWC.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/17/00/6533576172867949583_kspOvUUiNR.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/27/00/6537283904108237839_qxpdVyRCsT.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/04/11/6540430310717264896_dZjaBqGejH.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/09/03/6530652819022681088_OdqpJkRtas.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/03/05/6539964457768981519_BNvCEnJgDW.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/01/19/6539448257402115087_GxfSGqwTmz.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/26/18/6537200315123373071_dfEcACRrWb.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/27/18/6537573969887761408_bZMCTgkZcB.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/04/18/6540531672704635919_ntFCdirety.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/04/12/6540443129181377536_OqpLNJtqje.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/04/14/6540473609645724687_aLyIYGCmfC.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/04/12/6540440513990890496_evQPZMlFjs.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/19/01/6534335096021849103_OeNCOFGJaY.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/20/6540202691581187072_QkWmIhAMxj.mp4","https://mpal-ocne1.muscdn.com/reg02/2018/03/25/21/6536881778160833536_AokPHZsCDK.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/27/20/6537607372804723727_vcDbCbPlxY.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/28/18/6537945988089254912_rwKTdxPJZY.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/04/03/6540310883933885455_gszMuopviP.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/28/01/6537678311441568783_vhfTnlpBFv.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/02/01/6539528480952947727_dEufelfoOb.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/25/15/6536775947180315648_ryeVXMPZYL.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/28/09/6537806819727774735_iNaTlzLuhj.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/18/6540166298188387328_BqgcBvDopx.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/00/6535435153160803328_rlBAzKXeaq.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/02/20/6539822654159852559_yZomqUQUwQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/22/6534291180740432911_iKvJYTYuJE.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/29/14/6538256482029278208_JQZmylduwz.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/27/23/6537653798842668032_ZJMZHKOnVE.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/03/21/6528707290881610752_TlEmPGiSXe.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/24/16/6536425236764562447_HjzzAbwNkR.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/27/03/6537338936333702159_LuxjNxPViT.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/01/12/6539340232217596943_gGZJUbAqbt.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/16/19/6533500589685347343_EshTUYyJfe.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/21/15/6535297754069996559_NIBDDjoUjg.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/03/14/6540113015390344192_exDMicFdAm.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/20/6540191045332767759_MGSjnlVIaP.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/18/6540166366681371663_YruSVgVCZe.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/12/20/6532041739153183759_vuUwRYsJKX.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/29/16/6538276142141412367_pGERrntJeq.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/02/19/6539808327310775296_qDVVGoyCKJ.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/19/6540187116997972992_ZiMLILtmVH.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/15/01/6532855797662110735_jtQViHJMrT.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/03/08/6540011739822429199_VKeogYiHOQ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/28/04/6537718538679882767_ECdHhzZtKw.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/03/07/6540002003727160335_MNCiyMrrVM.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/04/01/6540268009016005632_jUTQuRhICU.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/20/6540202860863296512_WXVgcdUExn.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/25/18/6536834192037123087_UWKzfXShwZ.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/02/20/6539831229544403983_CwxdVOtoqS.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/02/18/6539799123632067599_hZRFKshBqy.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/22/10/6535593960843252736_xFcgzchxss.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/24/03/6536225750079509504_haKWTzNfsS.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/03/00/6539894011727975439_PFjMbpCbMY.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/02/16/6539763787719775247_uVHWHaDCCu.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/02/6539917281542018048_VaJHnVrLLK.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/02/6535464687692157967_mUcRDOtHms.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/02/15/6539754515262870543_waFHAnbKNa.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/03/01/6539908725338018831_QxmxhDfjsS.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/03/14/6540113333477970944_lVuWUKxqhI.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/14/21/6532793771061416960_SGqlIkoeUj.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/10/6542263256533177344_ItDsKcPZBj.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/01/19/6527938068270289935_kODIjOQaba.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/09/03/6542161402683986944_kYMmzhAgTF.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/09/05/6542190280727073807_WyMZwnWgxz.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/06/16/6541243804337312768_emgQRPNOVU.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/20/17/6534956259962000384_qjHEQYwTvw.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/02/22/6539854990368838671_zaMODXjfKH.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/05/17/6540888407369847808_JNAGWihUDS.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/08/19/6542039334403462159_WeEAZzypiR.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/08/22/6542083848753124367_uEitIPZlXy.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/07/14/6541585671725782031_rohSJMhflC.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/08/17/6542002105551426575_wDAwgiJcbK.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/19/15/6534547674568332288_vWAlxOygdi.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/02/18/6539798619770344463_MUySsaetbA.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/02/6535470619327206400_tGvHncTBUO.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/08/15/6541980354113180687_DnrsbvNSBf.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/11/16/6543105432582362112_iANiejGmNy.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/23/21/6536126289902834703_aVkvovcBZO.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/04/20/6540572019908416527_iwiBmbmLbG.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/09/20/6542430684793803776_wyCZCNduZP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/13/01/6543618648232170496_nDeGHJYzHZ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/10/21/6542812886027211776_xWuekdLqhr.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/19/05/6534406084575106048_dxHLCQtSXq.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/13/16/6543852990384575503_aAOtCsEgnV.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/19/05/6534400800997774336_CMnGeSIVSV.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/12/21/6543560898483590159_nRcgTEgYGd.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/21/02/6535102161162867727_BiOCbIYAUo.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/10/21/6542808027253183503_nmwBTDUpXK.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/11/16/6543104904280413199_zRzVDSgBfD.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/08/02/6519888524286645263_iOFMwVnATW.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/09/18/6520498018846774272_fuJeMWuuqs.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/09/21/6542446359046263808_yqZAhlSFjB.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/10/13/6542692684077732864_NGtXQEpowE.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/12/19/6543527424561255424_eoXKlBoSjM.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/09/21/6542445591052424192_uGgAFbJRak.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/11/00/6542865146245551119_HVqrWCVRBA.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/09/14/6542339772587725839_dQLmlJTWTS.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/11/21/6543188640560845824_gBHWFMEohU.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/05/6542185470707635215_DVmCEIYLLP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/22/6542463350377288704_XtxQeUgVAH.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/24/18/6536452597048415247_DxhHVYHPRO.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/13/15/6543829191266145295_FgfFibSLZn.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/28/20/6537966502291772431_QRwXUjeynd.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/10/12/6542677820311606272_WouhRSgvtH.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/13/13/6543807490797081615_XYTelduuVB.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/18/23/6534303222826275855_phCRsIVbfP.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/13/17/6543867543449244687_LevbymvOte.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/09/07/6542230822538187791_nfBArmtsJX.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/03/22/18/6535715719672239119_OfSjLptRNe.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/02/22/22/6525381099974038543_cvvnhHQUNt.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/23/6542468843384607759_WuIJjRTNCw.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/12/03/6543281552359429120_qGSYhiHtFs.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/13/03/6543650824260686863_yToIPzyjHb.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/24/03/6525829220235482112_AnTqcxEesH.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/10/12/6542673452791239680_COAPfCEGtv.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/09/20/6542418769023603727_SDyXqnTbjR.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/20/21/6535013498936628224_WQChMVhYQY.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/29/07/6538145355098231808_gccLBNMQwD.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/04/21/6529076365327602688_wivaDRFIPy.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/10/19/6542782032005567503_VmVIiXfYqJ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/01/04/6517312414982083584_fLYTpUVhfs.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/07/21/6541696518808671247_mgbKLcsmhg.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/02/21/6539839758653199375_YPthKygghz.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/23/6542471905847284736_xFVugAqPdZ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/01/01/6539159607665759247_GWFTVUTksz.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/23/05/6535880278710162432_ZzWtyTAxvb.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/20/6542422900303991808_QDivXdvQQW.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/11/22/6543204313831838720_ILEkeQnwve.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/00/6541744848863499264_sfJeLZzuuP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/11/23/6543221167363200000_AxsTwrZRgP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/26/23/6537282540846240768_IKCYeuLGMw.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/13/06/6543689267489543168_PrOEWkXFON.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/19/6542403706762040335_GFEGZGYHUf.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/03/26/03/6536964041380746240_ZcwmKZQhZp.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/03/05/6539970997632635919_qJqWWnmywJ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/23/6542094453547504640_sZnhuJodOd.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/10/05/6542556780268884992_ZpbQfcbUXs.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/13/02/6543623405701174272_hyVewkpqnx.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/23/09/6535947483854410752_LQLccQEVWR.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/13/09/6543744647695438848_WxHeukREkQ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/01/04/6539215763905975296_wNYDJnMUFv.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/03/16/6518249371459392527_VOTpwQotNO.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/26/21/6537249611399042048_gmKaRMYdvD.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/30/07/6538508112351990784_JefwbYvUSk.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/13/03/6543643757810553856_cGGNFPSIew.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/08/11/6541920251200672768_PpabsePipJ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/13/04/6543664513810437135_sLOQJXwGyp.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/10/03/6542538214211621888_MlQMbUkOGk.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/05/21/6529452472514122752_KxRrvKIEos.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/10/23/6542846991578190863_dLmwjRAlik.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/28/20/6537975337823769615_OnUlBIUuRI.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/11/01/6542877111122662400_NbPvfdYTJO.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/04/6542175576269001728_hZKOKKHqjn.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/24/04/6525846377799373839_MYJiEAwyVq.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/08/21/6530564559772587023_TFLgQwVzen.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/02/22/6528352759673017344_PxiNtmtsAT.mp4","https://mpak-ssgc1.akamaized.net/reg02/2018/03/02/16/6528265199546291215_FkKvckInna.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/22/05/6535518288934343680_BMzldnKSvU.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/16/09/6533349324066133007_fqIVJPAjoB.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/06/23/6529853171248927744_KDSeujPxGP.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/04/16/6540502604076553216_iVNrTEQckC.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/22/20/6535743921341862927_iXORKtpQmc.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/05/01/6529146985218315279_caGOiojwCk.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/16/01/6533221277899953152_TRpvVjQisn.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/12/20/6543536592902968320_FXxIOiteTN.mp4","https://mpaw-sinc1.muscdn.com/reg02/2018/04/13/19/6543894809826825231_rIjdIDmuJc.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/08/23/6530597654047495183_IkOpZUTTjm.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/15/23/6533200192919835663_ppzwZuzskI.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/14/00/6532460922936497167_AIXQDronsw.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/28/04/6537717174759330831_wGryBHNDbO.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/29/05/6538111666037462016_KtmjjtztvT.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/15/18/6533122931474568207_pkSvOtdPsZ.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/11/02/6542886766083314688_IQMrdlurVG.mp4","https://mpak-sinc1.akamaized.net/reg02/2018/04/13/19/6543895656430310415_mumAMxDXWn.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/11/20/6543174540149658639_HVeivRZuey.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/22/6542461183343989760_uGDEFYwGEu.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/08/6542233628246545408_orbMVKsOLu.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/12/6542297125072409600_WwDmuPHCZd.mp4","https://mpak-suse1.akamaized.net/reg02/2018/03/22/11/6535604073939342351_RePWaRkyey.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/09/15/6542351685166044175_nCEbQzgkUD.mp4","https://mpak-suse1.akamaized.net/reg02/2018/02/25/20/6526473535932601344_yxjveCMgOb.mp4","https://mpak-suse1.akamaized.net/reg02/2018/04/06/21/6541333623977546752_VLhzusSvjq.mp4"];
 for(i=0;i<music_arr.length;i++){
	 //html+="<div class='swiper-slide'><video  poster='img/poster-2.png' class='video-swipe' volume=0.1 index="+i+" data-src-tag='"+category_lot[i]+"'  loop></video></div>";
	 arr.push("<div class='swiper-slide-chunk'><video  poster='img/poster-2.png' class='video-swipe' volume=0.1 index="+i+" data-src-tag='"+music_arr[i]+"'  loop></video></div>");
 }




 //$(".swiper-wrapper").html(html);

          try{
            var swiper = new Swiper('.swiper-container', {
              direction: 'horizontal',

              virtual:{
              	slides:music_obj.current_chunk.lot
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
          }catch(err){
              alert("Swiper Error");
          }

          //console.log( $(".video-swipe").first()  ); 

          var  $first_video = $(".video-swipe").first();
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

                      $(".swiper-slide-prev").find(".video-swipe")[0].src="";
                      $(".swiper-slide-next").find(".video-swipe")[0].src="";

                      $(".swiper-slide-prev").find(".video-swipe")[0].volume=0;
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
                              music_obj.read_file_System({},function(data1){

                                  /*Append*/

                                  $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                                  $(".page-chunk[tag='collection']").removeClass("hide-panel").addClass("show-panel");



                                    

                                    //$(".version-chunk").eq(tag-1).addClass("active-version");
                                    $(".version-chunk").eq((parseInt(tag,10)-1) ).addClass("active-version");

                                    swiper.slideTo(0, 10,function(){});

                                    var src = $(".video-swipe").eq(0).attr("data-src-tag");
                                    $(".video-swipe").eq(0).attr("src",src).attr("autoplay",true);
                                    $(".video-swipe").eq(0)[0].volume=1;



                                    window.localStorage.setItem("_BOM_CURRENT_INDEX_",0);


                                  //project_init();
                              });
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




