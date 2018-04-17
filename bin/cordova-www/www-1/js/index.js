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

              
              /*Check is already created or not*/
               //$(".list-ytb-videos").append("\nread_file_System");

               // ytb_obj.read_file_System(obj,function(data1){
               //          project_init();
               // });


              // $.ajax({url:ytb_obj.current_project_url+"/lot",type:"GET",data:{},
              //   success:function(success_obj){
              //     ytb_obj.create_category(success_obj,function(data1){

              //       console.log("Done1");
              //       console.log(data1);

              //       ytb_obj.flush_reward_file(success_obj,function(data2){
              //           console.log("Done2");
              //           console.log(data2);
              //       });

              //     });
              //     console.log(success_obj);
              //   },
              //   fail:function(fail_obj){
              //     console.log(fail_obj);
              //   }
              // });
              

              ytb_obj.init_version_check({},function(status){
                      if(status==0){

                              /*Get following object from server*/  

                              ytb_obj.fetch_lot_from_server({},function(success_obj){
                                    //alert("success from server");

                                    var obj={version:success_obj.version,version_history:success_obj.version_history,reward:success_obj.reward,lot:success_obj.lot,category:success_obj.category};
                                    ytb_obj.create_category(obj,function(data1){
                                      ytb_obj.read_file_System(obj,function(data1){
                                        project_init();
                                      });
                                    });
                              });

                              
                      }else{
                          /*No need to get object*/
                          ytb_obj.read_file_System({},function(data1){

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


function ytb(){
  //this.current_project_url="http://localhost:5000";
  this.current_project_url="http://noddy-doc.herokuapp.com";
  //this.reward_category=["snl","kimmel","conan"];
  this.interstitial_category=[];
  this.current_chunk={ lot:{},category_list:{},current_version:0,version_history:{},reward_lot:[]};
}
var ytb_obj = new ytb();


ytb.prototype.fetch_lot_from_server=function(obj,callback){


    $.ajax({url:ytb_obj.current_project_url+"/ytb/lot",type:"GET",data:{},
        success:function(success_obj){
          /*Fetch from*/
          console.log(success_obj);
          callback(success_obj);
        },
        fail:function(fail_obj){
          alert("Fail ajax request");
          console.log(fail_obj);
        }
   });

};


ytb.prototype.fetch_new_lot=function(obj,callback){
  /*Unlock and push into file*/
};

ytb.prototype.reward_unlock_tab=function(obj,callback){  
    /*Unlock and push into file*/
};

ytb.prototype.reward_unlock_version=function(obj,callback){  
    /*Load version with all new file system*/
};






ytb.prototype.version_file_push=function(obj,callback){

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
                  $(".list-ytb-videos").append("okay");
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
                  $(".list-ytb-videos").append("reject");
              };
              fileWriter.write(version);
          });
    }, function(err) {
       $(".list-ytb-videos").append(err);
    });          
};

ytb.prototype.category_list_file_push=function(obj,callback){


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
                  $(".list-ytb-videos").append("okay");
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
                  $(".list-ytb-videos").append("reject");
              };
              fileWriter.write(JSON.stringify(category));
          });
    }, function(err) {
       $(".list-ytb-videos").append("err-2");
    });      

};

ytb.prototype.category_lot_file_push=function(obj,callback){

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
       $(".list-ytb-videos").append("err-2");
    });      

};

ytb.prototype.reward_list_file_push=function(obj,callback){

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
                  $(".list-ytb-videos").append("okay");
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
       $(".list-ytb-videos").append("err-2");
    });   

};

ytb.prototype.version_history_list_file_push=function(obj,callback){


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
                  $(".list-ytb-videos").append("okay");
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
                  $(".list-ytb-videos").append("reject");
              };
              fileWriter.write(JSON.stringify(version_history));
          });
    }, function(err) {
       //$(".list-ytb-videos").append("err-2");
       //project_init();    
    });   
};





ytb.prototype.init_version_check=function(obj,callback){
   /*Check version is found with server version */

  //alert("init_version_check");

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


ytb.prototype.create_category=function(obj,callback){

/*Create*/
//alert("create_category");

window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    ytb_obj.version_file_push({fs:fs,version:obj.version},function(){
      
          ytb_obj.category_lot_file_push({fs:fs,lot:obj.lot},function(){
            ytb_obj.category_list_file_push({fs:fs,category:obj.category},function(){
              ytb_obj.reward_list_file_push({fs:fs,reward:obj.reward},function(){
                ytb_obj.version_history_list_file_push({fs:fs,version_history:obj.version_history},function(){
                    //alert("Okay Done Every thing");
                    callback();
                });
              });
            });
        });
     });

},function(err) {
    alert("Error File system");
});

//var obj={version:1,version_history:["1","2"],category:["Kimmel","Ellen"],reward_lot:["Kimmel"],lot:{"Kimmel":[{"ytb_code":"RDocnbkHjhI","ytb_title":"Mean Tweets - President Obama Edition","ytb_poster":"https://img.youtube.com/vi/RDocnbkHjhI/0.jpg"},{"ytb_code":"jpFXXSDh9Zs","ytb_title":"Matt Damon and Jimmy Kimmel Feud - Best Moments Compilation - 2017","ytb_poster":"https://img.youtube.com/vi/jpFXXSDh9Zs/0.jpg"},{"ytb_code":"bOJndrIrMQY","ytb_title":"Matt Damon Confronts Jimmy Kimmel After Emmys Loss","ytb_poster":"https://img.youtube.com/vi/bOJndrIrMQY/0.jpg"},{"ytb_code":"4nPuZ9chE7s","ytb_title":"Matt Damon and Jimmy Kimmel go to Couples Therapy","ytb_poster":"https://img.youtube.com/vi/4nPuZ9chE7s/0.jpg"},{"ytb_code":"fDkXHWMNNmc","ytb_title":"Jimmy Kimmel’s Oscars Monologue","ytb_poster":"https://img.youtube.com/vi/fDkXHWMNNmc/0.jpg"},{"ytb_code":"8SH16TuCYyE","ytb_title":"Jimmy Kimmel Auditions for Every Matt Damon Role","ytb_poster":"https://img.youtube.com/vi/8SH16TuCYyE/0.jpg"},{"ytb_code":"kmch-V7rPcY","ytb_title":"Lie Witness News – Royal Baby Edition","ytb_poster":"https://img.youtube.com/vi/kmch-V7rPcY/0.jpg"},{"ytb_code":"XYviM5xevC8","ytb_title":"We Ask Kids How Trump is Doing","ytb_poster":"https://img.youtube.com/vi/XYviM5xevC8/0.jpg"},{"ytb_code":"bVATtKo9UWA","ytb_title":"Kimmel Asks Kids \"Who Do You Love More... Mom or Dad?\"","ytb_poster":"https://img.youtube.com/vi/bVATtKo9UWA/0.jpg"},{"ytb_code":"KPgpRw9tiuM","ytb_title":"Jimmy Kimmel Lie Detective #1","ytb_poster":"https://img.youtube.com/vi/KPgpRw9tiuM/0.jpg"}],"Comedy":[{"ytb_code":"TpTcw4sVLsk","ytb_title":"Krushna Sudesh Mimic Bollywood Veterans | Comedy Circus Ka Naya Daur","ytb_poster":"https://img.youtube.com/vi/TpTcw4sVLsk/0.jpg"},{"ytb_code":"6v4vHH82ZMo","ytb_title":"Bombay Ki Baarish Bro - Sundeep Sharma Stand-up Comedy","ytb_poster":"https://img.youtube.com/vi/6v4vHH82ZMo/0.jpg"},{"ytb_code":"p2Wq2j4Iy34","ytb_title":"Hazaar Ke Note Ki Barsee-Sundeep Sharma Stand-up Comedy on Demonetisation","ytb_poster":"https://img.youtube.com/vi/p2Wq2j4Iy34/0.jpg"},{"ytb_code":"KFtGD7zB95k","ytb_title":"Gangs of Hasseepur Episode 9 - Sawal Par Bawal","ytb_poster":"https://img.youtube.com/vi/KFtGD7zB95k/0.jpg"},{"ytb_code":"hEk1_F0qoWU","ytb_title":"TSP's If Politicians Were Call Centre Employees","ytb_poster":"https://img.youtube.com/vi/hEk1_F0qoWU/0.jpg"},{"ytb_code":"Fw2TURkk0jY","ytb_title":"Speaking Punjabi with Mumbai people | vada pav | Pranks in India","ytb_poster":"https://img.youtube.com/vi/Fw2TURkk0jY/0.jpg"},{"ytb_code":"y8LQdTw-FVQ","ytb_title":"raju saying abt film stars","ytb_poster":"https://img.youtube.com/vi/y8LQdTw-FVQ/0.jpg"},{"ytb_code":"22oudJUqy8w","ytb_title":"America's Got Talent 2015 S10E04 Uzeyer Novruzov Channels a Charlie Chaplin Silent Movie","ytb_poster":"https://img.youtube.com/vi/22oudJUqy8w/0.jpg"},{"ytb_code":"vRci8GwPGC0","ytb_title":"Best Sledging Reply Ever In Cricket History.","ytb_poster":"https://img.youtube.com/vi/vRci8GwPGC0/0.jpg"}],"Best_comedy_circus":[{"ytb_code":"t-0hA6l3Xl8","ytb_title":"Krushna, Sudesh & Siddharth Play The Khan Brothers | Comedy Circus Ke Ajoobe","ytb_poster":"https://img.youtube.com/vi/t-0hA6l3Xl8/0.jpg"},{"ytb_code":"NgJuDJS-IFU","ytb_title":"Comedy Circus - 3 Ka Tadka","ytb_poster":"https://img.youtube.com/vi/NgJuDJS-IFU/0.jpg"},{"ytb_code":"Utm2fYgkktI","ytb_title":"Comedy Circus Ke Mahabali - Episode 6 - Parineeti Chopra in Comedy Circus Ke Mahabali","ytb_poster":"https://img.youtube.com/vi/Utm2fYgkktI/0.jpg"},{"ytb_code":"lXMFkChCVgA","ytb_title":"Kapil Tries To Impress Sudesh With His Singing | Comedy Circus Ke Ajoobe","ytb_poster":"https://img.youtube.com/vi/lXMFkChCVgA/0.jpg"},{"ytb_code":"EuDKhWgThng","ytb_title":"Sudesh Teaches Krushna How To Cook | Comedy Circus Ka Naya Daur","ytb_poster":"https://img.youtube.com/vi/EuDKhWgThng/0.jpg"},{"ytb_code":"J5Yc768CZ2w","ytb_title":"Krushna Meets Sohail Khan | Comedy Circus Ke Ajoobe","ytb_poster":"https://img.youtube.com/vi/J5Yc768CZ2w/0.jpg"},{"ytb_code":"YtmNjfLateY","ytb_title":"Sports Special With Krushna And Sudesh | Comedy Circus Ka Naya Daur","ytb_poster":"https://img.youtube.com/vi/YtmNjfLateY/0.jpg"},{"ytb_code":"Nb2F_iw3oFo","ytb_title":"Krushna As Kaalia And Sudesh As A Plane - Kahani Comedy Circus Ki","ytb_poster":"https://img.youtube.com/vi/Nb2F_iw3oFo/0.jpg"},{"ytb_code":"1z1w-P_wzMM","ytb_title":"Krushna's Blind Date, Sumona - Kahani Comedy Circus Ki","ytb_poster":"https://img.youtube.com/vi/1z1w-P_wzMM/0.jpg"},{"ytb_code":"A-Jj5COPLGU","ytb_title":"Comedy Circus Ke Mahabali - Episode 27 - Mimicry Special","ytb_poster":"https://img.youtube.com/vi/A-Jj5COPLGU/0.jpg"}],"Picked":[{"ytb_code":"nBjYj6egQQo","ytb_title":"Karcocha Rio 2017","ytb_poster":"https://img.youtube.com/vi/nBjYj6egQQo/0.jpg"},{"ytb_code":"EZUpEiOgx4M","ytb_title":"Aamir Khan's unforgetable visit to a hotel | Rangeela","ytb_poster":"https://img.youtube.com/vi/EZUpEiOgx4M/0.jpg"},{"ytb_code":"aawrUcy7eXk","ytb_title":"Paresh Rawal, Aamir Khan, Salman Khan - Andaz Apna Apna - Comedy Scene 20/23","ytb_poster":"https://img.youtube.com/vi/aawrUcy7eXk/0.jpg"},{"ytb_code":"9kxL9Cf46VM","ytb_title":"A Saudi, an Indian and an Iranian walk into a Qatari bar ... | Maz Jobrani","ytb_poster":"https://img.youtube.com/vi/9kxL9Cf46VM/0.jpg"},{"ytb_code":"1lfebiTjA8c","ytb_title":"Marjaingye Sasta Gosht Nahi Bachainge - Loose Talk","ytb_poster":"https://img.youtube.com/vi/1lfebiTjA8c/0.jpg"},{"ytb_code":"pHcJ0L7tEyw","ytb_title":"Drop the Mic: Kunal Nayyar vs Mayim Bialik - FULL BATTLE | TBS","ytb_poster":"https://img.youtube.com/vi/pHcJ0L7tEyw/0.jpg"},{"ytb_code":"GZof-MCEDx0","ytb_title":"OLD PICTURES OF FAMOUS PEOPLE THAT WILL AMAZE YOU","ytb_poster":"https://img.youtube.com/vi/GZof-MCEDx0/0.jpg"},{"ytb_code":"BBYNf2sywEA","ytb_title":"Rare Historical Photos Will Change How You See The Past HD 2015 HD","ytb_poster":"https://img.youtube.com/vi/BBYNf2sywEA/0.jpg"},{"ytb_code":"duKL2dAJN6I","ytb_title":"\"Joking Bad\" - Late Night with Jimmy Fallon (Late Night with Jimmy Fallon)","ytb_poster":"https://img.youtube.com/vi/duKL2dAJN6I/0.jpg"},{"ytb_code":"OPf0YbXqDm0","ytb_title":"Mark Ronson - Uptown Funk ft. Bruno Mars","ytb_poster":"https://img.youtube.com/vi/OPf0YbXqDm0/0.jpg"}],"Best_of_kapil_sharma":[{"ytb_code":"TlI6F5w2ecw","ytb_title":"Bacha Yadav Presents Madhur Bhandarkar A Biopic Script - The Kapil Sharma Show - 9th July, 2017","ytb_poster":"https://img.youtube.com/vi/TlI6F5w2ecw/0.jpg"},{"ytb_code":"keTAIGpCiBg","ytb_title":"Undekha Tadka | Ep 50 | Parineeti & Ayushmaan Khurana | The Kapil Sharma Show | SonyLIV | HD","ytb_poster":"https://img.youtube.com/vi/keTAIGpCiBg/0.jpg"},{"ytb_code":"aZkBhKVX0Ec","ytb_title":"Suman Hooda has fun with the guests - The Kapil Sharma Show - Episode 15 - 11th June 2016","ytb_poster":"https://img.youtube.com/vi/aZkBhKVX0Ec/0.jpg"},{"ytb_code":"3Mrr64sAQJc","ytb_title":"Live TV debate with star cast of Saat Uchakkey -The Kapil Sharma Show-Ep.51-15th Oct 2016","ytb_poster":"https://img.youtube.com/vi/3Mrr64sAQJc/0.jpg"},{"ytb_code":"eG5booWzFC8","ytb_title":"Citi Cable Interview With Arbaz Khan, Amy Jackson And Nawazuddin Siddiqui - The Kapil Sharma Show","ytb_poster":"https://img.youtube.com/vi/eG5booWzFC8/0.jpg"},{"ytb_code":"S6QYmCj-XeA","ytb_title":"Baccha Welcomes Suresh Raina, Shikhar Dhawan & Hardik Pandya -The Kapil Sharma Show - 27th May, 2017","ytb_poster":"https://img.youtube.com/vi/S6QYmCj-XeA/0.jpg"},{"ytb_code":"JfbrKmVyAl8","ytb_title":"Baccha Yadav's Fun Ride With Huma Qureshi & Saqib Saleem - The Kapil Sharma Show - 21st May, 2017","ytb_poster":"https://img.youtube.com/vi/JfbrKmVyAl8/0.jpg"},{"ytb_code":"1Eml6X3a3us","ytb_title":"Rajesh Arora's Funny Ride with Parineeti & Ayushmann -The Kapil Sharma Show - 8th Apr, 2017","ytb_poster":"https://img.youtube.com/vi/1Eml6X3a3us/0.jpg"},{"ytb_code":"Y5Wt-FBLGWk","ytb_title":"Rajesh Arora's Best Performance Ever with Shahid Kapoor and Kangana Ranaut | The Kapil Sharma Show","ytb_poster":"https://img.youtube.com/vi/Y5Wt-FBLGWk/0.jpg"},{"ytb_code":"wAmwYZik-mM","ytb_title":"Rajesh Arora Best Comedy | The Kapil Sharma Show | Indian Comedy","ytb_poster":"https://img.youtube.com/vi/wAmwYZik-mM/0.jpg"}],"Thug_Life":[{"ytb_code":"hFRud-VX49E","ytb_title":"BEST OF THE MONTH JANUARY 2018 | THUGLIFE CLIPS","ytb_poster":"https://img.youtube.com/vi/hFRud-VX49E/0.jpg"},{"ytb_code":"FjNvuLL2ePY","ytb_title":"Like a BOSS//THUG Life #8","ytb_poster":"https://img.youtube.com/vi/FjNvuLL2ePY/0.jpg"},{"ytb_code":"yd3dI4uzlpk","ytb_title":"THUG LIFE #64 - Canal HueHueBR","ytb_poster":"https://img.youtube.com/vi/yd3dI4uzlpk/0.jpg"},{"ytb_code":"IAZ7ALNvJfI","ytb_title":"Best Thug Life Compilation of 2017 #4","ytb_poster":"https://img.youtube.com/vi/IAZ7ALNvJfI/0.jpg"},{"ytb_code":"5EbIX1NopZA","ytb_title":"Like a BOSS//THUG Life #7","ytb_poster":"https://img.youtube.com/vi/5EbIX1NopZA/0.jpg"},{"ytb_code":"SN_eLIC9NZ4","ytb_title":"ULTIMATE KIDS THUG LIFE COMPILATION OF 2017⚫KIDS WITH ATTITUDES⚫THUG KIDS⚫TRY NOT TO LAUGH KIDS⚫","ytb_poster":"https://img.youtube.com/vi/SN_eLIC9NZ4/0.jpg"},{"ytb_code":"95hJ15blSz8","ytb_title":"THUG LIFE #59 - Canal HueHueBR","ytb_poster":"https://img.youtube.com/vi/95hJ15blSz8/0.jpg"},{"ytb_code":"eJwkGR2uwZM","ytb_title":"OS REIS DO THUG LIFE - THE KING OF THUG LIFE #45","ytb_poster":"https://img.youtube.com/vi/eJwkGR2uwZM/0.jpg"},{"ytb_code":"qaexja3lViU","ytb_title":"Best Thug Life Compilation of 2017 #3","ytb_poster":"https://img.youtube.com/vi/qaexja3lViU/0.jpg"},{"ytb_code":"m1FhVFw_2W4","ytb_title":"King Of Thug Life World","ytb_poster":"https://img.youtube.com/vi/m1FhVFw_2W4/0.jpg"}],"Prank":[{"ytb_code":"xAmxuqZcfYY","ytb_title":"HAND TOUCHING ON ESCALATOR PRANK","ytb_poster":"https://img.youtube.com/vi/xAmxuqZcfYY/0.jpg"},{"ytb_code":"KQEX5FKpevE","ytb_title":"SHAMPOO PRANK PART 9! | HoomanTV","ytb_poster":"https://img.youtube.com/vi/KQEX5FKpevE/0.jpg"},{"ytb_code":"GjNIVIfxNEc","ytb_title":"Funny Hot Beach Girls Prank - TRY NOT TO LAUGH - Funny Videos 2017","ytb_poster":"https://img.youtube.com/vi/GjNIVIfxNEc/0.jpg"},{"ytb_code":"v0U9GMWuNnU","ytb_title":"Top 5 Pranks of All Time","ytb_poster":"https://img.youtube.com/vi/v0U9GMWuNnU/0.jpg"},{"ytb_code":"OoHkyYX4n50","ytb_title":"Blasting INAPPROPRIATE Songs (PART 2) in the Library PRANK","ytb_poster":"https://img.youtube.com/vi/OoHkyYX4n50/0.jpg"},{"ytb_code":"mPh9JZlVUK0","ytb_title":"Loud Eating in the Library!","ytb_poster":"https://img.youtube.com/vi/mPh9JZlVUK0/0.jpg"},{"ytb_code":"4zEeWvEO5tU","ytb_title":"TOP 10 HUSBAND VS WIFE PRANKS OF 2016 - Pranksters In Love","ytb_poster":"https://img.youtube.com/vi/4zEeWvEO5tU/0.jpg"},{"ytb_code":"CUaekPb7fQI","ytb_title":"Top 3 Pranks of All Time","ytb_poster":"https://img.youtube.com/vi/CUaekPb7fQI/0.jpg"},{"ytb_code":"DNMjmPIj0kA","ytb_title":"Nobody Expected These 5 Pranks Coming !","ytb_poster":"https://img.youtube.com/vi/DNMjmPIj0kA/0.jpg"},{"ytb_code":"es2krnRZ2Ko","ytb_title":"Funniest Airport Prank","ytb_poster":"https://img.youtube.com/vi/es2krnRZ2Ko/0.jpg"}],"short_story":[{"ytb_code":"HYMNRiwp3jQ","ytb_title":"MONK (A tribute to the legend, OLD MONK) - A Short Film","ytb_poster":"https://img.youtube.com/vi/HYMNRiwp3jQ/0.jpg"},{"ytb_code":"eAVlNzgxCHs","ytb_title":"Laugh - Feat.Sanjay Misra, Sheeba Chaddha, Vrajesh Hirjee & Brijendra Kala","ytb_poster":"https://img.youtube.com/vi/eAVlNzgxCHs/0.jpg"},{"ytb_code":"JCSVm0cZgOI","ytb_title":"Inspirational, Suspense short Film - Batwa \"बटवा\" (wallet)","ytb_poster":"https://img.youtube.com/vi/JCSVm0cZgOI/0.jpg"},{"ytb_code":"J2mqIgdae5I","ytb_title":"Anukul | Satyajit Ray | Sujoy Ghosh I Royal Stag Barrel Select Large Short Films","ytb_poster":"https://img.youtube.com/vi/J2mqIgdae5I/0.jpg"},{"ytb_code":"AhtGak2psBM","ytb_title":"BHUTACHA JANMA | BHAU KADAM | AWARD WINNING SHORT FILM | BIRTH OF A GHOST","ytb_poster":"https://img.youtube.com/vi/AhtGak2psBM/0.jpg"},{"ytb_code":"5QjStJTCLAo","ytb_title":"Trapped - Thriller Short Story Of A Trapped Girl","ytb_poster":"https://img.youtube.com/vi/5QjStJTCLAo/0.jpg"},{"ytb_code":"TIFiVknKdPc","ytb_title":"3 SHADES | MOST INSPIRATIONAL INDIAN SHORT FILM","ytb_poster":"https://img.youtube.com/vi/TIFiVknKdPc/0.jpg"},{"ytb_code":"lt1Ht8kapvI","ytb_title":"Hindi Short Film  on Girl Falls in Love - Blured Lines","ytb_poster":"https://img.youtube.com/vi/lt1Ht8kapvI/0.jpg"},{"ytb_code":"QMzg3Tw8zzo","ytb_title":"Poor Kids (Documentary) - Real Stories- poor child life india   - heart touching video","ytb_poster":"https://img.youtube.com/vi/QMzg3Tw8zzo/0.jpg"},{"ytb_code":"OnhZDZXzBz4","ytb_title":"An inspiring story of Manoj who never stopped dreaming","ytb_poster":"https://img.youtube.com/vi/OnhZDZXzBz4/0.jpg"}],"Indian_Prank":[{"ytb_code":"k-6fT8EloYI","ytb_title":"\"Attitude Mat Dikhao!\" Prank on Cute Girls | Pranks In India","ytb_poster":"https://img.youtube.com/vi/k-6fT8EloYI/0.jpg"},{"ytb_code":"WBE6jLH90i0","ytb_title":"\"Bhootni Lagg Rahi Hai!\" Prank on Cute Girls Gone Terribly Wrong | Pranks In India | Part 2","ytb_poster":"https://img.youtube.com/vi/WBE6jLH90i0/0.jpg"},{"ytb_code":"WpuQJyIkXF0","ytb_title":"indian prank with wife","ytb_poster":"https://img.youtube.com/vi/WpuQJyIkXF0/0.jpg"},{"ytb_code":"i9LsxlCVOus","ytb_title":"\"Banja Tu Meri Rani!\" Prank on Cute Girls | Pranks In India","ytb_poster":"https://img.youtube.com/vi/i9LsxlCVOus/0.jpg"},{"ytb_code":"qoYdS3u6f9E","ytb_title":"DHUKAN THOD DALUNGA PRANK | PRANK IN INDIA | BY VJ PAWAN SINGH","ytb_poster":"https://img.youtube.com/vi/qoYdS3u6f9E/0.jpg"},{"ytb_code":"6eqc8UGlzRk","ytb_title":"Pulling Bra From Hair Prank | AVRprankTV | Pranks in India","ytb_poster":"https://img.youtube.com/vi/6eqc8UGlzRk/0.jpg"},{"ytb_code":"aacF2YE8ty0","ytb_title":"Kid Calling Cute Girls \"Maaji\" Prank | Part 3 | Pranks In India","ytb_poster":"https://img.youtube.com/vi/aacF2YE8ty0/0.jpg"},{"ytb_code":"v-A4EjgikdA","ytb_title":"Dirty Mind Test -  | delhi girls | Indian girls | Prank video","ytb_poster":"https://img.youtube.com/vi/v-A4EjgikdA/0.jpg"},{"ytb_code":"6JCp7l_rfkY","ytb_title":"Girl Saying Aapki Pant Fatt Gayi Hai | Prank In India | Oye Its Prank","ytb_poster":"https://img.youtube.com/vi/6JCp7l_rfkY/0.jpg"},{"ytb_code":"zVFaNrch0CQ","ytb_title":"EXPOSING COUPLES IN PUBLIC | Breaking News Prank | Pranks In India","ytb_poster":"https://img.youtube.com/vi/zVFaNrch0CQ/0.jpg"}],"Experiment":[{"ytb_code":"lEhLcc__MX4","ytb_title":"People Are Awesome  - Win Compilation || PuVideo","ytb_poster":"https://img.youtube.com/vi/lEhLcc__MX4/0.jpg"},{"ytb_code":"OYpKDg4gBDQ","ytb_title":"EXPERIMENT 20000 MATCHES VS EGG – The Most Satisfying Video – Amazing Crazy Experiment","ytb_poster":"https://img.youtube.com/vi/OYpKDg4gBDQ/0.jpg"},{"ytb_code":"XzgDeoSRAsg","ytb_title":"EXPERIMENT 20000 MATCHES VS POP CORN   Amazing Crazy Experiment","ytb_poster":"https://img.youtube.com/vi/XzgDeoSRAsg/0.jpg"},{"ytb_code":"vJG698U2Mvo","ytb_title":"selective attention test","ytb_poster":"https://img.youtube.com/vi/vJG698U2Mvo/0.jpg"},{"ytb_code":"fkPPkDwH9NA","ytb_title":"Diamond vs Hydraulic Press - Real is rare","ytb_poster":"https://img.youtube.com/vi/fkPPkDwH9NA/0.jpg"},{"ytb_code":"PfBIsfoFXSw","ytb_title":"EXPERIMENT 1000 Degree Glowing Knife vs 1Kg GOLD","ytb_poster":"https://img.youtube.com/vi/PfBIsfoFXSw/0.jpg"},{"ytb_code":"wGM1-0NaQLU","ytb_title":"How To Recover Gold From Cell Phone Sim Cards EXPERIMENT","ytb_poster":"https://img.youtube.com/vi/wGM1-0NaQLU/0.jpg"},{"ytb_code":"ntS01EhY9QY","ytb_title":"THIS Little CHILD Alone On THE STREET, What would YOU do ?(Social Experiment)","ytb_poster":"https://img.youtube.com/vi/ntS01EhY9QY/0.jpg"},{"ytb_code":"muY7Uf4jbEo","ytb_title":"FAT GUY vs 6-PACK: Hugging Strangers! (SOCIAL EXPERIMENT)","ytb_poster":"https://img.youtube.com/vi/muY7Uf4jbEo/0.jpg"},{"ytb_code":"zqGuWygCQQc","ytb_title":"Muslim Commiting Suicide! Will People Step In? (Social Experiment)","ytb_poster":"https://img.youtube.com/vi/zqGuWygCQQc/0.jpg"}],"Emotional":[{"ytb_code":"n9rJOWy1hSQ","ytb_title":"#10 Most Emotional Moments in Cricket History | Cricket Friendship Moments","ytb_poster":"https://img.youtube.com/vi/n9rJOWy1hSQ/0.jpg"},{"ytb_code":"2EV6q6b5CN8","ytb_title":"Emotional WrestleMania moments - WWE Top 10","ytb_poster":"https://img.youtube.com/vi/2EV6q6b5CN8/0.jpg"},{"ytb_code":"c5qlt_Fbo3A","ytb_title":"2017 • Football Respect • Emotional Moments • Fair Play","ytb_poster":"https://img.youtube.com/vi/c5qlt_Fbo3A/0.jpg"},{"ytb_code":"dShqK3xEb18","ytb_title":"Emotional short story that will make you cry  Silence of Love","ytb_poster":"https://img.youtube.com/vi/dShqK3xEb18/0.jpg"},{"ytb_code":"q9EdsON36ac","ytb_title":"28 Breathtaking Moment that will touch your HEART & SOUL","ytb_poster":"https://img.youtube.com/vi/q9EdsON36ac/0.jpg"},{"ytb_code":"DfJgfUAr2M8","ytb_title":"And Now! Most Emotional Soldiers Coming Home Moments | Part 1 | RESPECT","ytb_poster":"https://img.youtube.com/vi/DfJgfUAr2M8/0.jpg"},{"ytb_code":"Zw24MDlhUgE","ytb_title":"A Heart Touching Beautiful Emotional Short story","ytb_poster":"https://img.youtube.com/vi/Zw24MDlhUgE/0.jpg"},{"ytb_code":"NV6RfexD_MQ","ytb_title":"A Very Sad Heart Touching Short story (You will cry after watching this video !)","ytb_poster":"https://img.youtube.com/vi/NV6RfexD_MQ/0.jpg"},{"ytb_code":"9aCclf8IUvA","ytb_title":"Story Of The Ugly Man - Emotional Video","ytb_poster":"https://img.youtube.com/vi/9aCclf8IUvA/0.jpg"},{"ytb_code":"IlZpn_uGPUw","ytb_title":"Creative And Emotional Indian Ads ( Collection )","ytb_poster":"https://img.youtube.com/vi/IlZpn_uGPUw/0.jpg"}],"Ads":[{"ytb_code":"uPuYcCg5esk","ytb_title":"Emotional And Thought Provoking Indian Ads","ytb_poster":"https://img.youtube.com/vi/uPuYcCg5esk/0.jpg"},{"ytb_code":"tKqJ9J1THaU","ytb_title":"Funniest Prank at Movie Theater","ytb_poster":"https://img.youtube.com/vi/tKqJ9J1THaU/0.jpg"},{"ytb_code":"K9vFWA1rnWc","ytb_title":"Best Advertisement ever-Winner of Best Ad 2014","ytb_poster":"https://img.youtube.com/vi/K9vFWA1rnWc/0.jpg"},{"ytb_code":"VD57EJqyUYg","ytb_title":"Top 5 ads of india","ytb_poster":"https://img.youtube.com/vi/VD57EJqyUYg/0.jpg"},{"ytb_code":"jyBkMCcHmaA","ytb_title":"Best Indian Ads (Collection)","ytb_poster":"https://img.youtube.com/vi/jyBkMCcHmaA/0.jpg"},{"ytb_code":"gN8Ol4w9u6s","ytb_title":"9 Best Ads Of Imperial Blue","ytb_poster":"https://img.youtube.com/vi/gN8Ol4w9u6s/0.jpg"},{"ytb_code":"ZVWpQr5-qV4","ytb_title":"TOP 10 FUNNIEST SUPER BOWL ADS - Best Ten Superbowl LII 52 2018 Commercials","ytb_poster":"https://img.youtube.com/vi/ZVWpQr5-qV4/0.jpg"},{"ytb_code":"Gh1c0t-7zJA","ytb_title":"Top 10 Funniest Sour Patch Kids Commercials of All Time (Best Sour Patch Kids Ads 2018)","ytb_poster":"https://img.youtube.com/vi/Gh1c0t-7zJA/0.jpg"},{"ytb_code":"Aa78KOPz-fA","ytb_title":"Top 7 Funniest  Avocados From Mexico Commercials Ever - Funny Ads Compilation","ytb_poster":"https://img.youtube.com/vi/Aa78KOPz-fA/0.jpg"},{"ytb_code":"gd3_YDX4Plk","ytb_title":"Top 10 Inspiring Commercials Celebrating Women #HerVoiceIsMyVoice","ytb_poster":"https://img.youtube.com/vi/gd3_YDX4Plk/0.jpg"}],"Animation_Short_movie":[{"ytb_code":"PDHIyrfMl_U","ytb_title":"CGI Animated Short Film HD \"Alike \" by Daniel Martínez Lara & Rafa Cano Méndez | CGMeetup","ytb_poster":"https://img.youtube.com/vi/PDHIyrfMl_U/0.jpg"},{"ytb_code":"fzrfrXhE-w4","ytb_title":"Sam | The Short Animated Movie","ytb_poster":"https://img.youtube.com/vi/fzrfrXhE-w4/0.jpg"},{"ytb_code":"dbKRRhEfCr0","ytb_title":"Piper (2016) - Short Film - Disney Pixar","ytb_poster":"https://img.youtube.com/vi/dbKRRhEfCr0/0.jpg"},{"ytb_code":"cxUuU1jwMgM","ytb_title":"EL EMPLEO / THE EMPLOYMENT","ytb_poster":"https://img.youtube.com/vi/cxUuU1jwMgM/0.jpg"},{"ytb_code":"MLBKJUF7TwM","ytb_title":"Another day in the office","ytb_poster":"https://img.youtube.com/vi/MLBKJUF7TwM/0.jpg"},{"ytb_code":"O9_EHU5BKnQ","ytb_title":"The 4 Types of Team Members You Can Hire","ytb_poster":"https://img.youtube.com/vi/O9_EHU5BKnQ/0.jpg"},{"ytb_code":"lK13SW0QW04","ytb_title":"Funny Birds   Animated Short Film","ytb_poster":"https://img.youtube.com/vi/lK13SW0QW04/0.jpg"},{"ytb_code":"j6PbonHsqW0","ytb_title":"The Egyptian Pyramids - Funny Animated Short Film (Full HD)","ytb_poster":"https://img.youtube.com/vi/j6PbonHsqW0/0.jpg"},{"ytb_code":"O_yVo3YOfqQ","ytb_title":"Changing Batteries - The Saddest Story 3D Animation","ytb_poster":"https://img.youtube.com/vi/O_yVo3YOfqQ/0.jpg"},{"ytb_code":"SdZHvMhNnHE","ytb_title":"EVERYTHING WRONG WITH HUMANiTY IN ONE SIMPLE ANIMATiON..","ytb_poster":"https://img.youtube.com/vi/SdZHvMhNnHE/0.jpg"}],"Conan":[{"ytb_code":"e8P5ZVWYD5M","ytb_title":"Vir Das Presents News From The Rest Of The World  - CONAN on TBS","ytb_poster":"https://img.youtube.com/vi/e8P5ZVWYD5M/0.jpg"},{"ytb_code":"PBeakKeMWRY","ytb_title":"Secret Santa Conan Blows His Staffer's Mind","ytb_poster":"https://img.youtube.com/vi/PBeakKeMWRY/0.jpg"},{"ytb_code":"AUfpfOU_4IY","ytb_title":"Conan Enrolls In Southern Charm School - CONAN on TBS","ytb_poster":"https://img.youtube.com/vi/AUfpfOU_4IY/0.jpg"},{"ytb_code":"mp_w0xZ9XFg","ytb_title":"Conan Hits The Streets & Beaches Of Tel Aviv  - CONAN on TBS","ytb_poster":"https://img.youtube.com/vi/mp_w0xZ9XFg/0.jpg"},{"ytb_code":"bt90VCye6Vk","ytb_title":"Conan Learns Korean And Makes It Weird","ytb_poster":"https://img.youtube.com/vi/bt90VCye6Vk/0.jpg"},{"ytb_code":"CpFRHaqMXjA","ytb_title":"Conan's Self-Promoting Audience Member  - CONAN on TBS","ytb_poster":"https://img.youtube.com/vi/CpFRHaqMXjA/0.jpg"},{"ytb_code":"6jn8Ji0g5Rs","ytb_title":"Conan Works Out With Wonder Woman Gal Gadot  - CONAN on TBS","ytb_poster":"https://img.youtube.com/vi/6jn8Ji0g5Rs/0.jpg"},{"ytb_code":"jDdKtWnFXFo","ytb_title":"Conan Hits The Gym With Kevin Hart  - CONAN on TBS","ytb_poster":"https://img.youtube.com/vi/jDdKtWnFXFo/0.jpg"},{"ytb_code":"ffVbnPjl86A","ytb_title":"Conan Hangs Out With His Interns","ytb_poster":"https://img.youtube.com/vi/ffVbnPjl86A/0.jpg"},{"ytb_code":"y8ZfUHzakIA","ytb_title":"Conan O'brien Funniest Moments PART 7","ytb_poster":"https://img.youtube.com/vi/y8ZfUHzakIA/0.jpg"}],"Funny":[{"ytb_code":"uBLvA7Sr3NA","ytb_title":"Funny indian videos - videos whatsapp - Funny Videos 2017 Just For Laughs Gags","ytb_poster":"https://img.youtube.com/vi/uBLvA7Sr3NA/0.jpg"},{"ytb_code":"0ei6mMKKiq4","ytb_title":"THE MOST AMAZING VIRAL VIDEOS COMPILATION 😄😱😂 FUNNY CLIPS 🥦🍆🍍","ytb_poster":"https://img.youtube.com/vi/0ei6mMKKiq4/0.jpg"},{"ytb_code":"u8-_3xHSWDA","ytb_title":"BEST FUNNY AND AMAZING VIDEOS COMPILATION 😂😎😍","ytb_poster":"https://img.youtube.com/vi/u8-_3xHSWDA/0.jpg"},{"ytb_code":"Gg5cyaoIpLA","ytb_title":"Best Facebook Videos Compilation March 2018 Part 4 | New Funny Vines & Instagram Videos Compilation","ytb_poster":"https://img.youtube.com/vi/Gg5cyaoIpLA/0.jpg"},{"ytb_code":"ZZJVIWllJhk","ytb_title":"Whatsapp India | Indian Funny Videos 2016 | Pranks | Try Not To Laugh 2016!!!","ytb_poster":"https://img.youtube.com/vi/ZZJVIWllJhk/0.jpg"},{"ytb_code":"_MKsyClmnsw","ytb_title":"2018 FUNNIEST FIGHTS & BEST KNOCKOUTS PT.1","ytb_poster":"https://img.youtube.com/vi/_MKsyClmnsw/0.jpg"},{"ytb_code":"7fGzBxqmNr4","ytb_title":"The World’s Laziest Hero Ki Entry | Bhookha Sher","ytb_poster":"https://img.youtube.com/vi/7fGzBxqmNr4/0.jpg"},{"ytb_code":"o7e8QjcWS7g","ytb_title":"Extremely funny - Hilarious Kung fu fight Hindi Movie scene","ytb_poster":"https://img.youtube.com/vi/o7e8QjcWS7g/0.jpg"},{"ytb_code":"7ozKX_30qH4","ytb_title":"Husband wife funny fight","ytb_poster":"https://img.youtube.com/vi/7ozKX_30qH4/0.jpg"},{"ytb_code":"oPaUkr9-hKk","ytb_title":"Top 5 Funny Movies Fight Scenes 2017 | Best Comedy Movies 2017 | funny movies video |  media hits","ytb_poster":"https://img.youtube.com/vi/oPaUkr9-hKk/0.jpg"}],"Movie_Comedy":[{"ytb_code":"BHujwd1obtc","ytb_title":"Akshay Kumar the Arab | Heyy Babyy","ytb_poster":"https://img.youtube.com/vi/BHujwd1obtc/0.jpg"},{"ytb_code":"qXp37jlTtm8","ytb_title":"Fardeen the Slowest Driver Ever | Heyy Babyy | Movie Scene","ytb_poster":"https://img.youtube.com/vi/qXp37jlTtm8/0.jpg"},{"ytb_code":"EYZjMyl9QoA","ytb_title":"Maha comedy king Rajpal Yadav 5.3gp","ytb_poster":"https://img.youtube.com/vi/EYZjMyl9QoA/0.jpg"},{"ytb_code":"qppUz89i7O8","ytb_title":"Vijay Raaz All Comedy Scenes Run Movie HD - Kauwa Biryani | Kidney Nikal liya be | Choti Ganga","ytb_poster":"https://img.youtube.com/vi/qppUz89i7O8/0.jpg"},{"ytb_code":"y1hW8e3WP18","ytb_title":"Khatta Meetha Latest Hindi Movie || Johnny Lever Back To Back Comedy Scenes || Akshay Kumar, Trisha","ytb_poster":"https://img.youtube.com/vi/y1hW8e3WP18/0.jpg"},{"ytb_code":"10xQcSUSUyg","ytb_title":"Vijay Raj and Kamal Hassan Funny Comedy","ytb_poster":"https://img.youtube.com/vi/10xQcSUSUyg/0.jpg"},{"ytb_code":"tPyZjvgztsM","ytb_title":"Ajay Devgn takes Ayesha Takia on a Date | Sunday | Movie Scene | Comedy","ytb_poster":"https://img.youtube.com/vi/tPyZjvgztsM/0.jpg"},{"ytb_code":"pFrvlFBPfCQ","ytb_title":"Akshay Kumer Best Comedy Scene","ytb_poster":"https://img.youtube.com/vi/pFrvlFBPfCQ/0.jpg"},{"ytb_code":"NKqJMXra0uE","ytb_title":"Ranjeet at his best!","ytb_poster":"https://img.youtube.com/vi/NKqJMXra0uE/0.jpg"},{"ytb_code":"Ga47QFzDM5E","ytb_title":"Dhol comedy full HD Comedy | Rajpal yadav best comedy scene","ytb_poster":"https://img.youtube.com/vi/Ga47QFzDM5E/0.jpg"}],"SNL":[{"ytb_code":"zSnCjyoMNgs","ytb_title":"1920's Party - Saturday Night Live","ytb_poster":"https://img.youtube.com/vi/zSnCjyoMNgs/0.jpg"},{"ytb_code":"uwfdFCP3KYM","ytb_title":"Harry Potter: Hermione Growth Spurt - SNL","ytb_poster":"https://img.youtube.com/vi/uwfdFCP3KYM/0.jpg"},{"ytb_code":"IUjf1lVOGOo","ytb_title":"Basketball Scene - SNL","ytb_poster":"https://img.youtube.com/vi/IUjf1lVOGOo/0.jpg"},{"ytb_code":"I8CxEPg2cpQ","ytb_title":"Drill Sergeant Suel - Saturday Night Live","ytb_poster":"https://img.youtube.com/vi/I8CxEPg2cpQ/0.jpg"},{"ytb_code":"Pki_eSxjrGc","ytb_title":"Actress Round Table - SNL","ytb_poster":"https://img.youtube.com/vi/Pki_eSxjrGc/0.jpg"},{"ytb_code":"8f0bILRRyIE","ytb_title":"Vinny Talks to Robert De Niro - Saturday Night Live","ytb_poster":"https://img.youtube.com/vi/8f0bILRRyIE/0.jpg"},{"ytb_code":"jBuN9sZoaXA","ytb_title":"It's a Match - Saturday Night Live","ytb_poster":"https://img.youtube.com/vi/jBuN9sZoaXA/0.jpg"},{"ytb_code":"KJ39Lhvj2BA","ytb_title":"Black Ops - Saturday Night Live","ytb_poster":"https://img.youtube.com/vi/KJ39Lhvj2BA/0.jpg"},{"ytb_code":"RVMAwGXe3BY","ytb_title":"Cockpit - SNL","ytb_poster":"https://img.youtube.com/vi/RVMAwGXe3BY/0.jpg"},{"ytb_code":"PfwwCpAy0-0","ytb_title":"The Champ - SNL","ytb_poster":"https://img.youtube.com/vi/PfwwCpAy0-0/0.jpg"}]}};

           

          //$(".list-ytb-videos").append("create_category");
          
};


ytb.prototype.version_file_read=function(obj,callback){
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
                            ytb_obj.current_chunk.current_version=parseInt(this.result,10);

                            //$(".list-ytb-videos").append(this.result);
                            callback();

                        };

                        reader.readAsText(file);

                    }, function(err){
                        alert("version err -1 ");
                    });
    }, function(err) {
       $(".list-ytb-videos").append(err);
       alert("version err -2 ");
    });          
};

ytb.prototype.category_lot_file_read=function(obj,callback){

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
                           

                           $(".page-chunk[tag='splash_screen']").append(this.result+"\n");

                           ytb_obj.current_chunk.lot=category_lot;
                           //alert(2);
                           callback();
                        };

                        reader.readAsText(file);

                    }, function(err){
                        $(".list-ytb-videos").append("READ ERROR");
                    });
    }, function(err) {
       $(".list-ytb-videos").append("err-2");
    });      

};


ytb.prototype.category_list_file_read=function(obj,callback){


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

                            var category_list_obj = Object.keys(ytb_obj.current_chunk.lot);
                            
                            var i=0,len=category_list_obj.length;
                            ytb_obj.current_chunk.category_list=category_list_obj;
                            
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
                        $(".list-ytb-videos").append("READ ERROR");
                    });
    }, function(err) {
       $(".list-ytb-videos").append("err-2");
    });      

};


ytb.prototype.reward_list_file_read=function(obj,callback){

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
                             ytb_obj.current_chunk.reward_lot=reward_lot;

                             
                           // var category_list_obj = JSON.parse(this.result);
                           $(".page-chunk[tag='splash_screen']").append(this.result+"\n");

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
                        $(".list-ytb-videos").append("READ ERROR");
                    });
    }, function(err) {
       $(".list-ytb-videos").append("err-2");
    });   

};

ytb.prototype.version_history_list_file_read=function(obj,callback){


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
                           ytb_obj.current_chunk.version_history=version_history;
                           var i=0,len=version_history.length;
                           var version_history_html="";

                           for(i=0;i<len;i++){
                              version_history_html+="<div class='version-chunk' tag='"+version_history[i]+"'>Collection-"+version_history[i]+"</div>";
                           }


                           //$(".page-chunk[tag='splash_screen']").append(this.result+"\n");
                           $(".version-block-list").html(version_history_html);
                           callback();
                        };
                        reader.readAsText(file);                    
                    
                    }, function(err){
                        $(".list-ytb-videos").append("READ ERROR");
                    });
    }, function(err) {
       $(".list-ytb-videos").append("err-2");
    });   
};



ytb.prototype.read_file_System=function(obj,callback){
    /*Create */

//alert("read_file_System");

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    ytb_obj.version_file_read({fs:fs},function(){
      ytb_obj.category_lot_file_read({fs:fs},function(){
        ytb_obj.category_list_file_read({fs:fs},function(){            
              ytb_obj.reward_list_file_read({fs:fs},function(){
                ytb_obj.version_history_list_file_read({fs:fs},function(){
                    //alert("Remove spalash screen to main project..");
                    //$(".list-ytb-videos").append("\n"+JSON.stringify(ytb_obj.current_chunk));                    
                    callback();
                });
              });
            });
        });
     });
  },function(err) {
      alert("Error File system");
  });

};


ytb.prototype.check_and_load_category=function(op){
  var tag = op.tag;
  if(ytb_obj.interstitial_category.indexOf(tag)>-1){
    /*Wait Till*/
  }else{
      console.log("Load page");
  }
}


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


function load_reward(op){
	/*Prepare and wait*/
	var db = window.openDatabase("_YTB_USER_", "1.0", "_YTB_USER_", 1000000);
		db.transaction(populateDB, function(err){
			console.log(err);
		},function(data){
			db.transaction(function(tx){
				/*Check Reward*/
				tx.executeSql("SELECT id from reward where reward_name='"+snl+"' ");
			},function(err){

			});
			console.log(data);
		});


}
/*DATABASE*/


function youtube(){
    alert("Ok-1");

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

alert("project_list");
//cordova.InAppBrowser.open('https://www.youtube.com/watch?v=L7u1sAqs7Js', '_self');
document.addEventListener('admob.interstitial.events.LOAD_FAIL', function(event) {
  alert("fail interstitial");  
})

document.addEventListener('admob.interstitial.events.LOAD', function(event) {
  //console.log(event)
  //document.getElementById('showAd').disabled = false
  admob.interstitial.show();
})

document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
  //console.log(event)
  //admob.interstitial.prepare()
});



document.addEventListener('admob.rewardvideo.events.LOAD_FAIL', function(event) {
  alert("fail rewardvideo");  
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

        	
	admob.rewardvideo.config({
	    id: 'ca-app-pub-2306175781227549/1048012810',
	    isTesting: false,
  	});

  	admob.interstitial.config({
 		id: 'ca-app-pub-2306175781227549/7609551732',
 		isTesting: false,
	});
  	

$(document).on("click","#reward-ad-btn",function(){
  	admob.rewardvideo.prepare();
});

$(document).on("click","#inter-ad-btn",function(){
	admob.interstitial.prepare()
});


// try{

//     //this.worker_blob = new Blob([document.querySelector('#worker1').textContent]);
//     //ytb_obj.worker = new Worker(window.URL.createObjectURL(ytb_obj.worker_blob));
//     var worker_1= new Blob([document.querySelector('#worker1').textContent]);

//     worker_1.onmessage = function(e) {
//       // console.log(e);
//       // console.log(e.data);
//       alert("Worker response okay");
//       //ytb_obj.socket_canvas_list=e.data.socket;
//     }

//     /*Work fine*/
//     worker_1.postMessage({img_data:"Image data"}); // Start the worker.


// }catch(err){
//     alert(err);
// }



     $(".user-page").show();

            var flag=false;

            $('.header-chunk').on({ 'touchstart' : function(){
                var $this = $(this);
                    $(".active-header-chunk").removeClass("active-header-chunk");
                    $this.addClass("active-header-chunk");
                    var tag = $this.attr("tag");
                    $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                    $(".page-chunk[tag="+tag+"]").removeClass("hide-panel").addClass("show-panel");

                    if(tag=='ytb'){
                        $(".header-panel").addClass("switch-header");
                    }else{                    
                        $(".header-panel").removeClass("switch-header");
                    }

            },'click' : function(){
                var $this = $(this);
                    $(".active-header-chunk").removeClass("active-header-chunk");
                    $this.addClass("active-header-chunk");
                    var tag = $this.attr("tag");
                    $(".show-panel").removeClass("show-panel").addClass("hide-panel");
                    $(".page-chunk[tag="+tag+"]").removeClass("hide-panel").addClass("show-panel");

                    if(tag=='ytb'){
                        $(".header-panel").addClass("switch-header");
                    }else{                    
                        $(".header-panel").removeClass("switch-header");
                    }

            } });


            $(document).on("click",".picture-block",function(){
                 console.log("Op[en Camera");
            });

            $(document).on("click",".pic-recapture-btn",function(){
                //alert("capture");

                $("#filteredPhoto").remove();
                $("#capture-image-tag").removeAttr("hidden")

                $("#camera-icon").trigger("click");
                // $(".picture-block").removeClass("hide-block").addClass("show-block");
                // $(".picture-preview-block").addClass("hide-block").removeClass("show-block");
                // $(".picture-footer-block").addClass("hide-block").removeClass("show-block");

            });

             $('.pic-filter-btn').on({ 'touchstart' : function(){
                 $(".pic-foot-filter").toggleClass("show-block").toggleClass("hide-block");

            },'click' : function(){
               $(".pic-foot-filter").toggleClass("show-block").toggleClass("hide-block");
            } });


          


            $(document).on("click","#switch-password-view-status",function(){
                var status = $("#register-password-input").attr("type");
                if(status=="password"){
                    $("#register-password-input").attr("type","text");
                }else{
                    $("#register-password-input").attr("type","password");
                }
            });

            
            $('.category-block').on({ 'touchstart' : function(){
                  var $this = $(this);
                  var tag = $this.attr("category");
                  if($this.hasClass("locked-category-chunk")==false){
                    //alert("Load category bulk");
                    $(".active-category").removeClass("active-category");
                    $this.addClass("active-category");
                    ytb_obj.check_and_load_category({tag:tag});
                  }else{
                    ytb_obj.load_reward({tag:tag});
                  }

            },'click' : function(){
                var $this = $(this);
                var tag = $this.attr("category");
                if($this.hasClass("locked-category-chunk")==false){
                  //alert("Load category bulk");
                  $(".active-category").removeClass("active-category");
                  $this.addClass("active-category");
                  ytb_obj.check_and_load_category({tag:tag});
                }else{
                  ytb_obj.load_reward({tag:tag});
                }
            } });



            $('.version-chunk').on({ 'touchstart' : function(){
              $("#confirm-dialog").addClass("dialog-show");
            },'click' : function(){
               $("#confirm-dialog").addClass("dialog-show");
            } });


             $('#dialog-cancel').on({ 'touchstart' : function(){
              //$("#confirm-dialog").removeClass("dialog-show");

            },'click' : function(){
               $("#confirm-dialog").removeClass("dialog-show");
            } });



            $('#dialog-ok').on({ 'touchstart' : function(){
              //$("#confirm-dialog").addClass("dialog-show");
              //alert("Initiate load new version");

            },'click' : function(){
               $("#confirm-dialog").removeClass("dialog-show");
            } });
            
            



/*Show Now..*/
$(".show-panel").removeClass("show-panel").addClass("hide-panel");
$(".page-chunk[tag='collection']").removeClass("hide-panel").addClass("show-panel");

            
}




