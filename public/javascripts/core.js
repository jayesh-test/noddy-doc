/*jswalker_system  Version:1.0.0  */
/*jswalker*/
function jswalker() {
    this.booster_socket = "";
    this.wire_ajax = "";
};
var jswalker_obj = new jswalker();


jswalker.prototype.wire_response = function(wire_op) {
    var wire_ajax = wire_op.wire_ajax;
    var callback = wire_op.callback;
    //console.log(JSON.parse(wire_ajax.responseText));
    callback(JSON.parse(wire_ajax.responseText));
}

jswalker.prototype.wire = function(wire_op) {
    var url = wire_op.url;
    var type = wire_op.type;
    var ziel = wire_op.ziel;
    var wire_ajax;
    var jw_success = wire_op.success;
    var jw_failure = wire_op.fail;

    for (var key in ziel) {
        if (ziel.hasOwnProperty(key)) {
            if (typeof(ziel[key]) == "object") {
                ziel[key] = JSON.stringify(ziel[key]);
            }
        }
    }

    if (typeof XMLHttpRequest !== 'undefined') {
        wire_ajax = new XMLHttpRequest();
    } else {
        var i = 0,
            versions = ["MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"],
            len = versions.length;
        for (i = 0; i < len; i++) {
            try {
                wire_ajax = new ActiveXObject(versions[i]);
                break;
            } catch (e) {}
        }
    }

    wire_ajax.onreadystatechange = function() {
        if (wire_ajax.readyState < 4) {
            return;
        }

        if (wire_ajax.status !== 200) {
            return jw_fail(JSON.parse(wire_ajax.responseText));
        }

        // all is well  
        if (wire_ajax.readyState === 4) {
            //jswalker_obj.wire_response({wire_ajax:wire_ajax,callback:jw_success});

            var json_data = JSON.parse(wire_ajax.responseText);
            //console.log(json_data);                   


            if (json_data.status.flag == "success") {
                return jw_success(json_data);
            } else {
                return jw_failure(json_data);
            }


            //callback(xhr);
            //console.log(wire_ajax.responseText);                
        }
    }


    wire_ajax.open('POST', url, true);
    wire_ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    wire_ajax.setRequestHeader("Content-type", "application/json");


    var data = JSON.stringify(ziel);
    wire_ajax.send(data);

};


jswalker.prototype.booster = function(booster_op, callback) {

    if (io) {

        if (booster_op.active == true) {
            var url=booster_op.url;
            var jsw_controller = booster_op.controller;

            if (location.protocol == "https:") {
                if(url){
                    var connect_url = url;
                }else{
                    var connect_url = "https:" + "//" + location.hostname + ":8443";
                }
                jswalker_obj.booster_socket = io.connect(connect_url, {
                    secure:true,
                    reconnect: true
                });

           
                jswalker_obj.booster_socket.on("connect_error", function(e) {
                    console.log(e);
                    jswalker_obj.booster_socket.disconnect();
                    console.log("Socket used but not set on server side------");
                });

            } else {
                if(url){
                    var connect_url = url;
                }else{
                    var connect_url = "https:" + "//" + location.hostname + ":8080";
                }
                jswalker_obj.booster_socket = io.connect(connect_url, {
                    reconnect: false
                });

             

                jswalker_obj.booster_socket.on("connect_error", function() {
                    jswalker_obj.booster_socket.disconnect();
                    console.log("Socket used but not set on server side");
                });

            }

            jswalker_obj.booster_socket.on("SOCKET_MODEL_ERROR", function(socket_model_error_op) {
                console.log(socket_model_error_op);
            });

            jswalker_obj.booster_socket.on("SOCKET_QUERY_ERROR", function(socket_query_error_op) {
                if (socket_query_error_op.console_trace.flag == true) {
                    console.log(socket_query_error_op);
                }
            });



            jswalker_obj.booster_socket.on("message", function(booster_success_op, notifier) {


                if (booster_success_op.console_trace.flag == true) {
                    //console.log(booster_success_op);
                }

                if (jswalker_obj[booster_success_op.proto]) {
                    jswalker_obj[booster_success_op.proto]({
                        ziel: booster_success_op.ziel
                    }, function(booseter_sock_op) {
                        if (notifier) {
                            notifier(booseter_sock_op);

                        }
                    });
                } else {
                    console.log("No prototype found with name ");
                    if (booster_success_op.console_trace.flag == true) {
                        console.log(booster_success_op);
                    }
                }
            });
            callback({
                jswalker: jswalker,
                socket: jswalker_obj.booster_socket
            });
            //},1000);
        } else {


            var jsw_success = booster_op.success;
            var jsw_failure = booster_op.fail;
            var jsw_interrupt = booster_op.interrupt;
            var jsw_warning = booster_op.warning;

            //var socket_request_time=Date.now();

            jswalker_obj.booster_socket.send({
                model: booster_op.model,
                method: booster_op.method,
                ziel: booster_op.ziel
            }, function(booster_res_op) {
                /* check syntax */
                //socket_request_time=Date.now()-socket_request_time;
                //console.log(socket_request_time+ " milliseconds : Socket");                   

                if (booster_res_op.console_trace.flag == true) {

                    //console.log(booster_res_op);
                }

                if (booster_res_op.status.flag == "success") {
                    if (jsw_success) {

                        jsw_success(booster_res_op);
                    }
                } else if (booster_res_op.status.flag == "warn") {
                    if (jsw_warning) {
                        jsw_warning(booster_res_op);
                    }
                } else if (booster_res_op.status.flag == "fail") {

                    if (jsw_failure) {
                        jsw_failure(booster_res_op);
                    }
                } else if (booster_res_op.status.flag == "interrupt") {
                    console.log(booster_res_op);
                    if (jsw_interrupt) {

                        jsw_interrupt(booster_res_op);
                    }
                }

            });
        }
    } else {
        console.log("Include appropriate socket-io.js file according to socket.io version.");
    }
};



function dot_function() {
    this.chunk = [];
    this.worker_block = [];
}
var dot_obj = new dot_function();
/*doT.js*/



/*Additional code*/


/*Socket.js*/
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.io=t()}}(function(){var t;return function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(i)return i(s,!0);var p=new Error("Cannot find module '"+s+"'");throw p.code="MODULE_NOT_FOUND",p}var u=n[s]={exports:{}};t[s][0].call(u.exports,function(e){var n=t[s][1][e];return o(n?n:e)},u,u.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(t,e,n){e.exports=t("./lib/")},{"./lib/":2}],2:[function(t,e,n){e.exports=t("./socket"),e.exports.parser=t("engine.io-parser")},{"./socket":3,"engine.io-parser":19}],3:[function(t,e,n){(function(n){function r(t,e){if(!(this instanceof r))return new r(t,e);e=e||{},t&&"object"==typeof t&&(e=t,t=null),t?(t=u(t),e.hostname=t.host,e.secure="https"==t.protocol||"wss"==t.protocol,e.port=t.port,t.query&&(e.query=t.query)):e.host&&(e.hostname=u(e.host).host),this.secure=null!=e.secure?e.secure:n.location&&"https:"==location.protocol,e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.agent=e.agent||!1,this.hostname=e.hostname||(n.location?location.hostname:"localhost"),this.port=e.port||(n.location&&location.port?location.port:this.secure?443:80),this.query=e.query||{},"string"==typeof this.query&&(this.query=h.decode(this.query)),this.upgrade=!1!==e.upgrade,this.path=(e.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!e.forceJSONP,this.jsonp=!1!==e.jsonp,this.forceBase64=!!e.forceBase64,this.enablesXDR=!!e.enablesXDR,this.timestampParam=e.timestampParam||"t",this.timestampRequests=e.timestampRequests,this.transports=e.transports||["polling","websocket"],this.readyState="",this.writeBuffer=[],this.policyPort=e.policyPort||843,this.rememberUpgrade=e.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=e.onlyBinaryUpgrades,this.perMessageDeflate=!1!==e.perMessageDeflate?e.perMessageDeflate||{}:!1,!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=e.pfx||null,this.key=e.key||null,this.passphrase=e.passphrase||null,this.cert=e.cert||null,this.ca=e.ca||null,this.ciphers=e.ciphers||null,this.rejectUnauthorized=void 0===e.rejectUnauthorized?!0:e.rejectUnauthorized;var o="object"==typeof n&&n;o.global===o&&e.extraHeaders&&Object.keys(e.extraHeaders).length>0&&(this.extraHeaders=e.extraHeaders),this.open()}function o(t){var e={};for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}var i=t("./transports"),s=t("component-emitter"),a=t("debug")("engine.io-client:socket"),c=t("indexof"),p=t("engine.io-parser"),u=t("parseuri"),f=t("parsejson"),h=t("parseqs");e.exports=r,r.priorWebsocketSuccess=!1,s(r.prototype),r.protocol=p.protocol,r.Socket=r,r.Transport=t("./transport"),r.transports=t("./transports"),r.parser=t("engine.io-parser"),r.prototype.createTransport=function(t){a('creating transport "%s"',t);var e=o(this.query);e.EIO=p.protocol,e.transport=t,this.id&&(e.sid=this.id);var n=new i[t]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:e,forceJSONP:this.forceJSONP,jsonp:this.jsonp,forceBase64:this.forceBase64,enablesXDR:this.enablesXDR,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this,pfx:this.pfx,key:this.key,passphrase:this.passphrase,cert:this.cert,ca:this.ca,ciphers:this.ciphers,rejectUnauthorized:this.rejectUnauthorized,perMessageDeflate:this.perMessageDeflate,extraHeaders:this.extraHeaders});return n},r.prototype.open=function(){var t;if(this.rememberUpgrade&&r.priorWebsocketSuccess&&-1!=this.transports.indexOf("websocket"))t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available")},0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(n){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},r.prototype.setTransport=function(t){a("setting transport %s",t.name);var e=this;this.transport&&(a("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},r.prototype.probe=function(t){function e(){if(h.onlyBinaryUpgrades){var e=!this.supportsBinary&&h.transport.supportsBinary;f=f||e}f||(a('probe transport "%s" opened',t),u.send([{type:"ping",data:"probe"}]),u.once("packet",function(e){if(!f)if("pong"==e.type&&"probe"==e.data){if(a('probe transport "%s" pong',t),h.upgrading=!0,h.emit("upgrading",u),!u)return;r.priorWebsocketSuccess="websocket"==u.name,a('pausing current transport "%s"',h.transport.name),h.transport.pause(function(){f||"closed"!=h.readyState&&(a("changing transport and sending upgrade packet"),p(),h.setTransport(u),u.send([{type:"upgrade"}]),h.emit("upgrade",u),u=null,h.upgrading=!1,h.flush())})}else{a('probe transport "%s" failed',t);var n=new Error("probe error");n.transport=u.name,h.emit("upgradeError",n)}}))}function n(){f||(f=!0,p(),u.close(),u=null)}function o(e){var r=new Error("probe error: "+e);r.transport=u.name,n(),a('probe transport "%s" failed because of error: %s',t,e),h.emit("upgradeError",r)}function i(){o("transport closed")}function s(){o("socket closed")}function c(t){u&&t.name!=u.name&&(a('"%s" works - aborting "%s"',t.name,u.name),n())}function p(){u.removeListener("open",e),u.removeListener("error",o),u.removeListener("close",i),h.removeListener("close",s),h.removeListener("upgrading",c)}a('probing transport "%s"',t);var u=this.createTransport(t,{probe:1}),f=!1,h=this;r.priorWebsocketSuccess=!1,u.once("open",e),u.once("error",o),u.once("close",i),this.once("close",s),this.once("upgrading",c),u.open()},r.prototype.onOpen=function(){if(a("socket open"),this.readyState="open",r.priorWebsocketSuccess="websocket"==this.transport.name,this.emit("open"),this.flush(),"open"==this.readyState&&this.upgrade&&this.transport.pause){a("starting upgrade probes");for(var t=0,e=this.upgrades.length;e>t;t++)this.probe(this.upgrades[t])}},r.prototype.onPacket=function(t){if("opening"==this.readyState||"open"==this.readyState)switch(a('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(f(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}else a('packet received with socket readyState "%s"',this.readyState)},r.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!=this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},r.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!=e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},r.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){a("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},r.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping")})},r.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},r.prototype.flush=function(){"closed"!=this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(a("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},r.prototype.write=r.prototype.send=function(t,e,n){return this.sendPacket("message",t,e,n),this},r.prototype.sendPacket=function(t,e,n,r){if("function"==typeof e&&(r=e,e=void 0),"function"==typeof n&&(r=n,n=null),"closing"!=this.readyState&&"closed"!=this.readyState){n=n||{},n.compress=!1!==n.compress;var o={type:t,data:e,options:n};this.emit("packetCreate",o),this.writeBuffer.push(o),r&&this.once("flush",r),this.flush()}},r.prototype.close=function(){function t(){r.onClose("forced close"),a("socket closing - telling transport to close"),r.transport.close()}function e(){r.removeListener("upgrade",e),r.removeListener("upgradeError",e),t()}function n(){r.once("upgrade",e),r.once("upgradeError",e)}if("opening"==this.readyState||"open"==this.readyState){this.readyState="closing";var r=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?n():t()}):this.upgrading?n():t()}return this},r.prototype.onError=function(t){a("socket error %j",t),r.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},r.prototype.onClose=function(t,e){if("opening"==this.readyState||"open"==this.readyState||"closing"==this.readyState){a('socket close with reason: "%s"',t);var n=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),n.writeBuffer=[],n.prevBufferLen=0}},r.prototype.filterUpgrades=function(t){for(var e=[],n=0,r=t.length;r>n;n++)~c(this.transports,t[n])&&e.push(t[n]);return e}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{"./transport":4,"./transports":5,"component-emitter":15,debug:17,"engine.io-parser":19,indexof:23,parsejson:26,parseqs:27,parseuri:28}],4:[function(t,e,n){function r(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders}var o=t("engine.io-parser"),i=t("component-emitter");e.exports=r,i(r.prototype),r.prototype.onError=function(t,e){var n=new Error(t);return n.type="TransportError",n.description=e,this.emit("error",n),this},r.prototype.open=function(){return("closed"==this.readyState||""==this.readyState)&&(this.readyState="opening",this.doOpen()),this},r.prototype.close=function(){return("opening"==this.readyState||"open"==this.readyState)&&(this.doClose(),this.onClose()),this},r.prototype.send=function(t){if("open"!=this.readyState)throw new Error("Transport not open");this.write(t)},r.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},r.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e)},r.prototype.onPacket=function(t){this.emit("packet",t)},r.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},{"component-emitter":15,"engine.io-parser":19}],5:[function(t,e,n){(function(e){function r(t){var n,r=!1,a=!1,c=!1!==t.jsonp;if(e.location){var p="https:"==location.protocol,u=location.port;u||(u=p?443:80),r=t.hostname!=location.hostname||u!=t.port,a=t.secure!=p}if(t.xdomain=r,t.xscheme=a,n=new o(t),"open"in n&&!t.forceJSONP)return new i(t);if(!c)throw new Error("JSONP disabled");return new s(t)}var o=t("xmlhttprequest-ssl"),i=t("./polling-xhr"),s=t("./polling-jsonp"),a=t("./websocket");n.polling=r,n.websocket=a}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{"./polling-jsonp":6,"./polling-xhr":7,"./websocket":9,"xmlhttprequest-ssl":10}],6:[function(t,e,n){(function(n){function r(){}function o(t){i.call(this,t),this.query=this.query||{},a||(n.___eio||(n.___eio=[]),a=n.___eio),this.index=a.length;var e=this;a.push(function(t){e.onData(t)}),this.query.j=this.index,n.document&&n.addEventListener&&n.addEventListener("beforeunload",function(){e.script&&(e.script.onerror=r)},!1)}var i=t("./polling"),s=t("component-inherit");e.exports=o;var a,c=/\n/g,p=/\\n/g;s(o,i),o.prototype.supportsBinary=!1,o.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),i.prototype.doClose.call(this)},o.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var n=document.getElementsByTagName("script")[0];n?n.parentNode.insertBefore(e,n):(document.head||document.body).appendChild(e),this.script=e;var r="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);r&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},o.prototype.doWrite=function(t,e){function n(){r(),e()}function r(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var e='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(e)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),u=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=u,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),r(),t=t.replace(p,"\\\n"),this.area.value=t.replace(c,"\\n");try{this.form.submit()}catch(f){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"==o.iframe.readyState&&n()}:this.iframe.onload=n}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{"./polling":8,"component-inherit":16}],7:[function(t,e,n){(function(n){function r(){}function o(t){if(c.call(this,t),n.location){var e="https:"==location.protocol,r=location.port;r||(r=e?443:80),this.xd=t.hostname!=n.location.hostname||r!=t.port,this.xs=t.secure!=e}else this.extraHeaders=t.extraHeaders}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!=t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=t("xmlhttprequest-ssl"),c=t("./polling"),p=t("component-emitter"),u=t("component-inherit"),f=t("debug")("engine.io-client:polling-xhr");e.exports=o,e.exports.Request=i,u(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var n="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:n}),o=this;r.on("success",e),r.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=r},o.prototype.doPoll=function(){f("xhr poll");var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},p(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var e=this.xhr=new a(t),r=this;try{f("xhr open %s: %s",this.method,this.uri),e.open(this.method,this.uri,this.async);try{if(this.extraHeaders){e.setDisableHeaderCheck(!0);for(var o in this.extraHeaders)this.extraHeaders.hasOwnProperty(o)&&e.setRequestHeader(o,this.extraHeaders[o])}}catch(s){}if(this.supportsBinary&&(e.responseType="arraybuffer"),"POST"==this.method)try{this.isBinary?e.setRequestHeader("Content-type","application/octet-stream"):e.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(s){}"withCredentials"in e&&(e.withCredentials=!0),this.hasXDR()?(e.onload=function(){r.onLoad()},e.onerror=function(){r.onError(e.responseText)}):e.onreadystatechange=function(){4==e.readyState&&(200==e.status||1223==e.status?r.onLoad():setTimeout(function(){r.onError(e.status)},0))},f("xhr data %s",this.data),e.send(this.data)}catch(s){return void setTimeout(function(){r.onError(s)},0)}n.document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=r:this.xhr.onreadystatechange=r,t)try{this.xhr.abort()}catch(e){}n.document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type").split(";")[0]}catch(n){}if("application/octet-stream"===e)t=this.xhr.response;else if(this.supportsBinary)try{t=String.fromCharCode.apply(null,new Uint8Array(this.xhr.response))}catch(n){for(var r=new Uint8Array(this.xhr.response),o=[],i=0,s=r.length;s>i;i++)o.push(r[i]);t=String.fromCharCode.apply(null,o)}else t=this.xhr.responseText}catch(n){this.onError(n)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof n.XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},n.document&&(i.requestsCount=0,i.requests={},n.attachEvent?n.attachEvent("onunload",s):n.addEventListener&&n.addEventListener("beforeunload",s,!1))}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{"./polling":8,"component-emitter":15,"component-inherit":16,debug:17,"xmlhttprequest-ssl":10}],8:[function(t,e,n){function r(t){var e=t&&t.forceBase64;(!u||e)&&(this.supportsBinary=!1),o.call(this,t)}var o=t("../transport"),i=t("parseqs"),s=t("engine.io-parser"),a=t("component-inherit"),c=t("yeast"),p=t("debug")("engine.io-client:polling");e.exports=r;var u=function(){var e=t("xmlhttprequest-ssl"),n=new e({xdomain:!1});return null!=n.responseType}();a(r,o),r.prototype.name="polling",r.prototype.doOpen=function(){this.poll()},r.prototype.pause=function(t){function e(){p("paused"),n.readyState="paused",t()}var n=this;if(this.readyState="pausing",this.polling||!this.writable){var r=0;this.polling&&(p("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){p("pre-pause polling complete"),--r||e()})),this.writable||(p("we are currently writing - waiting to pause"),r++,this.once("drain",function(){p("pre-pause writing complete"),--r||e()}))}else e()},r.prototype.poll=function(){p("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},r.prototype.onData=function(t){var e=this;p("polling got data %s",t);var n=function(t,n,r){return"opening"==e.readyState&&e.onOpen(),"close"==t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,n),"closed"!=this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"==this.readyState?this.poll():p('ignoring poll - transport state "%s"',this.readyState))},r.prototype.doClose=function(){function t(){p("writing close packet"),e.write([{type:"close"}])}var e=this;"open"==this.readyState?(p("transport open - closing"),t()):(p("transport not open - deferring close"),this.once("open",t))},r.prototype.write=function(t){var e=this;this.writable=!1;var n=function(){e.writable=!0,e.emit("drain")},e=this;s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,n)})},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",n="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"==e&&443!=this.port||"http"==e&&80!=this.port)&&(n=":"+this.port),t.length&&(t="?"+t);var r=-1!==this.hostname.indexOf(":");return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t}},{"../transport":4,"component-inherit":16,debug:17,"engine.io-parser":19,parseqs:27,"xmlhttprequest-ssl":10,yeast:30}],9:[function(t,e,n){(function(n){function r(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,o.call(this,t)}var o=t("../transport"),i=t("engine.io-parser"),s=t("parseqs"),a=t("component-inherit"),c=t("yeast"),p=t("debug")("engine.io-client:websocket"),u=n.WebSocket||n.MozWebSocket,f=u;if(!f&&"undefined"==typeof window)try{f=t("ws")}catch(h){}e.exports=r,a(r,o),r.prototype.name="websocket",r.prototype.supportsBinary=!0,r.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=void 0,n={agent:this.agent,perMessageDeflate:this.perMessageDeflate};n.pfx=this.pfx,n.key=this.key,n.passphrase=this.passphrase,n.cert=this.cert,n.ca=this.ca,n.ciphers=this.ciphers,n.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(n.headers=this.extraHeaders),this.ws=u?new f(t):new f(t,e,n),void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="buffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},r.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},"undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)&&(r.prototype.onData=function(t){var e=this;setTimeout(function(){o.prototype.onData.call(e,t)},0)}),r.prototype.write=function(t){function e(){r.emit("flush"),setTimeout(function(){r.writable=!0,r.emit("drain")},0)}var r=this;this.writable=!1;for(var o=t.length,s=0,a=o;a>s;s++)!function(t){i.encodePacket(t,r.supportsBinary,function(i){if(!u){var s={};if(t.options&&(s.compress=t.options.compress),r.perMessageDeflate){var a="string"==typeof i?n.Buffer.byteLength(i):i.length;a<r.perMessageDeflate.threshold&&(s.compress=!1)}}try{u?r.ws.send(i):r.ws.send(i,s)}catch(c){p("websocket closed before onclose event")}--o||e()})}(t[s])},r.prototype.onClose=function(){o.prototype.onClose.call(this)},r.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",n="";this.port&&("wss"==e&&443!=this.port||"ws"==e&&80!=this.port)&&(n=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||(t.b64=1),t=s.encode(t),t.length&&(t="?"+t);var r=-1!==this.hostname.indexOf(":");return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t},r.prototype.check=function(){return!(!f||"__initialize"in f&&this.name===r.prototype.name)}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{"../transport":4,"component-inherit":16,debug:17,"engine.io-parser":19,parseqs:27,ws:void 0,yeast:30}],10:[function(t,e,n){var r=t("has-cors");e.exports=function(t){var e=t.xdomain,n=t.xscheme,o=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!e||r))return new XMLHttpRequest}catch(i){}try{if("undefined"!=typeof XDomainRequest&&!n&&o)return new XDomainRequest}catch(i){}if(!e)try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(i){}}},{"has-cors":22}],11:[function(t,e,n){function r(t,e,n){function r(t,o){if(r.count<=0)throw new Error("after called too many times");--r.count,t?(i=!0,e(t),e=n):0!==r.count||i||e(null,o)}var i=!1;return n=n||o,r.count=t,0===t?e():r}function o(){}e.exports=r},{}],12:[function(t,e,n){e.exports=function(t,e,n){var r=t.byteLength;if(e=e||0,n=n||r,t.slice)return t.slice(e,n);if(0>e&&(e+=r),0>n&&(n+=r),n>r&&(n=r),e>=r||e>=n||0===r)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(n-e),s=e,a=0;n>s;s++,a++)i[a]=o[s];return i.buffer}},{}],13:[function(t,e,n){!function(t){"use strict";n.encode=function(e){var n,r=new Uint8Array(e),o=r.length,i="";for(n=0;o>n;n+=3)i+=t[r[n]>>2],i+=t[(3&r[n])<<4|r[n+1]>>4],i+=t[(15&r[n+1])<<2|r[n+2]>>6],i+=t[63&r[n+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},n.decode=function(e){var n,r,o,i,s,a=.75*e.length,c=e.length,p=0;"="===e[e.length-1]&&(a--,"="===e[e.length-2]&&a--);var u=new ArrayBuffer(a),f=new Uint8Array(u);for(n=0;c>n;n+=4)r=t.indexOf(e[n]),o=t.indexOf(e[n+1]),i=t.indexOf(e[n+2]),s=t.indexOf(e[n+3]),f[p++]=r<<2|o>>4,f[p++]=(15&o)<<4|i>>2,f[p++]=(3&i)<<6|63&s;return u}}("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")},{}],14:[function(t,e,n){(function(t){function n(t){for(var e=0;e<t.length;e++){var n=t[e];if(n.buffer instanceof ArrayBuffer){var r=n.buffer;if(n.byteLength!==r.byteLength){var o=new Uint8Array(n.byteLength);o.set(new Uint8Array(r,n.byteOffset,n.byteLength)),r=o.buffer}t[e]=r}}}function r(t,e){e=e||{};var r=new i;n(t);for(var o=0;o<t.length;o++)r.append(t[o]);return e.type?r.getBlob(e.type):r.getBlob()}function o(t,e){return n(t),new Blob(t,e||{})}var i=t.BlobBuilder||t.WebKitBlobBuilder||t.MSBlobBuilder||t.MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(e){return!1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(e){return!1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;e.exports=function(){return s?a?t.Blob:o:c?r:void 0}()}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{}],15:[function(t,e,n){function r(t){return t?o(t):void 0}function o(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}e.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks[t]=this._callbacks[t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){r.off(t,n),e.apply(this,arguments)}var r=this;return this._callbacks=this._callbacks||{},n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks[t];if(!n)return this;if(1==arguments.length)return delete this._callbacks[t],this;for(var r,o=0;o<n.length;o++)if(r=n[o],r===e||r.fn===e){n.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks[t];if(n){n=n.slice(0);for(var r=0,o=n.length;o>r;++r)n[r].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks[t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},{}],16:[function(t,e,n){e.exports=function(t,e){var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},{}],17:[function(t,e,n){function r(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}function o(){var t=arguments,e=this.useColors;if(t[0]=(e?"%c":"")+this.namespace+(e?" %c":" ")+t[0]+(e?"%c ":" ")+"+"+n.humanize(this.diff),!e)return t;var r="color: "+this.color;t=[t[0],r,"color: inherit"].concat(Array.prototype.slice.call(t,1));var o=0,i=0;return t[0].replace(/%[a-z%]/g,function(t){"%%"!==t&&(o++,"%c"===t&&(i=o))}),t.splice(i,0,r),t}function i(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function s(t){try{null==t?n.storage.removeItem("debug"):n.storage.debug=t}catch(e){}}function a(){var t;try{t=n.storage.debug}catch(e){}return t}function c(){try{return window.localStorage}catch(t){}}n=e.exports=t("./debug"),n.log=i,n.formatArgs=o,n.save=s,n.load=a,n.useColors=r,n.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:c(),n.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],n.formatters.j=function(t){return JSON.stringify(t)},n.enable(a())},{"./debug":18}],18:[function(t,e,n){function r(){return n.colors[u++%n.colors.length]}function o(t){function e(){}function o(){var t=o,e=+new Date,i=e-(p||e);t.diff=i,t.prev=p,t.curr=e,p=e,null==t.useColors&&(t.useColors=n.useColors()),null==t.color&&t.useColors&&(t.color=r());var s=Array.prototype.slice.call(arguments);s[0]=n.coerce(s[0]),"string"!=typeof s[0]&&(s=["%o"].concat(s));var a=0;s[0]=s[0].replace(/%([a-z%])/g,function(e,r){if("%%"===e)return e;a++;var o=n.formatters[r];if("function"==typeof o){var i=s[a];e=o.call(t,i),s.splice(a,1),a--}return e}),"function"==typeof n.formatArgs&&(s=n.formatArgs.apply(t,s));var c=o.log||n.log||console.log.bind(console);c.apply(t,s)}e.enabled=!1,o.enabled=!0;var i=n.enabled(t)?o:e;return i.namespace=t,i}function i(t){n.save(t);for(var e=(t||"").split(/[\s,]+/),r=e.length,o=0;r>o;o++)e[o]&&(t=e[o].replace(/\*/g,".*?"),"-"===t[0]?n.skips.push(new RegExp("^"+t.substr(1)+"$")):n.names.push(new RegExp("^"+t+"$")))}function s(){n.enable("")}function a(t){var e,r;for(e=0,r=n.skips.length;r>e;e++)if(n.skips[e].test(t))return!1;for(e=0,r=n.names.length;r>e;e++)if(n.names[e].test(t))return!0;return!1}function c(t){return t instanceof Error?t.stack||t.message:t}n=e.exports=o,n.coerce=c,n.disable=s,n.enable=i,n.enabled=a,n.humanize=t("ms"),n.names=[],n.skips=[],n.formatters={};var p,u=0},{ms:25}],19:[function(t,e,n){(function(e){function r(t,e){var r="b"+n.packets[t.type]+t.data.data;return e(r)}function o(t,e,r){if(!e)return n.encodeBase64Packet(t,r);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=m[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return r(s.buffer)}function i(t,e,r){if(!e)return n.encodeBase64Packet(t,r);var o=new FileReader;return o.onload=function(){t.data=o.result,n.encodePacket(t,e,!0,r)},o.readAsArrayBuffer(t.data)}function s(t,e,r){if(!e)return n.encodeBase64Packet(t,r);if(g)return i(t,e,r);var o=new Uint8Array(1);o[0]=m[t.type];var s=new w([o.buffer,t.data]);return r(s)}function a(t,e,n){for(var r=new Array(t.length),o=h(t.length,n),i=function(t,n,o){e(n,function(e,n){r[t]=n,o(e,r)})},s=0;s<t.length;s++)i(s,t[s],o)}var c=t("./keys"),p=t("has-binary"),u=t("arraybuffer.slice"),f=t("base64-arraybuffer"),h=t("after"),l=t("utf8"),d=navigator.userAgent.match(/Android/i),y=/PhantomJS/i.test(navigator.userAgent),g=d||y;n.protocol=3;var m=n.packets={open:0,close:1,
ping:2,pong:3,message:4,upgrade:5,noop:6},b=c(m),v={type:"error",data:"parser error"},w=t("blob");n.encodePacket=function(t,n,i,a){"function"==typeof n&&(a=n,n=!1),"function"==typeof i&&(a=i,i=null);var c=void 0===t.data?void 0:t.data.buffer||t.data;if(e.ArrayBuffer&&c instanceof ArrayBuffer)return o(t,n,a);if(w&&c instanceof e.Blob)return s(t,n,a);if(c&&c.base64)return r(t,a);var p=m[t.type];return void 0!==t.data&&(p+=i?l.encode(String(t.data)):String(t.data)),a(""+p)},n.encodeBase64Packet=function(t,r){var o="b"+n.packets[t.type];if(w&&t.data instanceof e.Blob){var i=new FileReader;return i.onload=function(){var t=i.result.split(",")[1];r(o+t)},i.readAsDataURL(t.data)}var s;try{s=String.fromCharCode.apply(null,new Uint8Array(t.data))}catch(a){for(var c=new Uint8Array(t.data),p=new Array(c.length),u=0;u<c.length;u++)p[u]=c[u];s=String.fromCharCode.apply(null,p)}return o+=e.btoa(s),r(o)},n.decodePacket=function(t,e,r){if("string"==typeof t||void 0===t){if("b"==t.charAt(0))return n.decodeBase64Packet(t.substr(1),e);if(r)try{t=l.decode(t)}catch(o){return v}var i=t.charAt(0);return Number(i)==i&&b[i]?t.length>1?{type:b[i],data:t.substring(1)}:{type:b[i]}:v}var s=new Uint8Array(t),i=s[0],a=u(t,1);return w&&"blob"===e&&(a=new w([a])),{type:b[i],data:a}},n.decodeBase64Packet=function(t,n){var r=b[t.charAt(0)];if(!e.ArrayBuffer)return{type:r,data:{base64:!0,data:t.substr(1)}};var o=f.decode(t.substr(1));return"blob"===n&&w&&(o=new w([o])),{type:r,data:o}},n.encodePayload=function(t,e,r){function o(t){return t.length+":"+t}function i(t,r){n.encodePacket(t,s?e:!1,!0,function(t){r(null,o(t))})}"function"==typeof e&&(r=e,e=null);var s=p(t);return e&&s?w&&!g?n.encodePayloadAsBlob(t,r):n.encodePayloadAsArrayBuffer(t,r):t.length?void a(t,i,function(t,e){return r(e.join(""))}):r("0:")},n.decodePayload=function(t,e,r){if("string"!=typeof t)return n.decodePayloadAsBinary(t,e,r);"function"==typeof e&&(r=e,e=null);var o;if(""==t)return r(v,0,1);for(var i,s,a="",c=0,p=t.length;p>c;c++){var u=t.charAt(c);if(":"!=u)a+=u;else{if(""==a||a!=(i=Number(a)))return r(v,0,1);if(s=t.substr(c+1,i),a!=s.length)return r(v,0,1);if(s.length){if(o=n.decodePacket(s,e,!0),v.type==o.type&&v.data==o.data)return r(v,0,1);var f=r(o,c+i,p);if(!1===f)return}c+=i,a=""}}return""!=a?r(v,0,1):void 0},n.encodePayloadAsArrayBuffer=function(t,e){function r(t,e){n.encodePacket(t,!0,!0,function(t){return e(null,t)})}return t.length?void a(t,r,function(t,n){var r=n.reduce(function(t,e){var n;return n="string"==typeof e?e.length:e.byteLength,t+n.toString().length+n+2},0),o=new Uint8Array(r),i=0;return n.forEach(function(t){var e="string"==typeof t,n=t;if(e){for(var r=new Uint8Array(t.length),s=0;s<t.length;s++)r[s]=t.charCodeAt(s);n=r.buffer}e?o[i++]=0:o[i++]=1;for(var a=n.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var r=new Uint8Array(n),s=0;s<r.length;s++)o[i++]=r[s]}),e(o.buffer)}):e(new ArrayBuffer(0))},n.encodePayloadAsBlob=function(t,e){function r(t,e){n.encodePacket(t,!0,!0,function(t){var n=new Uint8Array(1);if(n[0]=1,"string"==typeof t){for(var r=new Uint8Array(t.length),o=0;o<t.length;o++)r[o]=t.charCodeAt(o);t=r.buffer,n[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,w){var c=new w([n.buffer,a.buffer,t]);e(null,c)}})}a(t,r,function(t,n){return e(new w(n))})},n.decodePayloadAsBinary=function(t,e,r){"function"==typeof e&&(r=e,e=null);for(var o=t,i=[],s=!1;o.byteLength>0;){for(var a=new Uint8Array(o),c=0===a[0],p="",f=1;255!=a[f];f++){if(p.length>310){s=!0;break}p+=a[f]}if(s)return r(v,0,1);o=u(o,2+p.length),p=parseInt(p);var h=u(o,0,p);if(c)try{h=String.fromCharCode.apply(null,new Uint8Array(h))}catch(l){var d=new Uint8Array(h);h="";for(var f=0;f<d.length;f++)h+=String.fromCharCode(d[f])}i.push(h),o=u(o,p)}var y=i.length;i.forEach(function(t,o){r(n.decodePacket(t,e,!0),o,y)})}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{"./keys":20,after:11,"arraybuffer.slice":12,"base64-arraybuffer":13,blob:14,"has-binary":21,utf8:29}],20:[function(t,e,n){e.exports=Object.keys||function(t){var e=[],n=Object.prototype.hasOwnProperty;for(var r in t)n.call(t,r)&&e.push(r);return e}},{}],21:[function(t,e,n){(function(n){function r(t){function e(t){if(!t)return!1;if(n.Buffer&&n.Buffer.isBuffer(t)||n.ArrayBuffer&&t instanceof ArrayBuffer||n.Blob&&t instanceof Blob||n.File&&t instanceof File)return!0;if(o(t)){for(var r=0;r<t.length;r++)if(e(t[r]))return!0}else if(t&&"object"==typeof t){t.toJSON&&(t=t.toJSON());for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&e(t[i]))return!0}return!1}return e(t)}var o=t("isarray");e.exports=r}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{isarray:24}],22:[function(t,e,n){try{e.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(r){e.exports=!1}},{}],23:[function(t,e,n){var r=[].indexOf;e.exports=function(t,e){if(r)return t.indexOf(e);for(var n=0;n<t.length;++n)if(t[n]===e)return n;return-1}},{}],24:[function(t,e,n){e.exports=Array.isArray||function(t){return"[object Array]"==Object.prototype.toString.call(t)}},{}],25:[function(t,e,n){function r(t){if(t=""+t,!(t.length>1e4)){var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(e){var n=parseFloat(e[1]),r=(e[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return n*f;case"days":case"day":case"d":return n*u;case"hours":case"hour":case"hrs":case"hr":case"h":return n*p;case"minutes":case"minute":case"mins":case"min":case"m":return n*c;case"seconds":case"second":case"secs":case"sec":case"s":return n*a;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n}}}}function o(t){return t>=u?Math.round(t/u)+"d":t>=p?Math.round(t/p)+"h":t>=c?Math.round(t/c)+"m":t>=a?Math.round(t/a)+"s":t+"ms"}function i(t){return s(t,u,"day")||s(t,p,"hour")||s(t,c,"minute")||s(t,a,"second")||t+" ms"}function s(t,e,n){return e>t?void 0:1.5*e>t?Math.floor(t/e)+" "+n:Math.ceil(t/e)+" "+n+"s"}var a=1e3,c=60*a,p=60*c,u=24*p,f=365.25*u;e.exports=function(t,e){return e=e||{},"string"==typeof t?r(t):e["long"]?i(t):o(t)}},{}],26:[function(t,e,n){(function(t){var n=/^[\],:{}\s]*$/,r=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,o=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,i=/(?:^|:|,)(?:\s*\[)+/g,s=/^\s+/,a=/\s+$/;e.exports=function(e){return"string"==typeof e&&e?(e=e.replace(s,"").replace(a,""),t.JSON&&JSON.parse?JSON.parse(e):n.test(e.replace(r,"@").replace(o,"]").replace(i,""))?new Function("return "+e)():void 0):null}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{}],27:[function(t,e,n){n.encode=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e},n.decode=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;o>r;r++){var i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},{}],28:[function(t,e,n){var r=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,o=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];e.exports=function(t){var e=t,n=t.indexOf("["),i=t.indexOf("]");-1!=n&&-1!=i&&(t=t.substring(0,n)+t.substring(n,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=r.exec(t||""),a={},c=14;c--;)a[o[c]]=s[c]||"";return-1!=n&&-1!=i&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},{}],29:[function(e,n,r){(function(e){!function(o){function i(t){for(var e,n,r=[],o=0,i=t.length;i>o;)e=t.charCodeAt(o++),e>=55296&&56319>=e&&i>o?(n=t.charCodeAt(o++),56320==(64512&n)?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--)):r.push(e);return r}function s(t){for(var e,n=t.length,r=-1,o="";++r<n;)e=t[r],e>65535&&(e-=65536,o+=w(e>>>10&1023|55296),e=56320|1023&e),o+=w(e);return o}function a(t){if(t>=55296&&57343>=t)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value")}function c(t,e){return w(t>>e&63|128)}function p(t){if(0==(4294967168&t))return w(t);var e="";return 0==(4294965248&t)?e=w(t>>6&31|192):0==(4294901760&t)?(a(t),e=w(t>>12&15|224),e+=c(t,6)):0==(4292870144&t)&&(e=w(t>>18&7|240),e+=c(t,12),e+=c(t,6)),e+=w(63&t|128)}function u(t){for(var e,n=i(t),r=n.length,o=-1,s="";++o<r;)e=n[o],s+=p(e);return s}function f(){if(v>=b)throw Error("Invalid byte index");var t=255&m[v];if(v++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function h(){var t,e,n,r,o;if(v>b)throw Error("Invalid byte index");if(v==b)return!1;if(t=255&m[v],v++,0==(128&t))return t;if(192==(224&t)){var e=f();if(o=(31&t)<<6|e,o>=128)return o;throw Error("Invalid continuation byte")}if(224==(240&t)){if(e=f(),n=f(),o=(15&t)<<12|e<<6|n,o>=2048)return a(o),o;throw Error("Invalid continuation byte")}if(240==(248&t)&&(e=f(),n=f(),r=f(),o=(15&t)<<18|e<<12|n<<6|r,o>=65536&&1114111>=o))return o;throw Error("Invalid UTF-8 detected")}function l(t){m=i(t),b=m.length,v=0;for(var e,n=[];(e=h())!==!1;)n.push(e);return s(n)}var d="object"==typeof r&&r,y="object"==typeof n&&n&&n.exports==d&&n,g="object"==typeof e&&e;(g.global===g||g.window===g)&&(o=g);var m,b,v,w=String.fromCharCode,k={version:"2.0.0",encode:u,decode:l};if("function"==typeof t&&"object"==typeof t.amd&&t.amd)t(function(){return k});else if(d&&!d.nodeType)if(y)y.exports=k;else{var x={},A=x.hasOwnProperty;for(var B in k)A.call(k,B)&&(d[B]=k[B])}else o.utf8=k}(this)}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{}],30:[function(t,e,n){"use strict";function r(t){var e="";do e=a[t%c]+e,t=Math.floor(t/c);while(t>0);return e}function o(t){var e=0;for(f=0;f<t.length;f++)e=e*c+p[t.charAt(f)];return e}function i(){var t=r(+new Date);return t!==s?(u=0,s=t):t+"."+r(u++)}for(var s,a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),c=64,p={},u=0,f=0;c>f;f++)p[a[f]]=f;i.encode=r,i.decode=o,e.exports=i},{}],31:[function(t,e,n){function r(t,e){"object"==typeof t&&(e=t,t=void 0),e=e||{};var n,r=o(t),i=r.source,p=r.id,u=r.path,f=c[p]&&u in c[p].nsps,h=e.forceNew||e["force new connection"]||!1===e.multiplex||f;return h?(a("ignoring socket cache for %s",i),n=s(i,e)):(c[p]||(a("new io instance for %s",i),c[p]=s(i,e)),n=c[p]),n.socket(r.path)}var o=t("./url"),i=t("socket.io-parser"),s=t("./manager"),a=t("debug")("socket.io-client");e.exports=n=r;var c=n.managers={};n.protocol=i.protocol,n.connect=r,n.Manager=t("./manager"),n.Socket=t("./socket")},{"./manager":32,"./socket":34,"./url":35,debug:39,"socket.io-parser":47}],32:[function(t,e,n){function r(t,e){return this instanceof r?(t&&"object"==typeof t&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new h({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[],this.encoder=new a.Encoder,this.decoder=new a.Decoder,this.autoConnect=e.autoConnect!==!1,void(this.autoConnect&&this.open())):new r(t,e)}var o=t("engine.io-client"),i=t("./socket"),s=t("component-emitter"),a=t("socket.io-parser"),c=t("./on"),p=t("component-bind"),u=t("debug")("socket.io-client:manager"),f=t("indexof"),h=t("backo2"),l=Object.prototype.hasOwnProperty;e.exports=r,r.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)l.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},r.prototype.updateSocketIds=function(){for(var t in this.nsps)l.call(this.nsps,t)&&(this.nsps[t].id=this.engine.id)},s(r.prototype),r.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},r.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},r.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},r.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},r.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},r.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},r.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},r.prototype.open=r.prototype.connect=function(t){if(u("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;u("opening %s",this.uri),this.engine=o(this.uri,this.opts);var e=this.engine,n=this;this.readyState="opening",this.skipReconnect=!1;var r=c(e,"open",function(){n.onopen(),t&&t()}),i=c(e,"error",function(e){if(u("connect_error"),n.cleanup(),n.readyState="closed",n.emitAll("connect_error",e),t){var r=new Error("Connection error");r.data=e,t(r)}else n.maybeReconnectOnOpen()});if(!1!==this._timeout){var s=this._timeout;u("connect attempt will timeout after %d",s);var a=setTimeout(function(){u("connect attempt timed out after %d",s),r.destroy(),e.close(),e.emit("error","timeout"),n.emitAll("connect_timeout",s)},s);this.subs.push({destroy:function(){clearTimeout(a)}})}return this.subs.push(r),this.subs.push(i),this},r.prototype.onopen=function(){u("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(c(t,"data",p(this,"ondata"))),this.subs.push(c(t,"ping",p(this,"onping"))),this.subs.push(c(t,"pong",p(this,"onpong"))),this.subs.push(c(t,"error",p(this,"onerror"))),this.subs.push(c(t,"close",p(this,"onclose"))),this.subs.push(c(this.decoder,"decoded",p(this,"ondecoded")))},r.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},r.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},r.prototype.ondata=function(t){this.decoder.add(t)},r.prototype.ondecoded=function(t){this.emit("packet",t)},r.prototype.onerror=function(t){u("error",t),this.emitAll("error",t)},r.prototype.socket=function(t){function e(){~f(r.connecting,n)||r.connecting.push(n)}var n=this.nsps[t];if(!n){n=new i(this,t),this.nsps[t]=n;var r=this;n.on("connecting",e),n.on("connect",function(){n.id=r.engine.id}),this.autoConnect&&e()}return n},r.prototype.destroy=function(t){var e=f(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},r.prototype.packet=function(t){u("writing packet %j",t);var e=this;e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(n){for(var r=0;r<n.length;r++)e.engine.write(n[r],t.options);e.encoding=!1,e.processPacketQueue()}))},r.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},r.prototype.cleanup=function(){u("cleanup");for(var t;t=this.subs.shift();)t.destroy();this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},r.prototype.close=r.prototype.disconnect=function(){u("disconnect"),this.skipReconnect=!0,this.reconnecting=!1,"opening"==this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},r.prototype.onclose=function(t){u("onclose"),this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},r.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)u("reconnect failed"),this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();u("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var n=setTimeout(function(){t.skipReconnect||(u("attempting reconnect"),t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(u("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(u("reconnect success"),t.onreconnect())}))},e);this.subs.push({destroy:function(){clearTimeout(n)}})}},r.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)}},{"./on":33,"./socket":34,backo2:36,"component-bind":37,"component-emitter":38,debug:39,"engine.io-client":1,indexof:42,"socket.io-parser":47}],33:[function(t,e,n){function r(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}}e.exports=r},{}],34:[function(t,e,n){function r(t,e){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.io.autoConnect&&this.open()}var o=t("socket.io-parser"),i=t("component-emitter"),s=t("to-array"),a=t("./on"),c=t("component-bind"),p=t("debug")("socket.io-client:socket"),u=t("has-binary");e.exports=n=r;var f={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},h=i.prototype.emit;i(r.prototype),r.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[a(t,"open",c(this,"onopen")),a(t,"packet",c(this,"onpacket")),a(t,"close",c(this,"onclose"))]}},r.prototype.open=r.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"==this.io.readyState&&this.onopen(),this.emit("connecting"),this)},r.prototype.send=function(){var t=s(arguments);return t.unshift("message"),this.emit.apply(this,t),this},r.prototype.emit=function(t){if(f.hasOwnProperty(t))return h.apply(this,arguments),this;var e=s(arguments),n=o.EVENT;u(e)&&(n=o.BINARY_EVENT);var r={type:n,data:e};return r.options={},r.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(p("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),r.id=this.ids++),this.connected?this.packet(r):this.sendBuffer.push(r),delete this.flags,this},r.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},r.prototype.onopen=function(){p("transport is open - connecting"),"/"!=this.nsp&&this.packet({type:o.CONNECT})},r.prototype.onclose=function(t){p("close (%s)",t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},r.prototype.onpacket=function(t){if(t.nsp==this.nsp)switch(t.type){case o.CONNECT:this.onconnect();break;case o.EVENT:this.onevent(t);break;case o.BINARY_EVENT:this.onevent(t);break;case o.ACK:this.onack(t);break;case o.BINARY_ACK:this.onack(t);break;case o.DISCONNECT:this.ondisconnect();break;case o.ERROR:this.emit("error",t.data)}},r.prototype.onevent=function(t){var e=t.data||[];p("emitting event %j",e),null!=t.id&&(p("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?h.apply(this,e):this.receiveBuffer.push(e)},r.prototype.ack=function(t){var e=this,n=!1;return function(){if(!n){n=!0;var r=s(arguments);p("sending ack %j",r);var i=u(r)?o.BINARY_ACK:o.ACK;e.packet({type:i,id:t,data:r})}}},r.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e?(p("calling ack %s with %j",t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):p("bad ack %s",t.id)},r.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},r.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)h.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},r.prototype.ondisconnect=function(){p("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},r.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},r.prototype.close=r.prototype.disconnect=function(){return this.connected&&(p("performing disconnect (%s)",this.nsp),this.packet({type:o.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},r.prototype.compress=function(t){return this.flags=this.flags||{},this.flags.compress=t,this}},{"./on":33,"component-bind":37,"component-emitter":38,debug:39,"has-binary":41,"socket.io-parser":47,"to-array":51}],35:[function(t,e,n){(function(n){function r(t,e){var r=t,e=e||n.location;null==t&&(t=e.protocol+"//"+e.host),"string"==typeof t&&("/"==t.charAt(0)&&(t="/"==t.charAt(1)?e.protocol+t:e.host+t),/^(https?|wss?):\/\//.test(t)||(i("protocol-less url %s",t),t="undefined"!=typeof e?e.protocol+"//"+t:"https://"+t),i("parse %s",t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var s=-1!==r.host.indexOf(":"),a=s?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+a+":"+r.port,r.href=r.protocol+"://"+a+(e&&e.port==r.port?"":":"+r.port),r}var o=t("parseuri"),i=t("debug")("socket.io-client:url");e.exports=r}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{debug:39,parseuri:45}],36:[function(t,e,n){function r(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}e.exports=r,r.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},r.prototype.reset=function(){this.attempts=0},r.prototype.setMin=function(t){this.ms=t},r.prototype.setMax=function(t){this.max=t},r.prototype.setJitter=function(t){this.jitter=t}},{}],37:[function(t,e,n){var r=[].slice;e.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var n=r.call(arguments,2);return function(){return e.apply(t,n.concat(r.call(arguments)))}}},{}],38:[function(t,e,n){function r(t){return t?o(t):void 0}function o(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}e.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var r,o=0;o<n.length;o++)if(r=n[o],r===e||r.fn===e){n.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks["$"+t];if(n){n=n.slice(0);for(var r=0,o=n.length;o>r;++r)n[r].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},{}],39:[function(t,e,n){arguments[4][17][0].apply(n,arguments)},{"./debug":40,dup:17}],40:[function(t,e,n){arguments[4][18][0].apply(n,arguments)},{dup:18,ms:44}],41:[function(t,e,n){(function(n){function r(t){function e(t){if(!t)return!1;if(n.Buffer&&n.Buffer.isBuffer&&n.Buffer.isBuffer(t)||n.ArrayBuffer&&t instanceof ArrayBuffer||n.Blob&&t instanceof Blob||n.File&&t instanceof File)return!0;if(o(t)){for(var r=0;r<t.length;r++)if(e(t[r]))return!0}else if(t&&"object"==typeof t){t.toJSON&&"function"==typeof t.toJSON&&(t=t.toJSON());for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&e(t[i]))return!0}return!1}return e(t)}var o=t("isarray");e.exports=r}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{isarray:43}],42:[function(t,e,n){arguments[4][23][0].apply(n,arguments)},{dup:23}],43:[function(t,e,n){arguments[4][24][0].apply(n,arguments)},{dup:24}],44:[function(t,e,n){arguments[4][25][0].apply(n,arguments)},{dup:25}],45:[function(t,e,n){arguments[4][28][0].apply(n,arguments)},{dup:28}],46:[function(t,e,n){(function(e){var r=t("isarray"),o=t("./is-buffer");n.deconstructPacket=function(t){function e(t){if(!t)return t;if(o(t)){var i={_placeholder:!0,num:n.length};return n.push(t),i}if(r(t)){for(var s=new Array(t.length),a=0;a<t.length;a++)s[a]=e(t[a]);return s}if("object"==typeof t&&!(t instanceof Date)){var s={};for(var c in t)s[c]=e(t[c]);return s}return t}var n=[],i=t.data,s=t;return s.data=e(i),s.attachments=n.length,{packet:s,buffers:n}},n.reconstructPacket=function(t,e){function n(t){if(t&&t._placeholder){var o=e[t.num];return o}if(r(t)){for(var i=0;i<t.length;i++)t[i]=n(t[i]);return t}if(t&&"object"==typeof t){for(var s in t)t[s]=n(t[s]);return t}return t}return t.data=n(t.data),t.attachments=void 0,t},n.removeBlobs=function(t,n){function i(t,c,p){if(!t)return t;if(e.Blob&&t instanceof Blob||e.File&&t instanceof File){s++;var u=new FileReader;u.onload=function(){p?p[c]=this.result:a=this.result,--s||n(a)},u.readAsArrayBuffer(t)}else if(r(t))for(var f=0;f<t.length;f++)i(t[f],f,t);else if(t&&"object"==typeof t&&!o(t))for(var h in t)i(t[h],h,t)}var s=0,a=t;i(a),s||n(a)}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{"./is-buffer":48,isarray:43}],47:[function(t,e,n){function r(){}function o(t){var e="",r=!1;return e+=t.type,(n.BINARY_EVENT==t.type||n.BINARY_ACK==t.type)&&(e+=t.attachments,e+="-"),t.nsp&&"/"!=t.nsp&&(r=!0,e+=t.nsp),null!=t.id&&(r&&(e+=",",r=!1),e+=t.id),null!=t.data&&(r&&(e+=","),e+=f.stringify(t.data)),u("encoded %j as %s",t,e),e}function i(t,e){function n(t){var n=l.deconstructPacket(t),r=o(n.packet),i=n.buffers;i.unshift(r),e(i)}l.removeBlobs(t,n)}function s(){this.reconstructor=null}function a(t){var e={},r=0;if(e.type=Number(t.charAt(0)),null==n.types[e.type])return p();if(n.BINARY_EVENT==e.type||n.BINARY_ACK==e.type){for(var o="";"-"!=t.charAt(++r)&&(o+=t.charAt(r),r!=t.length););if(o!=Number(o)||"-"!=t.charAt(r))throw new Error("Illegal attachments");e.attachments=Number(o)}if("/"==t.charAt(r+1))for(e.nsp="";++r;){var i=t.charAt(r);if(","==i)break;if(e.nsp+=i,r==t.length)break}else e.nsp="/";var s=t.charAt(r+1);if(""!==s&&Number(s)==s){for(e.id="";++r;){var i=t.charAt(r);if(null==i||Number(i)!=i){--r;break}if(e.id+=t.charAt(r),r==t.length)break}e.id=Number(e.id)}if(t.charAt(++r))try{e.data=f.parse(t.substr(r))}catch(a){return p()}return u("decoded %s as %j",t,e),e}function c(t){this.reconPack=t,this.buffers=[]}function p(t){return{type:n.ERROR,data:"parser error"}}var u=t("debug")("socket.io-parser"),f=t("json3"),h=(t("isarray"),t("component-emitter")),l=t("./binary"),d=t("./is-buffer");n.protocol=4,n.types=["CONNECT","DISCONNECT","EVENT","BINARY_EVENT","ACK","BINARY_ACK","ERROR"],n.CONNECT=0,n.DISCONNECT=1,n.EVENT=2,n.ACK=3,n.ERROR=4,n.BINARY_EVENT=5,n.BINARY_ACK=6,n.Encoder=r,n.Decoder=s,r.prototype.encode=function(t,e){if(u("encoding packet %j",t),n.BINARY_EVENT==t.type||n.BINARY_ACK==t.type)i(t,e);else{var r=o(t);e([r])}},h(s.prototype),s.prototype.add=function(t){var e;if("string"==typeof t)e=a(t),n.BINARY_EVENT==e.type||n.BINARY_ACK==e.type?(this.reconstructor=new c(e),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",e)):this.emit("decoded",e);else{if(!d(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");e=this.reconstructor.takeBinaryData(t),e&&(this.reconstructor=null,this.emit("decoded",e))}},s.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},c.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length==this.reconPack.attachments){var e=l.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},c.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},{"./binary":46,"./is-buffer":48,"component-emitter":49,debug:39,isarray:43,json3:50}],48:[function(t,e,n){(function(t){function n(e){return t.Buffer&&t.Buffer.isBuffer(e)||t.ArrayBuffer&&e instanceof ArrayBuffer}e.exports=n}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{}],49:[function(t,e,n){arguments[4][15][0].apply(n,arguments)},{dup:15}],50:[function(e,n,r){(function(e){(function(){function o(t,e){function n(t){if(n[t]!==g)return n[t];var o;if("bug-string-char-index"==t)o="a"!="a"[0];else if("json"==t)o=n("json-stringify")&&n("json-parse");else{var s,a='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==t){var c=e.stringify,u="function"==typeof c&&v;if(u){(s=function(){return 1}).toJSON=s;try{u="0"===c(0)&&"0"===c(new r)&&'""'==c(new i)&&c(b)===g&&c(g)===g&&c()===g&&"1"===c(s)&&"[1]"==c([s])&&"[null]"==c([g])&&"null"==c(null)&&"[null,null,null]"==c([g,b,null])&&c({a:[s,!0,!1,null,"\x00\b\n\f\r   "]})==a&&"1"===c(null,s)&&"[\n 1,\n 2\n]"==c([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==c(new p(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==c(new p(864e13))&&'"-000001-01-01T00:00:00.000Z"'==c(new p(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==c(new p(-1))}catch(f){u=!1}}o=u}if("json-parse"==t){var h=e.parse;if("function"==typeof h)try{if(0===h("0")&&!h(!1)){s=h(a);var l=5==s.a.length&&1===s.a[0];if(l){try{l=!h('" "')}catch(f){}if(l)try{l=1!==h("01")}catch(f){}if(l)try{l=1!==h("1.")}catch(f){}}}}catch(f){l=!1}o=l}}return n[t]=!!o}t||(t=c.Object()),e||(e=c.Object());var r=t.Number||c.Number,i=t.String||c.String,a=t.Object||c.Object,p=t.Date||c.Date,u=t.SyntaxError||c.SyntaxError,f=t.TypeError||c.TypeError,h=t.Math||c.Math,l=t.JSON||c.JSON;"object"==typeof l&&l&&(e.stringify=l.stringify,e.parse=l.parse);var d,y,g,m=a.prototype,b=m.toString,v=new p(-0xc782b5b800cec);try{v=-109252==v.getUTCFullYear()&&0===v.getUTCMonth()&&1===v.getUTCDate()&&10==v.getUTCHours()&&37==v.getUTCMinutes()&&6==v.getUTCSeconds()&&708==v.getUTCMilliseconds()}catch(w){}if(!n("json")){var k="[object Function]",x="[object Date]",A="[object Number]",B="[object String]",C="[object Array]",S="[object Boolean]",E=n("bug-string-char-index");if(!v)var _=h.floor,T=[0,31,59,90,120,151,181,212,243,273,304,334],O=function(t,e){return T[e]+365*(t-1970)+_((t-1969+(e=+(e>1)))/4)-_((t-1901+e)/100)+_((t-1601+e)/400)};if((d=m.hasOwnProperty)||(d=function(t){var e,n={};return(n.__proto__=null,n.__proto__={toString:1},n).toString!=b?d=function(t){var e=this.__proto__,n=t in(this.__proto__=null,this);return this.__proto__=e,n}:(e=n.constructor,d=function(t){var n=(this.constructor||e).prototype;return t in this&&!(t in n&&this[t]===n[t])}),n=null,d.call(this,t)}),y=function(t,e){var n,r,o,i=0;(n=function(){
this.valueOf=0}).prototype.valueOf=0,r=new n;for(o in r)d.call(r,o)&&i++;return n=r=null,i?y=2==i?function(t,e){var n,r={},o=b.call(t)==k;for(n in t)o&&"prototype"==n||d.call(r,n)||!(r[n]=1)||!d.call(t,n)||e(n)}:function(t,e){var n,r,o=b.call(t)==k;for(n in t)o&&"prototype"==n||!d.call(t,n)||(r="constructor"===n)||e(n);(r||d.call(t,n="constructor"))&&e(n)}:(r=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],y=function(t,e){var n,o,i=b.call(t)==k,a=!i&&"function"!=typeof t.constructor&&s[typeof t.hasOwnProperty]&&t.hasOwnProperty||d;for(n in t)i&&"prototype"==n||!a.call(t,n)||e(n);for(o=r.length;n=r[--o];a.call(t,n)&&e(n));}),y(t,e)},!n("json-stringify")){var j={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},P="000000",N=function(t,e){return(P+(e||0)).slice(-t)},R="\\u00",D=function(t){for(var e='"',n=0,r=t.length,o=!E||r>10,i=o&&(E?t.split(""):t);r>n;n++){var s=t.charCodeAt(n);switch(s){case 8:case 9:case 10:case 12:case 13:case 34:case 92:e+=j[s];break;default:if(32>s){e+=R+N(2,s.toString(16));break}e+=o?i[n]:t.charAt(n)}}return e+'"'},U=function(t,e,n,r,o,i,s){var a,c,p,u,h,l,m,v,w,k,E,T,j,P,R,q;try{a=e[t]}catch(L){}if("object"==typeof a&&a)if(c=b.call(a),c!=x||d.call(a,"toJSON"))"function"==typeof a.toJSON&&(c!=A&&c!=B&&c!=C||d.call(a,"toJSON"))&&(a=a.toJSON(t));else if(a>-1/0&&1/0>a){if(O){for(h=_(a/864e5),p=_(h/365.2425)+1970-1;O(p+1,0)<=h;p++);for(u=_((h-O(p,0))/30.42);O(p,u+1)<=h;u++);h=1+h-O(p,u),l=(a%864e5+864e5)%864e5,m=_(l/36e5)%24,v=_(l/6e4)%60,w=_(l/1e3)%60,k=l%1e3}else p=a.getUTCFullYear(),u=a.getUTCMonth(),h=a.getUTCDate(),m=a.getUTCHours(),v=a.getUTCMinutes(),w=a.getUTCSeconds(),k=a.getUTCMilliseconds();a=(0>=p||p>=1e4?(0>p?"-":"+")+N(6,0>p?-p:p):N(4,p))+"-"+N(2,u+1)+"-"+N(2,h)+"T"+N(2,m)+":"+N(2,v)+":"+N(2,w)+"."+N(3,k)+"Z"}else a=null;if(n&&(a=n.call(e,t,a)),null===a)return"null";if(c=b.call(a),c==S)return""+a;if(c==A)return a>-1/0&&1/0>a?""+a:"null";if(c==B)return D(""+a);if("object"==typeof a){for(P=s.length;P--;)if(s[P]===a)throw f();if(s.push(a),E=[],R=i,i+=o,c==C){for(j=0,P=a.length;P>j;j++)T=U(j,a,n,r,o,i,s),E.push(T===g?"null":T);q=E.length?o?"[\n"+i+E.join(",\n"+i)+"\n"+R+"]":"["+E.join(",")+"]":"[]"}else y(r||a,function(t){var e=U(t,a,n,r,o,i,s);e!==g&&E.push(D(t)+":"+(o?" ":"")+e)}),q=E.length?o?"{\n"+i+E.join(",\n"+i)+"\n"+R+"}":"{"+E.join(",")+"}":"{}";return s.pop(),q}};e.stringify=function(t,e,n){var r,o,i,a;if(s[typeof e]&&e)if((a=b.call(e))==k)o=e;else if(a==C){i={};for(var c,p=0,u=e.length;u>p;c=e[p++],a=b.call(c),(a==B||a==A)&&(i[c]=1));}if(n)if((a=b.call(n))==A){if((n-=n%1)>0)for(r="",n>10&&(n=10);r.length<n;r+=" ");}else a==B&&(r=n.length<=10?n:n.slice(0,10));return U("",(c={},c[""]=t,c),o,i,r,"",[])}}if(!n("json-parse")){var q,L,M=i.fromCharCode,I={92:"\\",34:'"',47:"/",98:"\b",116:"    ",110:"\n",102:"\f",114:"\r"},H=function(){throw q=L=null,u()},z=function(){for(var t,e,n,r,o,i=L,s=i.length;s>q;)switch(o=i.charCodeAt(q)){case 9:case 10:case 13:case 32:q++;break;case 123:case 125:case 91:case 93:case 58:case 44:return t=E?i.charAt(q):i[q],q++,t;case 34:for(t="@",q++;s>q;)if(o=i.charCodeAt(q),32>o)H();else if(92==o)switch(o=i.charCodeAt(++q)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:t+=I[o],q++;break;case 117:for(e=++q,n=q+4;n>q;q++)o=i.charCodeAt(q),o>=48&&57>=o||o>=97&&102>=o||o>=65&&70>=o||H();t+=M("0x"+i.slice(e,q));break;default:H()}else{if(34==o)break;for(o=i.charCodeAt(q),e=q;o>=32&&92!=o&&34!=o;)o=i.charCodeAt(++q);t+=i.slice(e,q)}if(34==i.charCodeAt(q))return q++,t;H();default:if(e=q,45==o&&(r=!0,o=i.charCodeAt(++q)),o>=48&&57>=o){for(48==o&&(o=i.charCodeAt(q+1),o>=48&&57>=o)&&H(),r=!1;s>q&&(o=i.charCodeAt(q),o>=48&&57>=o);q++);if(46==i.charCodeAt(q)){for(n=++q;s>n&&(o=i.charCodeAt(n),o>=48&&57>=o);n++);n==q&&H(),q=n}if(o=i.charCodeAt(q),101==o||69==o){for(o=i.charCodeAt(++q),(43==o||45==o)&&q++,n=q;s>n&&(o=i.charCodeAt(n),o>=48&&57>=o);n++);n==q&&H(),q=n}return+i.slice(e,q)}if(r&&H(),"true"==i.slice(q,q+4))return q+=4,!0;if("false"==i.slice(q,q+5))return q+=5,!1;if("null"==i.slice(q,q+4))return q+=4,null;H()}return"$"},J=function(t){var e,n;if("$"==t&&H(),"string"==typeof t){if("@"==(E?t.charAt(0):t[0]))return t.slice(1);if("["==t){for(e=[];t=z(),"]"!=t;n||(n=!0))n&&(","==t?(t=z(),"]"==t&&H()):H()),","==t&&H(),e.push(J(t));return e}if("{"==t){for(e={};t=z(),"}"!=t;n||(n=!0))n&&(","==t?(t=z(),"}"==t&&H()):H()),(","==t||"string"!=typeof t||"@"!=(E?t.charAt(0):t[0])||":"!=z())&&H(),e[t.slice(1)]=J(z());return e}H()}return t},X=function(t,e,n){var r=F(t,e,n);r===g?delete t[e]:t[e]=r},F=function(t,e,n){var r,o=t[e];if("object"==typeof o&&o)if(b.call(o)==C)for(r=o.length;r--;)X(o,r,n);else y(o,function(t){X(o,t,n)});return n.call(t,e,o)};e.parse=function(t,e){var n,r;return q=0,L=""+t,n=J(z()),"$"!=z()&&H(),q=L=null,e&&b.call(e)==k?F((r={},r[""]=n,r),"",e):n}}}return e.runInContext=o,e}var i="function"==typeof t&&t.amd,s={"function":!0,object:!0},a=s[typeof r]&&r&&!r.nodeType&&r,c=s[typeof window]&&window||this,p=a&&s[typeof n]&&n&&!n.nodeType&&"object"==typeof e&&e;if(!p||p.global!==p&&p.window!==p&&p.self!==p||(c=p),a&&!i)o(c,a);else{var u=c.JSON,f=c.JSON3,h=!1,l=o(c,c.JSON3={noConflict:function(){return h||(h=!0,c.JSON=u,c.JSON3=f,u=f=null),l}});c.JSON={parse:l.parse,stringify:l.stringify}}i&&t(function(){return l})}).call(this)}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{})},{}],51:[function(t,e,n){function r(t,e){var n=[];e=e||0;for(var r=e||0;r<t.length;r++)n[r-e]=t[r];return n}e.exports=r},{}]},{},[31])(31)});

/*doT.js*/
!function(){"use strict";function e(n,t,r){return("string"==typeof t?t:t.toString()).replace(n.define||a,function(e,t,o,a){return 0===t.indexOf("def.")&&(t=t.substring(4)),t in r||(":"===o?(n.defineParams&&a.replace(n.defineParams,function(e,n,o){r[t]={arg:n,text:o}}),t in r||(r[t]=a)):new Function("def","def['"+t+"']="+a)(r)),""}).replace(n.use||a,function(t,o){n.useParams&&(o=o.replace(n.useParams,function(e,n,t,o){if(r[t]&&r[t].arg&&o){var a=(t+":"+o).replace(/'|\\/g,"_");return r.__exp=r.__exp||{},r.__exp[a]=r[t].text.replace(new RegExp("(^|[^\\w$])"+r[t].arg+"([^\\w$])","g"),"$1"+o+"$2"),n+"def.__exp['"+a+"']"}}));var a=new Function("def","return "+o)(r);return a?e(n,a,r):a})}function n(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var t,r={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};r.encodeHTMLSource=function(e){var n={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},t=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(t,function(e){return n[e]||e}):""}},t=function(){return this||(0,eval)("this")}(),"undefined"!=typeof module&&module.exports?module.exports=r:"function"==typeof define&&define.amd?define(function(){return r}):t.doT=r;var o={append:{start:"'+(",end:")+'",startencode:"'+encodeHTML("},split:{start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("}},a=/$^/;r.template=function(c,i,u){i=i||r.templateSettings;var d,s,p=i.append?o.append:o.split,l=0,f=i.use||i.define?e(i,c,u||{}):c;f=("var out='"+(i.strip?f.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):f).replace(/'|\\/g,"\\$&").replace(i.interpolate||a,function(e,t){return p.start+n(t)+p.end}).replace(i.encode||a,function(e,t){return d=!0,p.startencode+n(t)+p.end}).replace(i.conditional||a,function(e,t,r){return t?r?"';}else if("+n(r)+"){out+='":"';}else{out+='":r?"';if("+n(r)+"){out+='":"';}out+='"}).replace(i.iterate||a,function(e,t,r,o){return t?(l+=1,s=o||"i"+l,t=n(t),"';var arr"+l+"="+t+";if(arr"+l+"){var "+r+","+s+"=-1,l"+l+"=arr"+l+".length-1;while("+s+"<l"+l+"){"+r+"=arr"+l+"["+s+"+=1];out+='"):"';} } out+='"}).replace(i.evaluate||a,function(e,t){return"';"+n(t)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),d&&(i.selfcontained||!t||t._encodeHTML||(t._encodeHTML=r.encodeHTMLSource(i.doNotSkipEncoded)),f="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+r.encodeHTMLSource.toString()+"("+(i.doNotSkipEncoded||"")+"));"+f);try{return new Function(i.varname,f)}catch(g){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+f),g}},r.compile=function(e,n){return r.template(e,null,n)}}();




/*jquery*/
/*!
 * jQuery JavaScript Library v2.2.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:23Z
 */

(function( global, factory ) {

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "jQuery requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr = [];

var document = window.document;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
    version = "2.2.4",

    // Define a local copy of jQuery
    jQuery = function( selector, context ) {

        // The jQuery object is actually just the init constructor 'enhanced'
        // Need init if jQuery is called (just allow error to be thrown if not included)
        return new jQuery.fn.init( selector, context );
    },

    // Support: Android<4.1
    // Make sure we trim BOM and NBSP
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

    // Matches dashed string for camelizing
    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi,

    // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function( all, letter ) {
        return letter.toUpperCase();
    };

jQuery.fn = jQuery.prototype = {

    // The current version of jQuery being used
    jquery: version,

    constructor: jQuery,

    // Start with an empty selector
    selector: "",

    // The default length of a jQuery object is 0
    length: 0,

    toArray: function() {
        return slice.call( this );
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function( num ) {
        return num != null ?

            // Return just the one element from the set
            ( num < 0 ? this[ num + this.length ] : this[ num ] ) :

            // Return all the elements in a clean array
            slice.call( this );
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function( elems ) {

        // Build a new jQuery matched element set
        var ret = jQuery.merge( this.constructor(), elems );

        // Add the old object onto the stack (as a reference)
        ret.prevObject = this;
        ret.context = this.context;

        // Return the newly-formed element set
        return ret;
    },

    // Execute a callback for every element in the matched set.
    each: function( callback ) {
        return jQuery.each( this, callback );
    },

    map: function( callback ) {
        return this.pushStack( jQuery.map( this, function( elem, i ) {
            return callback.call( elem, i, elem );
        } ) );
    },

    slice: function() {
        return this.pushStack( slice.apply( this, arguments ) );
    },

    first: function() {
        return this.eq( 0 );
    },

    last: function() {
        return this.eq( -1 );
    },

    eq: function( i ) {
        var len = this.length,
            j = +i + ( i < 0 ? len : 0 );
        return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
    },

    end: function() {
        return this.prevObject || this.constructor();
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: push,
    sort: arr.sort,
    splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;

        // Skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {

        // Only deal with non-null/undefined values
        if ( ( options = arguments[ i ] ) != null ) {

            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
                    ( copyIsArray = jQuery.isArray( copy ) ) ) ) {

                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray( src ) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject( src ) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = jQuery.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

jQuery.extend( {

    // Unique for each copy of jQuery on the page
    expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

    // Assume jQuery is ready without the ready module
    isReady: true,

    error: function( msg ) {
        throw new Error( msg );
    },

    noop: function() {},

    isFunction: function( obj ) {
        return jQuery.type( obj ) === "function";
    },

    isArray: Array.isArray,

    isWindow: function( obj ) {
        return obj != null && obj === obj.window;
    },

    isNumeric: function( obj ) {

        // parseFloat NaNs numeric-cast false positives (null|true|false|"")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        // adding 1 corrects loss of precision from parseFloat (#15100)
        var realStringObj = obj && obj.toString();
        return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
    },

    isPlainObject: function( obj ) {
        var key;

        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
            return false;
        }

        // Not own constructor property must be Object
        if ( obj.constructor &&
                !hasOwn.call( obj, "constructor" ) &&
                !hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own
        for ( key in obj ) {}

        return key === undefined || hasOwn.call( obj, key );
    },

    isEmptyObject: function( obj ) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    },

    type: function( obj ) {
        if ( obj == null ) {
            return obj + "";
        }

        // Support: Android<4.0, iOS<6 (functionish RegExp)
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[ toString.call( obj ) ] || "object" :
            typeof obj;
    },

    // Evaluates a script in a global context
    globalEval: function( code ) {
        var script,
            indirect = eval;

        code = jQuery.trim( code );

        if ( code ) {

            // If the code includes a valid, prologue position
            // strict mode pragma, execute code by injecting a
            // script tag into the document.
            if ( code.indexOf( "use strict" ) === 1 ) {
                script = document.createElement( "script" );
                script.text = code;
                document.head.appendChild( script ).parentNode.removeChild( script );
            } else {

                // Otherwise, avoid the DOM node creation, insertion
                // and removal by using an indirect global eval

                indirect( code );
            }
        }
    },

    // Convert dashed to camelCase; used by the css and data modules
    // Support: IE9-11+
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function( string ) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    },

    nodeName: function( elem, name ) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },

    each: function( obj, callback ) {
        var length, i = 0;

        if ( isArrayLike( obj ) ) {
            length = obj.length;
            for ( ; i < length; i++ ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        }

        return obj;
    },

    // Support: Android<4.1
    trim: function( text ) {
        return text == null ?
            "" :
            ( text + "" ).replace( rtrim, "" );
    },

    // results is for internal usage only
    makeArray: function( arr, results ) {
        var ret = results || [];

        if ( arr != null ) {
            if ( isArrayLike( Object( arr ) ) ) {
                jQuery.merge( ret,
                    typeof arr === "string" ?
                    [ arr ] : arr
                );
            } else {
                push.call( ret, arr );
            }
        }

        return ret;
    },

    inArray: function( elem, arr, i ) {
        return arr == null ? -1 : indexOf.call( arr, elem, i );
    },

    merge: function( first, second ) {
        var len = +second.length,
            j = 0,
            i = first.length;

        for ( ; j < len; j++ ) {
            first[ i++ ] = second[ j ];
        }

        first.length = i;

        return first;
    },

    grep: function( elems, callback, invert ) {
        var callbackInverse,
            matches = [],
            i = 0,
            length = elems.length,
            callbackExpect = !invert;

        // Go through the array, only saving the items
        // that pass the validator function
        for ( ; i < length; i++ ) {
            callbackInverse = !callback( elems[ i ], i );
            if ( callbackInverse !== callbackExpect ) {
                matches.push( elems[ i ] );
            }
        }

        return matches;
    },

    // arg is for internal usage only
    map: function( elems, callback, arg ) {
        var length, value,
            i = 0,
            ret = [];

        // Go through the array, translating each of the items to their new values
        if ( isArrayLike( elems ) ) {
            length = elems.length;
            for ( ; i < length; i++ ) {
                value = callback( elems[ i ], i, arg );

                if ( value != null ) {
                    ret.push( value );
                }
            }

        // Go through every key on the object,
        } else {
            for ( i in elems ) {
                value = callback( elems[ i ], i, arg );

                if ( value != null ) {
                    ret.push( value );
                }
            }
        }

        // Flatten any nested arrays
        return concat.apply( [], ret );
    },

    // A global GUID counter for objects
    guid: 1,

    // Bind a function to a context, optionally partially applying any
    // arguments.
    proxy: function( fn, context ) {
        var tmp, args, proxy;

        if ( typeof context === "string" ) {
            tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ( !jQuery.isFunction( fn ) ) {
            return undefined;
        }

        // Simulated bind
        args = slice.call( arguments, 2 );
        proxy = function() {
            return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
        };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;

        return proxy;
    },

    now: Date.now,

    // jQuery.support is not used in Core but other projects attach their
    // properties to it so it needs to exist.
    support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
    jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

    // Support: iOS 8.2 (not reproducible in simulator)
    // `in` check used to prevent JIT error (gh-2145)
    // hasOwn isn't used here due to false negatives
    // regarding Nodelist length in IE
    var length = !!obj && "length" in obj && obj.length,
        type = jQuery.type( obj );

    if ( type === "function" || jQuery.isWindow( obj ) ) {
        return false;
    }

    return type === "array" || length === 0 ||
        typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
    support,
    Expr,
    getText,
    isXML,
    tokenize,
    compile,
    select,
    outermostContext,
    sortInput,
    hasDuplicate,

    // Local document vars
    setDocument,
    document,
    docElem,
    documentIsHTML,
    rbuggyQSA,
    rbuggyMatches,
    matches,
    contains,

    // Instance-specific data
    expando = "sizzle" + 1 * new Date(),
    preferredDoc = window.document,
    dirruns = 0,
    done = 0,
    classCache = createCache(),
    tokenCache = createCache(),
    compilerCache = createCache(),
    sortOrder = function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
        }
        return 0;
    },

    // General-purpose constants
    MAX_NEGATIVE = 1 << 31,

    // Instance methods
    hasOwn = ({}).hasOwnProperty,
    arr = [],
    pop = arr.pop,
    push_native = arr.push,
    push = arr.push,
    slice = arr.slice,
    // Use a stripped-down indexOf as it's faster than native
    // http://jsperf.com/thor-indexof-vs-for/5
    indexOf = function( list, elem ) {
        var i = 0,
            len = list.length;
        for ( ; i < len; i++ ) {
            if ( list[i] === elem ) {
                return i;
            }
        }
        return -1;
    },

    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

    // Regular expressions

    // http://www.w3.org/TR/css3-selectors/#whitespace
    whitespace = "[\\x20\\t\\r\\n\\f]",

    // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
    identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

    // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
        // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace +
        // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
        "*\\]",

    pseudos = ":(" + identifier + ")(?:\\((" +
        // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
        // 1. quoted (capture 3; capture 4 or capture 5)
        "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
        // 2. simple (capture 6)
        "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
        // 3. anything else (capture 2)
        ".*" +
        ")\\)|)",

    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    rwhitespace = new RegExp( whitespace + "+", "g" ),
    rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

    rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

    rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

    rpseudo = new RegExp( pseudos ),
    ridentifier = new RegExp( "^" + identifier + "$" ),

    matchExpr = {
        "ID": new RegExp( "^#(" + identifier + ")" ),
        "CLASS": new RegExp( "^\\.(" + identifier + ")" ),
        "TAG": new RegExp( "^(" + identifier + "|[*])" ),
        "ATTR": new RegExp( "^" + attributes ),
        "PSEUDO": new RegExp( "^" + pseudos ),
        "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
            "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
            "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
        "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
        // For use in libraries implementing .is()
        // We use this for POS matching in `select`
        "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    },

    rinputs = /^(?:input|select|textarea|button)$/i,
    rheader = /^h\d$/i,

    rnative = /^[^{]+\{\s*\[native \w/,

    // Easily-parseable/retrievable ID or TAG or CLASS selectors
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    rsibling = /[+~]/,
    rescape = /'|\\/g,

    // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
    funescape = function( _, escaped, escapedWhitespace ) {
        var high = "0x" + escaped - 0x10000;
        // NaN means non-codepoint
        // Support: Firefox<24
        // Workaround erroneous numeric interpretation of +"0x"
        return high !== high || escapedWhitespace ?
            escaped :
            high < 0 ?
                // BMP codepoint
                String.fromCharCode( high + 0x10000 ) :
                // Supplemental Plane codepoint (surrogate pair)
                String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    },

    // Used for iframes
    // See setDocument()
    // Removing the function wrapper causes a "Permission Denied"
    // error in IE
    unloadHandler = function() {
        setDocument();
    };

// Optimize for push.apply( _, NodeList )
try {
    push.apply(
        (arr = slice.call( preferredDoc.childNodes )),
        preferredDoc.childNodes
    );
    // Support: Android<4.0
    // Detect silently failing push.apply
    arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
    push = { apply: arr.length ?

        // Leverage slice if possible
        function( target, els ) {
            push_native.apply( target, slice.call(els) );
        } :

        // Support: IE<9
        // Otherwise append directly
        function( target, els ) {
            var j = target.length,
                i = 0;
            // Can't trust NodeList.length
            while ( (target[j++] = els[i++]) ) {}
            target.length = j - 1;
        }
    };
}

function Sizzle( selector, context, results, seed ) {
    var m, i, elem, nid, nidselect, match, groups, newSelector,
        newContext = context && context.ownerDocument,

        // nodeType defaults to 9, since context defaults to document
        nodeType = context ? context.nodeType : 9;

    results = results || [];

    // Return early from calls with invalid selector or context
    if ( typeof selector !== "string" || !selector ||
        nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

        return results;
    }

    // Try to shortcut find operations (as opposed to filters) in HTML documents
    if ( !seed ) {

        if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
            setDocument( context );
        }
        context = context || document;

        if ( documentIsHTML ) {

            // If the selector is sufficiently simple, try using a "get*By*" DOM method
            // (excepting DocumentFragment context, where the methods don't exist)
            if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

                // ID selector
                if ( (m = match[1]) ) {

                    // Document context
                    if ( nodeType === 9 ) {
                        if ( (elem = context.getElementById( m )) ) {

                            // Support: IE, Opera, Webkit
                            // TODO: identify versions
                            // getElementById can match elements by name instead of ID
                            if ( elem.id === m ) {
                                results.push( elem );
                                return results;
                            }
                        } else {
                            return results;
                        }

                    // Element context
                    } else {

                        // Support: IE, Opera, Webkit
                        // TODO: identify versions
                        // getElementById can match elements by name instead of ID
                        if ( newContext && (elem = newContext.getElementById( m )) &&
                            contains( context, elem ) &&
                            elem.id === m ) {

                            results.push( elem );
                            return results;
                        }
                    }

                // Type selector
                } else if ( match[2] ) {
                    push.apply( results, context.getElementsByTagName( selector ) );
                    return results;

                // Class selector
                } else if ( (m = match[3]) && support.getElementsByClassName &&
                    context.getElementsByClassName ) {

                    push.apply( results, context.getElementsByClassName( m ) );
                    return results;
                }
            }

            // Take advantage of querySelectorAll
            if ( support.qsa &&
                !compilerCache[ selector + " " ] &&
                (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

                if ( nodeType !== 1 ) {
                    newContext = context;
                    newSelector = selector;

                // qSA looks outside Element context, which is not what we want
                // Thanks to Andrew Dupont for this workaround technique
                // Support: IE <=8
                // Exclude object elements
                } else if ( context.nodeName.toLowerCase() !== "object" ) {

                    // Capture the context ID, setting it first if necessary
                    if ( (nid = context.getAttribute( "id" )) ) {
                        nid = nid.replace( rescape, "\\$&" );
                    } else {
                        context.setAttribute( "id", (nid = expando) );
                    }

                    // Prefix every selector in the list
                    groups = tokenize( selector );
                    i = groups.length;
                    nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
                    while ( i-- ) {
                        groups[i] = nidselect + " " + toSelector( groups[i] );
                    }
                    newSelector = groups.join( "," );

                    // Expand context for sibling selectors
                    newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
                        context;
                }

                if ( newSelector ) {
                    try {
                        push.apply( results,
                            newContext.querySelectorAll( newSelector )
                        );
                        return results;
                    } catch ( qsaError ) {
                    } finally {
                        if ( nid === expando ) {
                            context.removeAttribute( "id" );
                        }
                    }
                }
            }
        }
    }

    // All others
    return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *  deleting the oldest entry
 */
function createCache() {
    var keys = [];

    function cache( key, value ) {
        // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
        if ( keys.push( key + " " ) > Expr.cacheLength ) {
            // Only keep the most recent entries
            delete cache[ keys.shift() ];
        }
        return (cache[ key + " " ] = value);
    }
    return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
    fn[ expando ] = true;
    return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
    var div = document.createElement("div");

    try {
        return !!fn( div );
    } catch (e) {
        return false;
    } finally {
        // Remove from its parent by default
        if ( div.parentNode ) {
            div.parentNode.removeChild( div );
        }
        // release memory in IE
        div = null;
    }
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
    var arr = attrs.split("|"),
        i = arr.length;

    while ( i-- ) {
        Expr.attrHandle[ arr[i] ] = handler;
    }
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
    var cur = b && a,
        diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
            ( ~b.sourceIndex || MAX_NEGATIVE ) -
            ( ~a.sourceIndex || MAX_NEGATIVE );

    // Use IE sourceIndex if available on both nodes
    if ( diff ) {
        return diff;
    }

    // Check if b follows a
    if ( cur ) {
        while ( (cur = cur.nextSibling) ) {
            if ( cur === b ) {
                return -1;
            }
        }
    }

    return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
    return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
    };
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
    return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
    };
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
    return markFunction(function( argument ) {
        argument = +argument;
        return markFunction(function( seed, matches ) {
            var j,
                matchIndexes = fn( [], seed.length, argument ),
                i = matchIndexes.length;

            // Match elements found at the specified indexes
            while ( i-- ) {
                if ( seed[ (j = matchIndexes[i]) ] ) {
                    seed[j] = !(matches[j] = seed[j]);
                }
            }
        });
    });
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
    return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
    // documentElement is verified for cases where it doesn't yet exist
    // (such as loading iframes in IE - #4833)
    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
    var hasCompare, parent,
        doc = node ? node.ownerDocument || node : preferredDoc;

    // Return early if doc is invalid or already selected
    if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
        return document;
    }

    // Update global variables
    document = doc;
    docElem = document.documentElement;
    documentIsHTML = !isXML( document );

    // Support: IE 9-11, Edge
    // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
    if ( (parent = document.defaultView) && parent.top !== parent ) {
        // Support: IE 11
        if ( parent.addEventListener ) {
            parent.addEventListener( "unload", unloadHandler, false );

        // Support: IE 9 - 10 only
        } else if ( parent.attachEvent ) {
            parent.attachEvent( "onunload", unloadHandler );
        }
    }

    /* Attributes
    ---------------------------------------------------------------------- */

    // Support: IE<8
    // Verify that getAttribute really returns attributes and not properties
    // (excepting IE8 booleans)
    support.attributes = assert(function( div ) {
        div.className = "i";
        return !div.getAttribute("className");
    });

    /* getElement(s)By*
    ---------------------------------------------------------------------- */

    // Check if getElementsByTagName("*") returns only elements
    support.getElementsByTagName = assert(function( div ) {
        div.appendChild( document.createComment("") );
        return !div.getElementsByTagName("*").length;
    });

    // Support: IE<9
    support.getElementsByClassName = rnative.test( document.getElementsByClassName );

    // Support: IE<10
    // Check if getElementById returns elements by name
    // The broken getElementById methods don't pick up programatically-set names,
    // so use a roundabout getElementsByName test
    support.getById = assert(function( div ) {
        docElem.appendChild( div ).id = expando;
        return !document.getElementsByName || !document.getElementsByName( expando ).length;
    });

    // ID find and filter
    if ( support.getById ) {
        Expr.find["ID"] = function( id, context ) {
            if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
                var m = context.getElementById( id );
                return m ? [ m ] : [];
            }
        };
        Expr.filter["ID"] = function( id ) {
            var attrId = id.replace( runescape, funescape );
            return function( elem ) {
                return elem.getAttribute("id") === attrId;
            };
        };
    } else {
        // Support: IE6/7
        // getElementById is not reliable as a find shortcut
        delete Expr.find["ID"];

        Expr.filter["ID"] =  function( id ) {
            var attrId = id.replace( runescape, funescape );
            return function( elem ) {
                var node = typeof elem.getAttributeNode !== "undefined" &&
                    elem.getAttributeNode("id");
                return node && node.value === attrId;
            };
        };
    }

    // Tag
    Expr.find["TAG"] = support.getElementsByTagName ?
        function( tag, context ) {
            if ( typeof context.getElementsByTagName !== "undefined" ) {
                return context.getElementsByTagName( tag );

            // DocumentFragment nodes don't have gEBTN
            } else if ( support.qsa ) {
                return context.querySelectorAll( tag );
            }
        } :

        function( tag, context ) {
            var elem,
                tmp = [],
                i = 0,
                // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                results = context.getElementsByTagName( tag );

            // Filter out possible comments
            if ( tag === "*" ) {
                while ( (elem = results[i++]) ) {
                    if ( elem.nodeType === 1 ) {
                        tmp.push( elem );
                    }
                }

                return tmp;
            }
            return results;
        };

    // Class
    Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
        if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
            return context.getElementsByClassName( className );
        }
    };

    /* QSA/matchesSelector
    ---------------------------------------------------------------------- */

    // QSA and matchesSelector support

    // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
    rbuggyMatches = [];

    // qSa(:focus) reports false when true (Chrome 21)
    // We allow this because of a bug in IE8/9 that throws an error
    // whenever `document.activeElement` is accessed on an iframe
    // So, we allow :focus to pass through QSA all the time to avoid the IE error
    // See http://bugs.jquery.com/ticket/13378
    rbuggyQSA = [];

    if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
        // Build QSA regex
        // Regex strategy adopted from Diego Perini
        assert(function( div ) {
            // Select is set to empty string on purpose
            // This is to test IE's treatment of not explicitly
            // setting a boolean content attribute,
            // since its presence should be enough
            // http://bugs.jquery.com/ticket/12359
            docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
                "<select id='" + expando + "-\r\\' msallowcapture=''>" +
                "<option selected=''></option></select>";

            // Support: IE8, Opera 11-12.16
            // Nothing should be selected when empty strings follow ^= or $= or *=
            // The test attribute must be unknown in Opera but "safe" for WinRT
            // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
            if ( div.querySelectorAll("[msallowcapture^='']").length ) {
                rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
            }

            // Support: IE8
            // Boolean attributes and "value" are not treated correctly
            if ( !div.querySelectorAll("[selected]").length ) {
                rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
            }

            // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
            if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
                rbuggyQSA.push("~=");
            }

            // Webkit/Opera - :checked should return selected option elements
            // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
            // IE8 throws error here and will not see later tests
            if ( !div.querySelectorAll(":checked").length ) {
                rbuggyQSA.push(":checked");
            }

            // Support: Safari 8+, iOS 8+
            // https://bugs.webkit.org/show_bug.cgi?id=136851
            // In-page `selector#id sibing-combinator selector` fails
            if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
                rbuggyQSA.push(".#.+[+~]");
            }
        });

        assert(function( div ) {
            // Support: Windows 8 Native Apps
            // The type and name attributes are restricted during .innerHTML assignment
            var input = document.createElement("input");
            input.setAttribute( "type", "hidden" );
            div.appendChild( input ).setAttribute( "name", "D" );

            // Support: IE8
            // Enforce case-sensitivity of name attribute
            if ( div.querySelectorAll("[name=d]").length ) {
                rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
            }

            // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
            // IE8 throws error here and will not see later tests
            if ( !div.querySelectorAll(":enabled").length ) {
                rbuggyQSA.push( ":enabled", ":disabled" );
            }

            // Opera 10-11 does not throw on post-comma invalid pseudos
            div.querySelectorAll("*,:x");
            rbuggyQSA.push(",.*:");
        });
    }

    if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
        docElem.webkitMatchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector) )) ) {

        assert(function( div ) {
            // Check to see if it's possible to do matchesSelector
            // on a disconnected node (IE 9)
            support.disconnectedMatch = matches.call( div, "div" );

            // This should fail with an exception
            // Gecko does not error, returns false instead
            matches.call( div, "[s!='']:x" );
            rbuggyMatches.push( "!=", pseudos );
        });
    }

    rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
    rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

    /* Contains
    ---------------------------------------------------------------------- */
    hasCompare = rnative.test( docElem.compareDocumentPosition );

    // Element contains another
    // Purposefully self-exclusive
    // As in, an element does not contain itself
    contains = hasCompare || rnative.test( docElem.contains ) ?
        function( a, b ) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a === bup || !!( bup && bup.nodeType === 1 && (
                adown.contains ?
                    adown.contains( bup ) :
                    a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
            ));
        } :
        function( a, b ) {
            if ( b ) {
                while ( (b = b.parentNode) ) {
                    if ( b === a ) {
                        return true;
                    }
                }
            }
            return false;
        };

    /* Sorting
    ---------------------------------------------------------------------- */

    // Document order sorting
    sortOrder = hasCompare ?
    function( a, b ) {

        // Flag for duplicate removal
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        // Sort on method existence if only one input has compareDocumentPosition
        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
        if ( compare ) {
            return compare;
        }

        // Calculate position if both inputs belong to the same document
        compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
            a.compareDocumentPosition( b ) :

            // Otherwise we know they are disconnected
            1;

        // Disconnected nodes
        if ( compare & 1 ||
            (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

            // Choose the first element that is related to our preferred document
            if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
                return -1;
            }
            if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
                return 1;
            }

            // Maintain original order
            return sortInput ?
                ( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
                0;
        }

        return compare & 4 ? -1 : 1;
    } :
    function( a, b ) {
        // Exit early if the nodes are identical
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [ a ],
            bp = [ b ];

        // Parentless nodes are either documents or disconnected
        if ( !aup || !bup ) {
            return a === document ? -1 :
                b === document ? 1 :
                aup ? -1 :
                bup ? 1 :
                sortInput ?
                ( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
                0;

        // If the nodes are siblings, we can do a quick check
        } else if ( aup === bup ) {
            return siblingCheck( a, b );
        }

        // Otherwise we need full lists of their ancestors for comparison
        cur = a;
        while ( (cur = cur.parentNode) ) {
            ap.unshift( cur );
        }
        cur = b;
        while ( (cur = cur.parentNode) ) {
            bp.unshift( cur );
        }

        // Walk down the tree looking for a discrepancy
        while ( ap[i] === bp[i] ) {
            i++;
        }

        return i ?
            // Do a sibling check if the nodes have a common ancestor
            siblingCheck( ap[i], bp[i] ) :

            // Otherwise nodes in our document sort first
            ap[i] === preferredDoc ? -1 :
            bp[i] === preferredDoc ? 1 :
            0;
    };

    return document;
};

Sizzle.matches = function( expr, elements ) {
    return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
    // Set document vars if needed
    if ( ( elem.ownerDocument || elem ) !== document ) {
        setDocument( elem );
    }

    // Make sure that attribute selectors are quoted
    expr = expr.replace( rattributeQuotes, "='$1']" );

    if ( support.matchesSelector && documentIsHTML &&
        !compilerCache[ expr + " " ] &&
        ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
        ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

        try {
            var ret = matches.call( elem, expr );

            // IE 9's matchesSelector returns false on disconnected nodes
            if ( ret || support.disconnectedMatch ||
                    // As well, disconnected nodes are said to be in a document
                    // fragment in IE 9
                    elem.document && elem.document.nodeType !== 11 ) {
                return ret;
            }
        } catch (e) {}
    }

    return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
    // Set document vars if needed
    if ( ( context.ownerDocument || context ) !== document ) {
        setDocument( context );
    }
    return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
    // Set document vars if needed
    if ( ( elem.ownerDocument || elem ) !== document ) {
        setDocument( elem );
    }

    var fn = Expr.attrHandle[ name.toLowerCase() ],
        // Don't get fooled by Object.prototype properties (jQuery #13807)
        val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
            fn( elem, name, !documentIsHTML ) :
            undefined;

    return val !== undefined ?
        val :
        support.attributes || !documentIsHTML ?
            elem.getAttribute( name ) :
            (val = elem.getAttributeNode(name)) && val.specified ?
                val.value :
                null;
};

Sizzle.error = function( msg ) {
    throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
    var elem,
        duplicates = [],
        j = 0,
        i = 0;

    // Unless we *know* we can detect duplicates, assume their presence
    hasDuplicate = !support.detectDuplicates;
    sortInput = !support.sortStable && results.slice( 0 );
    results.sort( sortOrder );

    if ( hasDuplicate ) {
        while ( (elem = results[i++]) ) {
            if ( elem === results[ i ] ) {
                j = duplicates.push( i );
            }
        }
        while ( j-- ) {
            results.splice( duplicates[ j ], 1 );
        }
    }

    // Clear input after sorting to release objects
    // See https://github.com/jquery/sizzle/pull/225
    sortInput = null;

    return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
    var node,
        ret = "",
        i = 0,
        nodeType = elem.nodeType;

    if ( !nodeType ) {
        // If no nodeType, this is expected to be an array
        while ( (node = elem[i++]) ) {
            // Do not traverse comment nodes
            ret += getText( node );
        }
    } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
        // Use textContent for elements
        // innerText usage removed for consistency of new lines (jQuery #11153)
        if ( typeof elem.textContent === "string" ) {
            return elem.textContent;
        } else {
            // Traverse its children
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                ret += getText( elem );
            }
        }
    } else if ( nodeType === 3 || nodeType === 4 ) {
        return elem.nodeValue;
    }
    // Do not include comment or processing instruction nodes

    return ret;
};

Expr = Sizzle.selectors = {

    // Can be adjusted by the user
    cacheLength: 50,

    createPseudo: markFunction,

    match: matchExpr,

    attrHandle: {},

    find: {},

    relative: {
        ">": { dir: "parentNode", first: true },
        " ": { dir: "parentNode" },
        "+": { dir: "previousSibling", first: true },
        "~": { dir: "previousSibling" }
    },

    preFilter: {
        "ATTR": function( match ) {
            match[1] = match[1].replace( runescape, funescape );

            // Move the given value to match[3] whether quoted or unquoted
            match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

            if ( match[2] === "~=" ) {
                match[3] = " " + match[3] + " ";
            }

            return match.slice( 0, 4 );
        },

        "CHILD": function( match ) {
            /* matches from matchExpr["CHILD"]
                1 type (only|nth|...)
                2 what (child|of-type)
                3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                4 xn-component of xn+y argument ([+-]?\d*n|)
                5 sign of xn-component
                6 x of xn-component
                7 sign of y-component
                8 y of y-component
            */
            match[1] = match[1].toLowerCase();

            if ( match[1].slice( 0, 3 ) === "nth" ) {
                // nth-* requires argument
                if ( !match[3] ) {
                    Sizzle.error( match[0] );
                }

                // numeric x and y parameters for Expr.filter.CHILD
                // remember that false/true cast respectively to 0/1
                match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

            // other types prohibit arguments
            } else if ( match[3] ) {
                Sizzle.error( match[0] );
            }

            return match;
        },

        "PSEUDO": function( match ) {
            var excess,
                unquoted = !match[6] && match[2];

            if ( matchExpr["CHILD"].test( match[0] ) ) {
                return null;
            }

            // Accept quoted arguments as-is
            if ( match[3] ) {
                match[2] = match[4] || match[5] || "";

            // Strip excess characters from unquoted arguments
            } else if ( unquoted && rpseudo.test( unquoted ) &&
                // Get excess from tokenize (recursively)
                (excess = tokenize( unquoted, true )) &&
                // advance to the next closing parenthesis
                (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                // excess is a negative index
                match[0] = match[0].slice( 0, excess );
                match[2] = unquoted.slice( 0, excess );
            }

            // Return only captures needed by the pseudo filter method (type and argument)
            return match.slice( 0, 3 );
        }
    },

    filter: {

        "TAG": function( nodeNameSelector ) {
            var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
            return nodeNameSelector === "*" ?
                function() { return true; } :
                function( elem ) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                };
        },

        "CLASS": function( className ) {
            var pattern = classCache[ className + " " ];

            return pattern ||
                (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                classCache( className, function( elem ) {
                    return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
                });
        },

        "ATTR": function( name, operator, check ) {
            return function( elem ) {
                var result = Sizzle.attr( elem, name );

                if ( result == null ) {
                    return operator === "!=";
                }
                if ( !operator ) {
                    return true;
                }

                result += "";

                return operator === "=" ? result === check :
                    operator === "!=" ? result !== check :
                    operator === "^=" ? check && result.indexOf( check ) === 0 :
                    operator === "*=" ? check && result.indexOf( check ) > -1 :
                    operator === "$=" ? check && result.slice( -check.length ) === check :
                    operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
                    operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                    false;
            };
        },

        "CHILD": function( type, what, argument, first, last ) {
            var simple = type.slice( 0, 3 ) !== "nth",
                forward = type.slice( -4 ) !== "last",
                ofType = what === "of-type";

            return first === 1 && last === 0 ?

                // Shortcut for :nth-*(n)
                function( elem ) {
                    return !!elem.parentNode;
                } :

                function( elem, context, xml ) {
                    var cache, uniqueCache, outerCache, node, nodeIndex, start,
                        dir = simple !== forward ? "nextSibling" : "previousSibling",
                        parent = elem.parentNode,
                        name = ofType && elem.nodeName.toLowerCase(),
                        useCache = !xml && !ofType,
                        diff = false;

                    if ( parent ) {

                        // :(first|last|only)-(child|of-type)
                        if ( simple ) {
                            while ( dir ) {
                                node = elem;
                                while ( (node = node[ dir ]) ) {
                                    if ( ofType ?
                                        node.nodeName.toLowerCase() === name :
                                        node.nodeType === 1 ) {

                                        return false;
                                    }
                                }
                                // Reverse direction for :only-* (if we haven't yet done so)
                                start = dir = type === "only" && !start && "nextSibling";
                            }
                            return true;
                        }

                        start = [ forward ? parent.firstChild : parent.lastChild ];

                        // non-xml :nth-child(...) stores cache data on `parent`
                        if ( forward && useCache ) {

                            // Seek `elem` from a previously-cached index

                            // ...in a gzip-friendly way
                            node = parent;
                            outerCache = node[ expando ] || (node[ expando ] = {});

                            // Support: IE <9 only
                            // Defend against cloned attroperties (jQuery gh-1709)
                            uniqueCache = outerCache[ node.uniqueID ] ||
                                (outerCache[ node.uniqueID ] = {});

                            cache = uniqueCache[ type ] || [];
                            nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
                            diff = nodeIndex && cache[ 2 ];
                            node = nodeIndex && parent.childNodes[ nodeIndex ];

                            while ( (node = ++nodeIndex && node && node[ dir ] ||

                                // Fallback to seeking `elem` from the start
                                (diff = nodeIndex = 0) || start.pop()) ) {

                                // When found, cache indexes on `parent` and break
                                if ( node.nodeType === 1 && ++diff && node === elem ) {
                                    uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
                                    break;
                                }
                            }

                        } else {
                            // Use previously-cached element index if available
                            if ( useCache ) {
                                // ...in a gzip-friendly way
                                node = elem;
                                outerCache = node[ expando ] || (node[ expando ] = {});

                                // Support: IE <9 only
                                // Defend against cloned attroperties (jQuery gh-1709)
                                uniqueCache = outerCache[ node.uniqueID ] ||
                                    (outerCache[ node.uniqueID ] = {});

                                cache = uniqueCache[ type ] || [];
                                nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
                                diff = nodeIndex;
                            }

                            // xml :nth-child(...)
                            // or :nth-last-child(...) or :nth(-last)?-of-type(...)
                            if ( diff === false ) {
                                // Use the same loop as above to seek `elem` from the start
                                while ( (node = ++nodeIndex && node && node[ dir ] ||
                                    (diff = nodeIndex = 0) || start.pop()) ) {

                                    if ( ( ofType ?
                                        node.nodeName.toLowerCase() === name :
                                        node.nodeType === 1 ) &&
                                        ++diff ) {

                                        // Cache the index of each encountered element
                                        if ( useCache ) {
                                            outerCache = node[ expando ] || (node[ expando ] = {});

                                            // Support: IE <9 only
                                            // Defend against cloned attroperties (jQuery gh-1709)
                                            uniqueCache = outerCache[ node.uniqueID ] ||
                                                (outerCache[ node.uniqueID ] = {});

                                            uniqueCache[ type ] = [ dirruns, diff ];
                                        }

                                        if ( node === elem ) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        // Incorporate the offset, then check against cycle size
                        diff -= last;
                        return diff === first || ( diff % first === 0 && diff / first >= 0 );
                    }
                };
        },

        "PSEUDO": function( pseudo, argument ) {
            // pseudo-class names are case-insensitive
            // http://www.w3.org/TR/selectors/#pseudo-classes
            // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
            // Remember that setFilters inherits from pseudos
            var args,
                fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                    Sizzle.error( "unsupported pseudo: " + pseudo );

            // The user may use createPseudo to indicate that
            // arguments are needed to create the filter function
            // just as Sizzle does
            if ( fn[ expando ] ) {
                return fn( argument );
            }

            // But maintain support for old signatures
            if ( fn.length > 1 ) {
                args = [ pseudo, pseudo, "", argument ];
                return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                    markFunction(function( seed, matches ) {
                        var idx,
                            matched = fn( seed, argument ),
                            i = matched.length;
                        while ( i-- ) {
                            idx = indexOf( seed, matched[i] );
                            seed[ idx ] = !( matches[ idx ] = matched[i] );
                        }
                    }) :
                    function( elem ) {
                        return fn( elem, 0, args );
                    };
            }

            return fn;
        }
    },

    pseudos: {
        // Potentially complex pseudos
        "not": markFunction(function( selector ) {
            // Trim the selector passed to compile
            // to avoid treating leading and trailing
            // spaces as combinators
            var input = [],
                results = [],
                matcher = compile( selector.replace( rtrim, "$1" ) );

            return matcher[ expando ] ?
                markFunction(function( seed, matches, context, xml ) {
                    var elem,
                        unmatched = matcher( seed, null, xml, [] ),
                        i = seed.length;

                    // Match elements unmatched by `matcher`
                    while ( i-- ) {
                        if ( (elem = unmatched[i]) ) {
                            seed[i] = !(matches[i] = elem);
                        }
                    }
                }) :
                function( elem, context, xml ) {
                    input[0] = elem;
                    matcher( input, null, xml, results );
                    // Don't keep the element (issue #299)
                    input[0] = null;
                    return !results.pop();
                };
        }),

        "has": markFunction(function( selector ) {
            return function( elem ) {
                return Sizzle( selector, elem ).length > 0;
            };
        }),

        "contains": markFunction(function( text ) {
            text = text.replace( runescape, funescape );
            return function( elem ) {
                return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
            };
        }),

        // "Whether an element is represented by a :lang() selector
        // is based solely on the element's language value
        // being equal to the identifier C,
        // or beginning with the identifier C immediately followed by "-".
        // The matching of C against the element's language value is performed case-insensitively.
        // The identifier C does not have to be a valid language name."
        // http://www.w3.org/TR/selectors/#lang-pseudo
        "lang": markFunction( function( lang ) {
            // lang value must be a valid identifier
            if ( !ridentifier.test(lang || "") ) {
                Sizzle.error( "unsupported lang: " + lang );
            }
            lang = lang.replace( runescape, funescape ).toLowerCase();
            return function( elem ) {
                var elemLang;
                do {
                    if ( (elemLang = documentIsHTML ?
                        elem.lang :
                        elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

                        elemLang = elemLang.toLowerCase();
                        return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                    }
                } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                return false;
            };
        }),

        // Miscellaneous
        "target": function( elem ) {
            var hash = window.location && window.location.hash;
            return hash && hash.slice( 1 ) === elem.id;
        },

        "root": function( elem ) {
            return elem === docElem;
        },

        "focus": function( elem ) {
            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },

        // Boolean properties
        "enabled": function( elem ) {
            return elem.disabled === false;
        },

        "disabled": function( elem ) {
            return elem.disabled === true;
        },

        "checked": function( elem ) {
            // In CSS3, :checked should return both checked and selected elements
            // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
            var nodeName = elem.nodeName.toLowerCase();
            return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
        },

        "selected": function( elem ) {
            // Accessing this property makes selected-by-default
            // options in Safari work properly
            if ( elem.parentNode ) {
                elem.parentNode.selectedIndex;
            }

            return elem.selected === true;
        },

        // Contents
        "empty": function( elem ) {
            // http://www.w3.org/TR/selectors/#empty-pseudo
            // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
            //   but not by others (comment: 8; processing instruction: 7; etc.)
            // nodeType < 6 works because attributes (2) do not appear as children
            for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                if ( elem.nodeType < 6 ) {
                    return false;
                }
            }
            return true;
        },

        "parent": function( elem ) {
            return !Expr.pseudos["empty"]( elem );
        },

        // Element/input types
        "header": function( elem ) {
            return rheader.test( elem.nodeName );
        },

        "input": function( elem ) {
            return rinputs.test( elem.nodeName );
        },

        "button": function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === "button" || name === "button";
        },

        "text": function( elem ) {
            var attr;
            return elem.nodeName.toLowerCase() === "input" &&
                elem.type === "text" &&

                // Support: IE<8
                // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
        },

        // Position-in-collection
        "first": createPositionalPseudo(function() {
            return [ 0 ];
        }),

        "last": createPositionalPseudo(function( matchIndexes, length ) {
            return [ length - 1 ];
        }),

        "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
            return [ argument < 0 ? argument + length : argument ];
        }),

        "even": createPositionalPseudo(function( matchIndexes, length ) {
            var i = 0;
            for ( ; i < length; i += 2 ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "odd": createPositionalPseudo(function( matchIndexes, length ) {
            var i = 1;
            for ( ; i < length; i += 2 ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
            var i = argument < 0 ? argument + length : argument;
            for ( ; --i >= 0; ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        }),

        "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
            var i = argument < 0 ? argument + length : argument;
            for ( ; ++i < length; ) {
                matchIndexes.push( i );
            }
            return matchIndexes;
        })
    }
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
    Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
    var matched, match, tokens, type,
        soFar, groups, preFilters,
        cached = tokenCache[ selector + " " ];

    if ( cached ) {
        return parseOnly ? 0 : cached.slice( 0 );
    }

    soFar = selector;
    groups = [];
    preFilters = Expr.preFilter;

    while ( soFar ) {

        // Comma and first run
        if ( !matched || (match = rcomma.exec( soFar )) ) {
            if ( match ) {
                // Don't consume trailing commas as valid
                soFar = soFar.slice( match[0].length ) || soFar;
            }
            groups.push( (tokens = []) );
        }

        matched = false;

        // Combinators
        if ( (match = rcombinators.exec( soFar )) ) {
            matched = match.shift();
            tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match[0].replace( rtrim, " " )
            });
            soFar = soFar.slice( matched.length );
        }

        // Filters
        for ( type in Expr.filter ) {
            if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                (match = preFilters[ type ]( match ))) ) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    type: type,
                    matches: match
                });
                soFar = soFar.slice( matched.length );
            }
        }

        if ( !matched ) {
            break;
        }
    }

    // Return the length of the invalid excess
    // if we're just parsing
    // Otherwise, throw an error or return tokens
    return parseOnly ?
        soFar.length :
        soFar ?
            Sizzle.error( selector ) :
            // Cache the tokens
            tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
    var i = 0,
        len = tokens.length,
        selector = "";
    for ( ; i < len; i++ ) {
        selector += tokens[i].value;
    }
    return selector;
}

function addCombinator( matcher, combinator, base ) {
    var dir = combinator.dir,
        checkNonElements = base && dir === "parentNode",
        doneName = done++;

    return combinator.first ?
        // Check against closest ancestor/preceding element
        function( elem, context, xml ) {
            while ( (elem = elem[ dir ]) ) {
                if ( elem.nodeType === 1 || checkNonElements ) {
                    return matcher( elem, context, xml );
                }
            }
        } :

        // Check against all ancestor/preceding elements
        function( elem, context, xml ) {
            var oldCache, uniqueCache, outerCache,
                newCache = [ dirruns, doneName ];

            // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
            if ( xml ) {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        if ( matcher( elem, context, xml ) ) {
                            return true;
                        }
                    }
                }
            } else {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        outerCache = elem[ expando ] || (elem[ expando ] = {});

                        // Support: IE <9 only
                        // Defend against cloned attroperties (jQuery gh-1709)
                        uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

                        if ( (oldCache = uniqueCache[ dir ]) &&
                            oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

                            // Assign to newCache so results back-propagate to previous elements
                            return (newCache[ 2 ] = oldCache[ 2 ]);
                        } else {
                            // Reuse newcache so results back-propagate to previous elements
                            uniqueCache[ dir ] = newCache;

                            // A match means we're done; a fail means we have to keep checking
                            if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
                                return true;
                            }
                        }
                    }
                }
            }
        };
}

function elementMatcher( matchers ) {
    return matchers.length > 1 ?
        function( elem, context, xml ) {
            var i = matchers.length;
            while ( i-- ) {
                if ( !matchers[i]( elem, context, xml ) ) {
                    return false;
                }
            }
            return true;
        } :
        matchers[0];
}

function multipleContexts( selector, contexts, results ) {
    var i = 0,
        len = contexts.length;
    for ( ; i < len; i++ ) {
        Sizzle( selector, contexts[i], results );
    }
    return results;
}

function condense( unmatched, map, filter, context, xml ) {
    var elem,
        newUnmatched = [],
        i = 0,
        len = unmatched.length,
        mapped = map != null;

    for ( ; i < len; i++ ) {
        if ( (elem = unmatched[i]) ) {
            if ( !filter || filter( elem, context, xml ) ) {
                newUnmatched.push( elem );
                if ( mapped ) {
                    map.push( i );
                }
            }
        }
    }

    return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    if ( postFilter && !postFilter[ expando ] ) {
        postFilter = setMatcher( postFilter );
    }
    if ( postFinder && !postFinder[ expando ] ) {
        postFinder = setMatcher( postFinder, postSelector );
    }
    return markFunction(function( seed, results, context, xml ) {
        var temp, i, elem,
            preMap = [],
            postMap = [],
            preexisting = results.length,

            // Get initial elements from seed or context
            elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

            // Prefilter to get matcher input, preserving a map for seed-results synchronization
            matcherIn = preFilter && ( seed || !selector ) ?
                condense( elems, preMap, preFilter, context, xml ) :
                elems,

            matcherOut = matcher ?
                // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                    // ...intermediate processing is necessary
                    [] :

                    // ...otherwise use results directly
                    results :
                matcherIn;

        // Find primary matches
        if ( matcher ) {
            matcher( matcherIn, matcherOut, context, xml );
        }

        // Apply postFilter
        if ( postFilter ) {
            temp = condense( matcherOut, postMap );
            postFilter( temp, [], context, xml );

            // Un-match failing elements by moving them back to matcherIn
            i = temp.length;
            while ( i-- ) {
                if ( (elem = temp[i]) ) {
                    matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                }
            }
        }

        if ( seed ) {
            if ( postFinder || preFilter ) {
                if ( postFinder ) {
                    // Get the final matcherOut by condensing this intermediate into postFinder contexts
                    temp = [];
                    i = matcherOut.length;
                    while ( i-- ) {
                        if ( (elem = matcherOut[i]) ) {
                            // Restore matcherIn since elem is not yet a final match
                            temp.push( (matcherIn[i] = elem) );
                        }
                    }
                    postFinder( null, (matcherOut = []), temp, xml );
                }

                // Move matched elements from seed to results to keep them synchronized
                i = matcherOut.length;
                while ( i-- ) {
                    if ( (elem = matcherOut[i]) &&
                        (temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

                        seed[temp] = !(results[temp] = elem);
                    }
                }
            }

        // Add elements to results, through postFinder if defined
        } else {
            matcherOut = condense(
                matcherOut === results ?
                    matcherOut.splice( preexisting, matcherOut.length ) :
                    matcherOut
            );
            if ( postFinder ) {
                postFinder( null, results, matcherOut, xml );
            } else {
                push.apply( results, matcherOut );
            }
        }
    });
}

function matcherFromTokens( tokens ) {
    var checkContext, matcher, j,
        len = tokens.length,
        leadingRelative = Expr.relative[ tokens[0].type ],
        implicitRelative = leadingRelative || Expr.relative[" "],
        i = leadingRelative ? 1 : 0,

        // The foundational matcher ensures that elements are reachable from top-level context(s)
        matchContext = addCombinator( function( elem ) {
            return elem === checkContext;
        }, implicitRelative, true ),
        matchAnyContext = addCombinator( function( elem ) {
            return indexOf( checkContext, elem ) > -1;
        }, implicitRelative, true ),
        matchers = [ function( elem, context, xml ) {
            var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                (checkContext = context).nodeType ?
                    matchContext( elem, context, xml ) :
                    matchAnyContext( elem, context, xml ) );
            // Avoid hanging onto element (issue #299)
            checkContext = null;
            return ret;
        } ];

    for ( ; i < len; i++ ) {
        if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
            matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
        } else {
            matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

            // Return special upon seeing a positional matcher
            if ( matcher[ expando ] ) {
                // Find the next relative operator (if any) for proper handling
                j = ++i;
                for ( ; j < len; j++ ) {
                    if ( Expr.relative[ tokens[j].type ] ) {
                        break;
                    }
                }
                return setMatcher(
                    i > 1 && elementMatcher( matchers ),
                    i > 1 && toSelector(
                        // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                        tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
                    ).replace( rtrim, "$1" ),
                    matcher,
                    i < j && matcherFromTokens( tokens.slice( i, j ) ),
                    j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                    j < len && toSelector( tokens )
                );
            }
            matchers.push( matcher );
        }
    }

    return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    var bySet = setMatchers.length > 0,
        byElement = elementMatchers.length > 0,
        superMatcher = function( seed, context, xml, results, outermost ) {
            var elem, j, matcher,
                matchedCount = 0,
                i = "0",
                unmatched = seed && [],
                setMatched = [],
                contextBackup = outermostContext,
                // We must always have either seed elements or outermost context
                elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
                // Use integer dirruns iff this is the outermost matcher
                dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                len = elems.length;

            if ( outermost ) {
                outermostContext = context === document || context || outermost;
            }

            // Add elements passing elementMatchers directly to results
            // Support: IE<9, Safari
            // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
            for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
                if ( byElement && elem ) {
                    j = 0;
                    if ( !context && elem.ownerDocument !== document ) {
                        setDocument( elem );
                        xml = !documentIsHTML;
                    }
                    while ( (matcher = elementMatchers[j++]) ) {
                        if ( matcher( elem, context || document, xml) ) {
                            results.push( elem );
                            break;
                        }
                    }
                    if ( outermost ) {
                        dirruns = dirrunsUnique;
                    }
                }

                // Track unmatched elements for set filters
                if ( bySet ) {
                    // They will have gone through all possible matchers
                    if ( (elem = !matcher && elem) ) {
                        matchedCount--;
                    }

                    // Lengthen the array for every element, matched or not
                    if ( seed ) {
                        unmatched.push( elem );
                    }
                }
            }

            // `i` is now the count of elements visited above, and adding it to `matchedCount`
            // makes the latter nonnegative.
            matchedCount += i;

            // Apply set filters to unmatched elements
            // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
            // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
            // no element matchers and no seed.
            // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
            // case, which will result in a "00" `matchedCount` that differs from `i` but is also
            // numerically zero.
            if ( bySet && i !== matchedCount ) {
                j = 0;
                while ( (matcher = setMatchers[j++]) ) {
                    matcher( unmatched, setMatched, context, xml );
                }

                if ( seed ) {
                    // Reintegrate element matches to eliminate the need for sorting
                    if ( matchedCount > 0 ) {
                        while ( i-- ) {
                            if ( !(unmatched[i] || setMatched[i]) ) {
                                setMatched[i] = pop.call( results );
                            }
                        }
                    }

                    // Discard index placeholder values to get only actual matches
                    setMatched = condense( setMatched );
                }

                // Add matches to results
                push.apply( results, setMatched );

                // Seedless set matches succeeding multiple successful matchers stipulate sorting
                if ( outermost && !seed && setMatched.length > 0 &&
                    ( matchedCount + setMatchers.length ) > 1 ) {

                    Sizzle.uniqueSort( results );
                }
            }

            // Override manipulation of globals by nested matchers
            if ( outermost ) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
            }

            return unmatched;
        };

    return bySet ?
        markFunction( superMatcher ) :
        superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
    var i,
        setMatchers = [],
        elementMatchers = [],
        cached = compilerCache[ selector + " " ];

    if ( !cached ) {
        // Generate a function of recursive functions that can be used to check each element
        if ( !match ) {
            match = tokenize( selector );
        }
        i = match.length;
        while ( i-- ) {
            cached = matcherFromTokens( match[i] );
            if ( cached[ expando ] ) {
                setMatchers.push( cached );
            } else {
                elementMatchers.push( cached );
            }
        }

        // Cache the compiled function
        cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

        // Save selector and tokenization
        cached.selector = selector;
    }
    return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
    var i, tokens, token, type, find,
        compiled = typeof selector === "function" && selector,
        match = !seed && tokenize( (selector = compiled.selector || selector) );

    results = results || [];

    // Try to minimize operations if there is only one selector in the list and no seed
    // (the latter of which guarantees us context)
    if ( match.length === 1 ) {

        // Reduce context if the leading compound selector is an ID
        tokens = match[0] = match[0].slice( 0 );
        if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                support.getById && context.nodeType === 9 && documentIsHTML &&
                Expr.relative[ tokens[1].type ] ) {

            context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
            if ( !context ) {
                return results;

            // Precompiled matchers will still verify ancestry, so step up a level
            } else if ( compiled ) {
                context = context.parentNode;
            }

            selector = selector.slice( tokens.shift().value.length );
        }

        // Fetch a seed set for right-to-left matching
        i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
        while ( i-- ) {
            token = tokens[i];

            // Abort if we hit a combinator
            if ( Expr.relative[ (type = token.type) ] ) {
                break;
            }
            if ( (find = Expr.find[ type ]) ) {
                // Search, expanding context for leading sibling combinators
                if ( (seed = find(
                    token.matches[0].replace( runescape, funescape ),
                    rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
                )) ) {

                    // If seed is empty or no tokens remain, we can return early
                    tokens.splice( i, 1 );
                    selector = seed.length && toSelector( tokens );
                    if ( !selector ) {
                        push.apply( results, seed );
                        return results;
                    }

                    break;
                }
            }
        }
    }

    // Compile and execute a filtering function if one is not provided
    // Provide `match` to avoid retokenization if we modified the selector above
    ( compiled || compile( selector, match ) )(
        seed,
        context,
        !documentIsHTML,
        results,
        !context || rsibling.test( selector ) && testContext( context.parentNode ) || context
    );
    return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
    // Should return 1, but returns 4 (following)
    return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
    div.innerHTML = "<a href='#'></a>";
    return div.firstChild.getAttribute("href") === "#" ;
}) ) {
    addHandle( "type|href|height|width", function( elem, name, isXML ) {
        if ( !isXML ) {
            return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
        }
    });
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
    div.innerHTML = "<input/>";
    div.firstChild.setAttribute( "value", "" );
    return div.firstChild.getAttribute( "value" ) === "";
}) ) {
    addHandle( "value", function( elem, name, isXML ) {
        if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
            return elem.defaultValue;
        }
    });
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
    return div.getAttribute("disabled") == null;
}) ) {
    addHandle( booleans, function( elem, name, isXML ) {
        var val;
        if ( !isXML ) {
            return elem[ name ] === true ? name.toLowerCase() :
                    (val = elem.getAttributeNode( name )) && val.specified ?
                    val.value :
                null;
        }
    });
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
    var matched = [],
        truncate = until !== undefined;

    while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
        if ( elem.nodeType === 1 ) {
            if ( truncate && jQuery( elem ).is( until ) ) {
                break;
            }
            matched.push( elem );
        }
    }
    return matched;
};


var siblings = function( n, elem ) {
    var matched = [];

    for ( ; n; n = n.nextSibling ) {
        if ( n.nodeType === 1 && n !== elem ) {
            matched.push( n );
        }
    }

    return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
    if ( jQuery.isFunction( qualifier ) ) {
        return jQuery.grep( elements, function( elem, i ) {
            /* jshint -W018 */
            return !!qualifier.call( elem, i, elem ) !== not;
        } );

    }

    if ( qualifier.nodeType ) {
        return jQuery.grep( elements, function( elem ) {
            return ( elem === qualifier ) !== not;
        } );

    }

    if ( typeof qualifier === "string" ) {
        if ( risSimple.test( qualifier ) ) {
            return jQuery.filter( qualifier, elements, not );
        }

        qualifier = jQuery.filter( qualifier, elements );
    }

    return jQuery.grep( elements, function( elem ) {
        return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
    } );
}

jQuery.filter = function( expr, elems, not ) {
    var elem = elems[ 0 ];

    if ( not ) {
        expr = ":not(" + expr + ")";
    }

    return elems.length === 1 && elem.nodeType === 1 ?
        jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
        jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
            return elem.nodeType === 1;
        } ) );
};

jQuery.fn.extend( {
    find: function( selector ) {
        var i,
            len = this.length,
            ret = [],
            self = this;

        if ( typeof selector !== "string" ) {
            return this.pushStack( jQuery( selector ).filter( function() {
                for ( i = 0; i < len; i++ ) {
                    if ( jQuery.contains( self[ i ], this ) ) {
                        return true;
                    }
                }
            } ) );
        }

        for ( i = 0; i < len; i++ ) {
            jQuery.find( selector, self[ i ], ret );
        }

        // Needed because $( selector, context ) becomes $( context ).find( selector )
        ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
        ret.selector = this.selector ? this.selector + " " + selector : selector;
        return ret;
    },
    filter: function( selector ) {
        return this.pushStack( winnow( this, selector || [], false ) );
    },
    not: function( selector ) {
        return this.pushStack( winnow( this, selector || [], true ) );
    },
    is: function( selector ) {
        return !!winnow(
            this,

            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test( selector ) ?
                jQuery( selector ) :
                selector || [],
            false
        ).length;
    }
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

    // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

    init = jQuery.fn.init = function( selector, context, root ) {
        var match, elem;

        // HANDLE: $(""), $(null), $(undefined), $(false)
        if ( !selector ) {
            return this;
        }

        // Method init() accepts an alternate rootjQuery
        // so migrate can support jQuery.sub (gh-2101)
        root = root || rootjQuery;

        // Handle HTML strings
        if ( typeof selector === "string" ) {
            if ( selector[ 0 ] === "<" &&
                selector[ selector.length - 1 ] === ">" &&
                selector.length >= 3 ) {

                // Assume that strings that start and end with <> are HTML and skip the regex check
                match = [ null, selector, null ];

            } else {
                match = rquickExpr.exec( selector );
            }

            // Match html or make sure no context is specified for #id
            if ( match && ( match[ 1 ] || !context ) ) {

                // HANDLE: $(html) -> $(array)
                if ( match[ 1 ] ) {
                    context = context instanceof jQuery ? context[ 0 ] : context;

                    // Option to run scripts is true for back-compat
                    // Intentionally let the error be thrown if parseHTML is not present
                    jQuery.merge( this, jQuery.parseHTML(
                        match[ 1 ],
                        context && context.nodeType ? context.ownerDocument || context : document,
                        true
                    ) );

                    // HANDLE: $(html, props)
                    if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
                        for ( match in context ) {

                            // Properties of context are called as methods if possible
                            if ( jQuery.isFunction( this[ match ] ) ) {
                                this[ match ]( context[ match ] );

                            // ...and otherwise set as attributes
                            } else {
                                this.attr( match, context[ match ] );
                            }
                        }
                    }

                    return this;

                // HANDLE: $(#id)
                } else {
                    elem = document.getElementById( match[ 2 ] );

                    // Support: Blackberry 4.6
                    // gEBID returns nodes no longer in the document (#6963)
                    if ( elem && elem.parentNode ) {

                        // Inject the element directly into the jQuery object
                        this.length = 1;
                        this[ 0 ] = elem;
                    }

                    this.context = document;
                    this.selector = selector;
                    return this;
                }

            // HANDLE: $(expr, $(...))
            } else if ( !context || context.jquery ) {
                return ( context || root ).find( selector );

            // HANDLE: $(expr, context)
            // (which is just equivalent to: $(context).find(expr)
            } else {
                return this.constructor( context ).find( selector );
            }

        // HANDLE: $(DOMElement)
        } else if ( selector.nodeType ) {
            this.context = this[ 0 ] = selector;
            this.length = 1;
            return this;

        // HANDLE: $(function)
        // Shortcut for document ready
        } else if ( jQuery.isFunction( selector ) ) {
            return root.ready !== undefined ?
                root.ready( selector ) :

                // Execute immediately if ready is not present
                selector( jQuery );
        }

        if ( selector.selector !== undefined ) {
            this.selector = selector.selector;
            this.context = selector.context;
        }

        return jQuery.makeArray( selector, this );
    };

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

    // Methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };

jQuery.fn.extend( {
    has: function( target ) {
        var targets = jQuery( target, this ),
            l = targets.length;

        return this.filter( function() {
            var i = 0;
            for ( ; i < l; i++ ) {
                if ( jQuery.contains( this, targets[ i ] ) ) {
                    return true;
                }
            }
        } );
    },

    closest: function( selectors, context ) {
        var cur,
            i = 0,
            l = this.length,
            matched = [],
            pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
                jQuery( selectors, context || this.context ) :
                0;

        for ( ; i < l; i++ ) {
            for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

                // Always skip document fragments
                if ( cur.nodeType < 11 && ( pos ?
                    pos.index( cur ) > -1 :

                    // Don't pass non-elements to Sizzle
                    cur.nodeType === 1 &&
                        jQuery.find.matchesSelector( cur, selectors ) ) ) {

                    matched.push( cur );
                    break;
                }
            }
        }

        return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
    },

    // Determine the position of an element within the set
    index: function( elem ) {

        // No argument, return index in parent
        if ( !elem ) {
            return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
        }

        // Index in selector
        if ( typeof elem === "string" ) {
            return indexOf.call( jQuery( elem ), this[ 0 ] );
        }

        // Locate the position of the desired element
        return indexOf.call( this,

            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[ 0 ] : elem
        );
    },

    add: function( selector, context ) {
        return this.pushStack(
            jQuery.uniqueSort(
                jQuery.merge( this.get(), jQuery( selector, context ) )
            )
        );
    },

    addBack: function( selector ) {
        return this.add( selector == null ?
            this.prevObject : this.prevObject.filter( selector )
        );
    }
} );

function sibling( cur, dir ) {
    while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
    return cur;
}

jQuery.each( {
    parent: function( elem ) {
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function( elem ) {
        return dir( elem, "parentNode" );
    },
    parentsUntil: function( elem, i, until ) {
        return dir( elem, "parentNode", until );
    },
    next: function( elem ) {
        return sibling( elem, "nextSibling" );
    },
    prev: function( elem ) {
        return sibling( elem, "previousSibling" );
    },
    nextAll: function( elem ) {
        return dir( elem, "nextSibling" );
    },
    prevAll: function( elem ) {
        return dir( elem, "previousSibling" );
    },
    nextUntil: function( elem, i, until ) {
        return dir( elem, "nextSibling", until );
    },
    prevUntil: function( elem, i, until ) {
        return dir( elem, "previousSibling", until );
    },
    siblings: function( elem ) {
        return siblings( ( elem.parentNode || {} ).firstChild, elem );
    },
    children: function( elem ) {
        return siblings( elem.firstChild );
    },
    contents: function( elem ) {
        return elem.contentDocument || jQuery.merge( [], elem.childNodes );
    }
}, function( name, fn ) {
    jQuery.fn[ name ] = function( until, selector ) {
        var matched = jQuery.map( this, fn, until );

        if ( name.slice( -5 ) !== "Until" ) {
            selector = until;
        }

        if ( selector && typeof selector === "string" ) {
            matched = jQuery.filter( selector, matched );
        }

        if ( this.length > 1 ) {

            // Remove duplicates
            if ( !guaranteedUnique[ name ] ) {
                jQuery.uniqueSort( matched );
            }

            // Reverse order for parents* and prev-derivatives
            if ( rparentsprev.test( name ) ) {
                matched.reverse();
            }
        }

        return this.pushStack( matched );
    };
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
    var object = {};
    jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
        object[ flag ] = true;
    } );
    return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  options: an optional list of space-separated options that will change how
 *          the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *  once:           will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:         will keep track of previous values and will call any callback added
 *                  after the list has been fired right away with the latest "memorized"
 *                  values (like a Deferred)
 *
 *  unique:         will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:    interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    options = typeof options === "string" ?
        createOptions( options ) :
        jQuery.extend( {}, options );

    var // Flag to know if list is currently firing
        firing,

        // Last fire value for non-forgettable lists
        memory,

        // Flag to know if list was already fired
        fired,

        // Flag to prevent firing
        locked,

        // Actual callback list
        list = [],

        // Queue of execution data for repeatable lists
        queue = [],

        // Index of currently firing callback (modified by add/remove as needed)
        firingIndex = -1,

        // Fire callbacks
        fire = function() {

            // Enforce single-firing
            locked = options.once;

            // Execute callbacks for all pending executions,
            // respecting firingIndex overrides and runtime changes
            fired = firing = true;
            for ( ; queue.length; firingIndex = -1 ) {
                memory = queue.shift();
                while ( ++firingIndex < list.length ) {

                    // Run callback and check for early termination
                    if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
                        options.stopOnFalse ) {

                        // Jump to end and forget the data so .add doesn't re-fire
                        firingIndex = list.length;
                        memory = false;
                    }
                }
            }

            // Forget the data if we're done with it
            if ( !options.memory ) {
                memory = false;
            }

            firing = false;

            // Clean up if we're done firing for good
            if ( locked ) {

                // Keep an empty list if we have data for future add calls
                if ( memory ) {
                    list = [];

                // Otherwise, this object is spent
                } else {
                    list = "";
                }
            }
        },

        // Actual Callbacks object
        self = {

            // Add a callback or a collection of callbacks to the list
            add: function() {
                if ( list ) {

                    // If we have memory from a past run, we should fire after adding
                    if ( memory && !firing ) {
                        firingIndex = list.length - 1;
                        queue.push( memory );
                    }

                    ( function add( args ) {
                        jQuery.each( args, function( _, arg ) {
                            if ( jQuery.isFunction( arg ) ) {
                                if ( !options.unique || !self.has( arg ) ) {
                                    list.push( arg );
                                }
                            } else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

                                // Inspect recursively
                                add( arg );
                            }
                        } );
                    } )( arguments );

                    if ( memory && !firing ) {
                        fire();
                    }
                }
                return this;
            },

            // Remove a callback from the list
            remove: function() {
                jQuery.each( arguments, function( _, arg ) {
                    var index;
                    while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                        list.splice( index, 1 );

                        // Handle firing indexes
                        if ( index <= firingIndex ) {
                            firingIndex--;
                        }
                    }
                } );
                return this;
            },

            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function( fn ) {
                return fn ?
                    jQuery.inArray( fn, list ) > -1 :
                    list.length > 0;
            },

            // Remove all callbacks from the list
            empty: function() {
                if ( list ) {
                    list = [];
                }
                return this;
            },

            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function() {
                locked = queue = [];
                list = memory = "";
                return this;
            },
            disabled: function() {
                return !list;
            },

            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function() {
                locked = queue = [];
                if ( !memory ) {
                    list = memory = "";
                }
                return this;
            },
            locked: function() {
                return !!locked;
            },

            // Call all callbacks with the given context and arguments
            fireWith: function( context, args ) {
                if ( !locked ) {
                    args = args || [];
                    args = [ context, args.slice ? args.slice() : args ];
                    queue.push( args );
                    if ( !firing ) {
                        fire();
                    }
                }
                return this;
            },

            // Call all the callbacks with the given arguments
            fire: function() {
                self.fireWith( this, arguments );
                return this;
            },

            // To know if the callbacks have already been called at least once
            fired: function() {
                return !!fired;
            }
        };

    return self;
};


jQuery.extend( {

    Deferred: function( func ) {
        var tuples = [

                // action, add listener, listener list, final state
                [ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
                [ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
                [ "notify", "progress", jQuery.Callbacks( "memory" ) ]
            ],
            state = "pending",
            promise = {
                state: function() {
                    return state;
                },
                always: function() {
                    deferred.done( arguments ).fail( arguments );
                    return this;
                },
                then: function( /* fnDone, fnFail, fnProgress */ ) {
                    var fns = arguments;
                    return jQuery.Deferred( function( newDefer ) {
                        jQuery.each( tuples, function( i, tuple ) {
                            var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

                            // deferred[ done | fail | progress ] for forwarding actions to newDefer
                            deferred[ tuple[ 1 ] ]( function() {
                                var returned = fn && fn.apply( this, arguments );
                                if ( returned && jQuery.isFunction( returned.promise ) ) {
                                    returned.promise()
                                        .progress( newDefer.notify )
                                        .done( newDefer.resolve )
                                        .fail( newDefer.reject );
                                } else {
                                    newDefer[ tuple[ 0 ] + "With" ](
                                        this === promise ? newDefer.promise() : this,
                                        fn ? [ returned ] : arguments
                                    );
                                }
                            } );
                        } );
                        fns = null;
                    } ).promise();
                },

                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function( obj ) {
                    return obj != null ? jQuery.extend( obj, promise ) : promise;
                }
            },
            deferred = {};

        // Keep pipe for back-compat
        promise.pipe = promise.then;

        // Add list-specific methods
        jQuery.each( tuples, function( i, tuple ) {
            var list = tuple[ 2 ],
                stateString = tuple[ 3 ];

            // promise[ done | fail | progress ] = list.add
            promise[ tuple[ 1 ] ] = list.add;

            // Handle state
            if ( stateString ) {
                list.add( function() {

                    // state = [ resolved | rejected ]
                    state = stateString;

                // [ reject_list | resolve_list ].disable; progress_list.lock
                }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
            }

            // deferred[ resolve | reject | notify ]
            deferred[ tuple[ 0 ] ] = function() {
                deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
                return this;
            };
            deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
        } );

        // Make the deferred a promise
        promise.promise( deferred );

        // Call given func if any
        if ( func ) {
            func.call( deferred, deferred );
        }

        // All done!
        return deferred;
    },

    // Deferred helper
    when: function( subordinate /* , ..., subordinateN */ ) {
        var i = 0,
            resolveValues = slice.call( arguments ),
            length = resolveValues.length,

            // the count of uncompleted subordinates
            remaining = length !== 1 ||
                ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

            // the master Deferred.
            // If resolveValues consist of only a single Deferred, just use that.
            deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

            // Update function for both resolve and progress values
            updateFunc = function( i, contexts, values ) {
                return function( value ) {
                    contexts[ i ] = this;
                    values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
                    if ( values === progressValues ) {
                        deferred.notifyWith( contexts, values );
                    } else if ( !( --remaining ) ) {
                        deferred.resolveWith( contexts, values );
                    }
                };
            },

            progressValues, progressContexts, resolveContexts;

        // Add listeners to Deferred subordinates; treat others as resolved
        if ( length > 1 ) {
            progressValues = new Array( length );
            progressContexts = new Array( length );
            resolveContexts = new Array( length );
            for ( ; i < length; i++ ) {
                if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
                    resolveValues[ i ].promise()
                        .progress( updateFunc( i, progressContexts, progressValues ) )
                        .done( updateFunc( i, resolveContexts, resolveValues ) )
                        .fail( deferred.reject );
                } else {
                    --remaining;
                }
            }
        }

        // If we're not waiting on anything, resolve the master
        if ( !remaining ) {
            deferred.resolveWith( resolveContexts, resolveValues );
        }

        return deferred.promise();
    }
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

    // Add the callback
    jQuery.ready.promise().done( fn );

    return this;
};

jQuery.extend( {

    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Hold (or release) the ready event
    holdReady: function( hold ) {
        if ( hold ) {
            jQuery.readyWait++;
        } else {
            jQuery.ready( true );
        }
    },

    // Handle when the DOM is ready
    ready: function( wait ) {

        // Abort if there are pending holds or we're already ready
        if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
            return;
        }

        // Remember that the DOM is ready
        jQuery.isReady = true;

        // If a normal DOM Ready event fired, decrement, and wait if need be
        if ( wait !== true && --jQuery.readyWait > 0 ) {
            return;
        }

        // If there are functions bound, to execute
        readyList.resolveWith( document, [ jQuery ] );

        // Trigger any bound ready events
        if ( jQuery.fn.triggerHandler ) {
            jQuery( document ).triggerHandler( "ready" );
            jQuery( document ).off( "ready" );
        }
    }
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
    document.removeEventListener( "DOMContentLoaded", completed );
    window.removeEventListener( "load", completed );
    jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
    if ( !readyList ) {

        readyList = jQuery.Deferred();

        // Catch cases where $(document).ready() is called
        // after the browser event has already occurred.
        // Support: IE9-10 only
        // Older IE sometimes signals "interactive" too soon
        if ( document.readyState === "complete" ||
            ( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

            // Handle it asynchronously to allow scripts the opportunity to delay ready
            window.setTimeout( jQuery.ready );

        } else {

            // Use the handy event callback
            document.addEventListener( "DOMContentLoaded", completed );

            // A fallback to window.onload, that will always work
            window.addEventListener( "load", completed );
        }
    }
    return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
    var i = 0,
        len = elems.length,
        bulk = key == null;

    // Sets many values
    if ( jQuery.type( key ) === "object" ) {
        chainable = true;
        for ( i in key ) {
            access( elems, fn, i, key[ i ], true, emptyGet, raw );
        }

    // Sets one value
    } else if ( value !== undefined ) {
        chainable = true;

        if ( !jQuery.isFunction( value ) ) {
            raw = true;
        }

        if ( bulk ) {

            // Bulk operations run against the entire set
            if ( raw ) {
                fn.call( elems, value );
                fn = null;

            // ...except when executing function values
            } else {
                bulk = fn;
                fn = function( elem, key, value ) {
                    return bulk.call( jQuery( elem ), value );
                };
            }
        }

        if ( fn ) {
            for ( ; i < len; i++ ) {
                fn(
                    elems[ i ], key, raw ?
                    value :
                    value.call( elems[ i ], i, fn( elems[ i ], key ) )
                );
            }
        }
    }

    return chainable ?
        elems :

        // Gets
        bulk ?
            fn.call( elems ) :
            len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

    // Accepts only:
    //  - Node
    //    - Node.ELEMENT_NODE
    //    - Node.DOCUMENT_NODE
    //  - Object
    //    - Any
    /* jshint -W018 */
    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
    this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

    register: function( owner, initial ) {
        var value = initial || {};

        // If it is a node unlikely to be stringify-ed or looped over
        // use plain assignment
        if ( owner.nodeType ) {
            owner[ this.expando ] = value;

        // Otherwise secure it in a non-enumerable, non-writable property
        // configurability must be true to allow the property to be
        // deleted with the delete operator
        } else {
            Object.defineProperty( owner, this.expando, {
                value: value,
                writable: true,
                configurable: true
            } );
        }
        return owner[ this.expando ];
    },
    cache: function( owner ) {

        // We can accept data for non-element nodes in modern browsers,
        // but we should not, see #8335.
        // Always return an empty object.
        if ( !acceptData( owner ) ) {
            return {};
        }

        // Check if the owner object already has a cache
        var value = owner[ this.expando ];

        // If not, create one
        if ( !value ) {
            value = {};

            // We can accept data for non-element nodes in modern browsers,
            // but we should not, see #8335.
            // Always return an empty object.
            if ( acceptData( owner ) ) {

                // If it is a node unlikely to be stringify-ed or looped over
                // use plain assignment
                if ( owner.nodeType ) {
                    owner[ this.expando ] = value;

                // Otherwise secure it in a non-enumerable property
                // configurable must be true to allow the property to be
                // deleted when data is removed
                } else {
                    Object.defineProperty( owner, this.expando, {
                        value: value,
                        configurable: true
                    } );
                }
            }
        }

        return value;
    },
    set: function( owner, data, value ) {
        var prop,
            cache = this.cache( owner );

        // Handle: [ owner, key, value ] args
        if ( typeof data === "string" ) {
            cache[ data ] = value;

        // Handle: [ owner, { properties } ] args
        } else {

            // Copy the properties one-by-one to the cache object
            for ( prop in data ) {
                cache[ prop ] = data[ prop ];
            }
        }
        return cache;
    },
    get: function( owner, key ) {
        return key === undefined ?
            this.cache( owner ) :
            owner[ this.expando ] && owner[ this.expando ][ key ];
    },
    access: function( owner, key, value ) {
        var stored;

        // In cases where either:
        //
        //   1. No key was specified
        //   2. A string key was specified, but no value provided
        //
        // Take the "read" path and allow the get method to determine
        // which value to return, respectively either:
        //
        //   1. The entire cache object
        //   2. The data stored at the key
        //
        if ( key === undefined ||
                ( ( key && typeof key === "string" ) && value === undefined ) ) {

            stored = this.get( owner, key );

            return stored !== undefined ?
                stored : this.get( owner, jQuery.camelCase( key ) );
        }

        // When the key is not a string, or both a key and value
        // are specified, set or extend (existing objects) with either:
        //
        //   1. An object of properties
        //   2. A key and value
        //
        this.set( owner, key, value );

        // Since the "set" path can have two possible entry points
        // return the expected data based on which path was taken[*]
        return value !== undefined ? value : key;
    },
    remove: function( owner, key ) {
        var i, name, camel,
            cache = owner[ this.expando ];

        if ( cache === undefined ) {
            return;
        }

        if ( key === undefined ) {
            this.register( owner );

        } else {

            // Support array or space separated string of keys
            if ( jQuery.isArray( key ) ) {

                // If "name" is an array of keys...
                // When data is initially created, via ("key", "val") signature,
                // keys will be converted to camelCase.
                // Since there is no way to tell _how_ a key was added, remove
                // both plain key and camelCase key. #12786
                // This will only penalize the array argument path.
                name = key.concat( key.map( jQuery.camelCase ) );
            } else {
                camel = jQuery.camelCase( key );

                // Try the string as a key before any manipulation
                if ( key in cache ) {
                    name = [ key, camel ];
                } else {

                    // If a key with the spaces exists, use it.
                    // Otherwise, create an array by matching non-whitespace
                    name = camel;
                    name = name in cache ?
                        [ name ] : ( name.match( rnotwhite ) || [] );
                }
            }

            i = name.length;

            while ( i-- ) {
                delete cache[ name[ i ] ];
            }
        }

        // Remove the expando if there's no more data
        if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

            // Support: Chrome <= 35-45+
            // Webkit & Blink performance suffers when deleting properties
            // from DOM nodes, so set to undefined instead
            // https://code.google.com/p/chromium/issues/detail?id=378607
            if ( owner.nodeType ) {
                owner[ this.expando ] = undefined;
            } else {
                delete owner[ this.expando ];
            }
        }
    },
    hasData: function( owner ) {
        var cache = owner[ this.expando ];
        return cache !== undefined && !jQuery.isEmptyObject( cache );
    }
};
var dataPriv = new Data();

var dataUser = new Data();



//  Implementation Summary
//
//  1. Enforce API surface and semantic compatibility with 1.9.x branch
//  2. Improve the module's maintainability by reducing the storage
//      paths to a single mechanism.
//  3. Use the same single mechanism to support "private" and "user" data.
//  4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//  5. Avoid exposing implementation details on user objects (eg. expando properties)
//  6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
    var name;

    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if ( data === undefined && elem.nodeType === 1 ) {
        name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            try {
                data = data === "true" ? true :
                    data === "false" ? false :
                    data === "null" ? null :

                    // Only convert to a number if it doesn't change the string
                    +data + "" === data ? +data :
                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                    data;
            } catch ( e ) {}

            // Make sure we set the data so it isn't changed later
            dataUser.set( elem, key, data );
        } else {
            data = undefined;
        }
    }
    return data;
}

jQuery.extend( {
    hasData: function( elem ) {
        return dataUser.hasData( elem ) || dataPriv.hasData( elem );
    },

    data: function( elem, name, data ) {
        return dataUser.access( elem, name, data );
    },

    removeData: function( elem, name ) {
        dataUser.remove( elem, name );
    },

    // TODO: Now that all calls to _data and _removeData have been replaced
    // with direct calls to dataPriv methods, these can be deprecated.
    _data: function( elem, name, data ) {
        return dataPriv.access( elem, name, data );
    },

    _removeData: function( elem, name ) {
        dataPriv.remove( elem, name );
    }
} );

jQuery.fn.extend( {
    data: function( key, value ) {
        var i, name, data,
            elem = this[ 0 ],
            attrs = elem && elem.attributes;

        // Gets all values
        if ( key === undefined ) {
            if ( this.length ) {
                data = dataUser.get( elem );

                if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
                    i = attrs.length;
                    while ( i-- ) {

                        // Support: IE11+
                        // The attrs elements can be null (#14894)
                        if ( attrs[ i ] ) {
                            name = attrs[ i ].name;
                            if ( name.indexOf( "data-" ) === 0 ) {
                                name = jQuery.camelCase( name.slice( 5 ) );
                                dataAttr( elem, name, data[ name ] );
                            }
                        }
                    }
                    dataPriv.set( elem, "hasDataAttrs", true );
                }
            }

            return data;
        }

        // Sets multiple values
        if ( typeof key === "object" ) {
            return this.each( function() {
                dataUser.set( this, key );
            } );
        }

        return access( this, function( value ) {
            var data, camelKey;

            // The calling jQuery object (element matches) is not empty
            // (and therefore has an element appears at this[ 0 ]) and the
            // `value` parameter was not undefined. An empty jQuery object
            // will result in `undefined` for elem = this[ 0 ] which will
            // throw an exception if an attempt to read a data cache is made.
            if ( elem && value === undefined ) {

                // Attempt to get data from the cache
                // with the key as-is
                data = dataUser.get( elem, key ) ||

                    // Try to find dashed key if it exists (gh-2779)
                    // This is for 2.2.x only
                    dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

                if ( data !== undefined ) {
                    return data;
                }

                camelKey = jQuery.camelCase( key );

                // Attempt to get data from the cache
                // with the key camelized
                data = dataUser.get( elem, camelKey );
                if ( data !== undefined ) {
                    return data;
                }

                // Attempt to "discover" the data in
                // HTML5 custom data-* attrs
                data = dataAttr( elem, camelKey, undefined );
                if ( data !== undefined ) {
                    return data;
                }

                // We tried really hard, but the data doesn't exist.
                return;
            }

            // Set the data...
            camelKey = jQuery.camelCase( key );
            this.each( function() {

                // First, attempt to store a copy or reference of any
                // data that might've been store with a camelCased key.
                var data = dataUser.get( this, camelKey );

                // For HTML5 data-* attribute interop, we have to
                // store property names with dashes in a camelCase form.
                // This might not apply to all properties...*
                dataUser.set( this, camelKey, value );

                // *... In the case of properties that might _actually_
                // have dashes, we need to also store a copy of that
                // unchanged property.
                if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
                    dataUser.set( this, key, value );
                }
            } );
        }, null, value, arguments.length > 1, null, true );
    },

    removeData: function( key ) {
        return this.each( function() {
            dataUser.remove( this, key );
        } );
    }
} );


jQuery.extend( {
    queue: function( elem, type, data ) {
        var queue;

        if ( elem ) {
            type = ( type || "fx" ) + "queue";
            queue = dataPriv.get( elem, type );

            // Speed up dequeue by getting out quickly if this is just a lookup
            if ( data ) {
                if ( !queue || jQuery.isArray( data ) ) {
                    queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
                } else {
                    queue.push( data );
                }
            }
            return queue || [];
        }
    },

    dequeue: function( elem, type ) {
        type = type || "fx";

        var queue = jQuery.queue( elem, type ),
            startLength = queue.length,
            fn = queue.shift(),
            hooks = jQuery._queueHooks( elem, type ),
            next = function() {
                jQuery.dequeue( elem, type );
            };

        // If the fx queue is dequeued, always remove the progress sentinel
        if ( fn === "inprogress" ) {
            fn = queue.shift();
            startLength--;
        }

        if ( fn ) {

            // Add a progress sentinel to prevent the fx queue from being
            // automatically dequeued
            if ( type === "fx" ) {
                queue.unshift( "inprogress" );
            }

            // Clear up the last queue stop function
            delete hooks.stop;
            fn.call( elem, next, hooks );
        }

        if ( !startLength && hooks ) {
            hooks.empty.fire();
        }
    },

    // Not public - generate a queueHooks object, or return the current one
    _queueHooks: function( elem, type ) {
        var key = type + "queueHooks";
        return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
            empty: jQuery.Callbacks( "once memory" ).add( function() {
                dataPriv.remove( elem, [ type + "queue", key ] );
            } )
        } );
    }
} );

jQuery.fn.extend( {
    queue: function( type, data ) {
        var setter = 2;

        if ( typeof type !== "string" ) {
            data = type;
            type = "fx";
            setter--;
        }

        if ( arguments.length < setter ) {
            return jQuery.queue( this[ 0 ], type );
        }

        return data === undefined ?
            this :
            this.each( function() {
                var queue = jQuery.queue( this, type, data );

                // Ensure a hooks for this queue
                jQuery._queueHooks( this, type );

                if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
                    jQuery.dequeue( this, type );
                }
            } );
    },
    dequeue: function( type ) {
        return this.each( function() {
            jQuery.dequeue( this, type );
        } );
    },
    clearQueue: function( type ) {
        return this.queue( type || "fx", [] );
    },

    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function( type, obj ) {
        var tmp,
            count = 1,
            defer = jQuery.Deferred(),
            elements = this,
            i = this.length,
            resolve = function() {
                if ( !( --count ) ) {
                    defer.resolveWith( elements, [ elements ] );
                }
            };

        if ( typeof type !== "string" ) {
            obj = type;
            type = undefined;
        }
        type = type || "fx";

        while ( i-- ) {
            tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
            if ( tmp && tmp.empty ) {
                count++;
                tmp.empty.add( resolve );
            }
        }
        resolve();
        return defer.promise( obj );
    }
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;
        return jQuery.css( elem, "display" ) === "none" ||
            !jQuery.contains( elem.ownerDocument, elem );
    };



function adjustCSS( elem, prop, valueParts, tween ) {
    var adjusted,
        scale = 1,
        maxIterations = 20,
        currentValue = tween ?
            function() { return tween.cur(); } :
            function() { return jQuery.css( elem, prop, "" ); },
        initial = currentValue(),
        unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

        // Starting value computation is required for potential unit mismatches
        initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
            rcssNum.exec( jQuery.css( elem, prop ) );

    if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

        // Trust units reported by jQuery.css
        unit = unit || initialInUnit[ 3 ];

        // Make sure we update the tween properties later on
        valueParts = valueParts || [];

        // Iteratively approximate from a nonzero starting point
        initialInUnit = +initial || 1;

        do {

            // If previous iteration zeroed out, double until we get *something*.
            // Use string for doubling so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            initialInUnit = initialInUnit / scale;
            jQuery.style( elem, prop, initialInUnit + unit );

        // Update scale, tolerating zero or NaN from tween.cur()
        // Break the loop if scale is unchanged or perfect, or if we've just had enough.
        } while (
            scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
        );
    }

    if ( valueParts ) {
        initialInUnit = +initialInUnit || +initial || 0;

        // Apply relative offset (+=/-=) if specified
        adjusted = valueParts[ 1 ] ?
            initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
            +valueParts[ 2 ];
        if ( tween ) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
        }
    }
    return adjusted;
}
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

    // Support: IE9
    option: [ 1, "<select multiple='multiple'>", "</select>" ],

    // XHTML parsers do not magically insert elements in the
    // same way that tag soup parsers do. So we cannot shorten
    // this by omitting <tbody> or other required elements.
    thead: [ 1, "<table>", "</table>" ],
    col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

    _default: [ 0, "", "" ]
};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

    // Support: IE9-11+
    // Use typeof to avoid zero-argument method invocation on host objects (#15151)
    var ret = typeof context.getElementsByTagName !== "undefined" ?
            context.getElementsByTagName( tag || "*" ) :
            typeof context.querySelectorAll !== "undefined" ?
                context.querySelectorAll( tag || "*" ) :
            [];

    return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
        jQuery.merge( [ context ], ret ) :
        ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
    var i = 0,
        l = elems.length;

    for ( ; i < l; i++ ) {
        dataPriv.set(
            elems[ i ],
            "globalEval",
            !refElements || dataPriv.get( refElements[ i ], "globalEval" )
        );
    }
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
    var elem, tmp, tag, wrap, contains, j,
        fragment = context.createDocumentFragment(),
        nodes = [],
        i = 0,
        l = elems.length;

    for ( ; i < l; i++ ) {
        elem = elems[ i ];

        if ( elem || elem === 0 ) {

            // Add nodes directly
            if ( jQuery.type( elem ) === "object" ) {

                // Support: Android<4.1, PhantomJS<2
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

            // Convert non-html into a text node
            } else if ( !rhtml.test( elem ) ) {
                nodes.push( context.createTextNode( elem ) );

            // Convert html into DOM nodes
            } else {
                tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

                // Deserialize a standard representation
                tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
                wrap = wrapMap[ tag ] || wrapMap._default;
                tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

                // Descend through wrappers to the right content
                j = wrap[ 0 ];
                while ( j-- ) {
                    tmp = tmp.lastChild;
                }

                // Support: Android<4.1, PhantomJS<2
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge( nodes, tmp.childNodes );

                // Remember the top-level container
                tmp = fragment.firstChild;

                // Ensure the created nodes are orphaned (#12392)
                tmp.textContent = "";
            }
        }
    }

    // Remove wrapper from fragment
    fragment.textContent = "";

    i = 0;
    while ( ( elem = nodes[ i++ ] ) ) {

        // Skip elements already in the context collection (trac-4087)
        if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
            if ( ignored ) {
                ignored.push( elem );
            }
            continue;
        }

        contains = jQuery.contains( elem.ownerDocument, elem );

        // Append to fragment
        tmp = getAll( fragment.appendChild( elem ), "script" );

        // Preserve script evaluation history
        if ( contains ) {
            setGlobalEval( tmp );
        }

        // Capture executables
        if ( scripts ) {
            j = 0;
            while ( ( elem = tmp[ j++ ] ) ) {
                if ( rscriptType.test( elem.type || "" ) ) {
                    scripts.push( elem );
                }
            }
        }
    }

    return fragment;
}


( function() {
    var fragment = document.createDocumentFragment(),
        div = fragment.appendChild( document.createElement( "div" ) ),
        input = document.createElement( "input" );

    // Support: Android 4.0-4.3, Safari<=5.1
    // Check state lost if the name is set (#11217)
    // Support: Windows Web Apps (WWA)
    // `name` and `type` must use .setAttribute for WWA (#14901)
    input.setAttribute( "type", "radio" );
    input.setAttribute( "checked", "checked" );
    input.setAttribute( "name", "t" );

    div.appendChild( input );

    // Support: Safari<=5.1, Android<4.2
    // Older WebKit doesn't clone checked state correctly in fragments
    support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

    // Support: IE<=11+
    // Make sure textarea (and checkbox) defaultValue is properly cloned
    div.innerHTML = "<textarea>x</textarea>";
    support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
    return true;
}

function returnFalse() {
    return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
    try {
        return document.activeElement;
    } catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
    var origFn, type;

    // Types can be a map of types/handlers
    if ( typeof types === "object" ) {

        // ( types-Object, selector, data )
        if ( typeof selector !== "string" ) {

            // ( types-Object, data )
            data = data || selector;
            selector = undefined;
        }
        for ( type in types ) {
            on( elem, type, selector, data, types[ type ], one );
        }
        return elem;
    }

    if ( data == null && fn == null ) {

        // ( types, fn )
        fn = selector;
        data = selector = undefined;
    } else if ( fn == null ) {
        if ( typeof selector === "string" ) {

            // ( types, selector, fn )
            fn = data;
            data = undefined;
        } else {

            // ( types, data, fn )
            fn = data;
            data = selector;
            selector = undefined;
        }
    }
    if ( fn === false ) {
        fn = returnFalse;
    } else if ( !fn ) {
        return elem;
    }

    if ( one === 1 ) {
        origFn = fn;
        fn = function( event ) {

            // Can use an empty set, since event contains the info
            jQuery().off( event );
            return origFn.apply( this, arguments );
        };

        // Use same guid so caller can remove using origFn
        fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    }
    return elem.each( function() {
        jQuery.event.add( this, types, fn, data, selector );
    } );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

    global: {},

    add: function( elem, types, handler, data, selector ) {

        var handleObjIn, eventHandle, tmp,
            events, t, handleObj,
            special, handlers, type, namespaces, origType,
            elemData = dataPriv.get( elem );

        // Don't attach events to noData or text/comment nodes (but allow plain objects)
        if ( !elemData ) {
            return;
        }

        // Caller can pass in an object of custom data in lieu of the handler
        if ( handler.handler ) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
        }

        // Make sure that the handler has a unique ID, used to find/remove it later
        if ( !handler.guid ) {
            handler.guid = jQuery.guid++;
        }

        // Init the element's event structure and main handler, if this is the first
        if ( !( events = elemData.events ) ) {
            events = elemData.events = {};
        }
        if ( !( eventHandle = elemData.handle ) ) {
            eventHandle = elemData.handle = function( e ) {

                // Discard the second event of a jQuery.event.trigger() and
                // when an event is called after a page has unloaded
                return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
                    jQuery.event.dispatch.apply( elem, arguments ) : undefined;
            };
        }

        // Handle multiple events separated by a space
        types = ( types || "" ).match( rnotwhite ) || [ "" ];
        t = types.length;
        while ( t-- ) {
            tmp = rtypenamespace.exec( types[ t ] ) || [];
            type = origType = tmp[ 1 ];
            namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

            // There *must* be a type, no attaching namespace-only handlers
            if ( !type ) {
                continue;
            }

            // If event changes its type, use the special event handlers for the changed type
            special = jQuery.event.special[ type ] || {};

            // If selector defined, determine special event api type, otherwise given type
            type = ( selector ? special.delegateType : special.bindType ) || type;

            // Update special based on newly reset type
            special = jQuery.event.special[ type ] || {};

            // handleObj is passed to all event handlers
            handleObj = jQuery.extend( {
                type: type,
                origType: origType,
                data: data,
                handler: handler,
                guid: handler.guid,
                selector: selector,
                needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
                namespace: namespaces.join( "." )
            }, handleObjIn );

            // Init the event handler queue if we're the first
            if ( !( handlers = events[ type ] ) ) {
                handlers = events[ type ] = [];
                handlers.delegateCount = 0;

                // Only use addEventListener if the special events handler returns false
                if ( !special.setup ||
                    special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

                    if ( elem.addEventListener ) {
                        elem.addEventListener( type, eventHandle );
                    }
                }
            }

            if ( special.add ) {
                special.add.call( elem, handleObj );

                if ( !handleObj.handler.guid ) {
                    handleObj.handler.guid = handler.guid;
                }
            }

            // Add to the element's handler list, delegates in front
            if ( selector ) {
                handlers.splice( handlers.delegateCount++, 0, handleObj );
            } else {
                handlers.push( handleObj );
            }

            // Keep track of which events have ever been used, for event optimization
            jQuery.event.global[ type ] = true;
        }

    },

    // Detach an event or set of events from an element
    remove: function( elem, types, handler, selector, mappedTypes ) {

        var j, origCount, tmp,
            events, t, handleObj,
            special, handlers, type, namespaces, origType,
            elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

        if ( !elemData || !( events = elemData.events ) ) {
            return;
        }

        // Once for each type.namespace in types; type may be omitted
        types = ( types || "" ).match( rnotwhite ) || [ "" ];
        t = types.length;
        while ( t-- ) {
            tmp = rtypenamespace.exec( types[ t ] ) || [];
            type = origType = tmp[ 1 ];
            namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

            // Unbind all events (on this namespace, if provided) for the element
            if ( !type ) {
                for ( type in events ) {
                    jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                }
                continue;
            }

            special = jQuery.event.special[ type ] || {};
            type = ( selector ? special.delegateType : special.bindType ) || type;
            handlers = events[ type ] || [];
            tmp = tmp[ 2 ] &&
                new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

            // Remove matching events
            origCount = j = handlers.length;
            while ( j-- ) {
                handleObj = handlers[ j ];

                if ( ( mappedTypes || origType === handleObj.origType ) &&
                    ( !handler || handler.guid === handleObj.guid ) &&
                    ( !tmp || tmp.test( handleObj.namespace ) ) &&
                    ( !selector || selector === handleObj.selector ||
                        selector === "**" && handleObj.selector ) ) {
                    handlers.splice( j, 1 );

                    if ( handleObj.selector ) {
                        handlers.delegateCount--;
                    }
                    if ( special.remove ) {
                        special.remove.call( elem, handleObj );
                    }
                }
            }

            // Remove generic event handler if we removed something and no more handlers exist
            // (avoids potential for endless recursion during removal of special event handlers)
            if ( origCount && !handlers.length ) {
                if ( !special.teardown ||
                    special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

                    jQuery.removeEvent( elem, type, elemData.handle );
                }

                delete events[ type ];
            }
        }

        // Remove data and the expando if it's no longer used
        if ( jQuery.isEmptyObject( events ) ) {
            dataPriv.remove( elem, "handle events" );
        }
    },

    dispatch: function( event ) {

        // Make a writable jQuery.Event from the native event object
        event = jQuery.event.fix( event );

        var i, j, ret, matched, handleObj,
            handlerQueue = [],
            args = slice.call( arguments ),
            handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
            special = jQuery.event.special[ event.type ] || {};

        // Use the fix-ed jQuery.Event rather than the (read-only) native event
        args[ 0 ] = event;
        event.delegateTarget = this;

        // Call the preDispatch hook for the mapped type, and let it bail if desired
        if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
            return;
        }

        // Determine handlers
        handlerQueue = jQuery.event.handlers.call( this, event, handlers );

        // Run delegates first; they may want to stop propagation beneath us
        i = 0;
        while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
            event.currentTarget = matched.elem;

            j = 0;
            while ( ( handleObj = matched.handlers[ j++ ] ) &&
                !event.isImmediatePropagationStopped() ) {

                // Triggered event must either 1) have no namespace, or 2) have namespace(s)
                // a subset or equal to those in the bound event (both can have no namespace).
                if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

                    event.handleObj = handleObj;
                    event.data = handleObj.data;

                    ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
                        handleObj.handler ).apply( matched.elem, args );

                    if ( ret !== undefined ) {
                        if ( ( event.result = ret ) === false ) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                }
            }
        }

        // Call the postDispatch hook for the mapped type
        if ( special.postDispatch ) {
            special.postDispatch.call( this, event );
        }

        return event.result;
    },

    handlers: function( event, handlers ) {
        var i, matches, sel, handleObj,
            handlerQueue = [],
            delegateCount = handlers.delegateCount,
            cur = event.target;

        // Support (at least): Chrome, IE9
        // Find delegate handlers
        // Black-hole SVG <use> instance trees (#13180)
        //
        // Support: Firefox<=42+
        // Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
        if ( delegateCount && cur.nodeType &&
            ( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

            for ( ; cur !== this; cur = cur.parentNode || this ) {

                // Don't check non-elements (#13208)
                // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
                    matches = [];
                    for ( i = 0; i < delegateCount; i++ ) {
                        handleObj = handlers[ i ];

                        // Don't conflict with Object.prototype properties (#13203)
                        sel = handleObj.selector + " ";

                        if ( matches[ sel ] === undefined ) {
                            matches[ sel ] = handleObj.needsContext ?
                                jQuery( sel, this ).index( cur ) > -1 :
                                jQuery.find( sel, this, null, [ cur ] ).length;
                        }
                        if ( matches[ sel ] ) {
                            matches.push( handleObj );
                        }
                    }
                    if ( matches.length ) {
                        handlerQueue.push( { elem: cur, handlers: matches } );
                    }
                }
            }
        }

        // Add the remaining (directly-bound) handlers
        if ( delegateCount < handlers.length ) {
            handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
        }

        return handlerQueue;
    },

    // Includes some event props shared by KeyEvent and MouseEvent
    props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
        "metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

    fixHooks: {},

    keyHooks: {
        props: "char charCode key keyCode".split( " " ),
        filter: function( event, original ) {

            // Add which for key events
            if ( event.which == null ) {
                event.which = original.charCode != null ? original.charCode : original.keyCode;
            }

            return event;
        }
    },

    mouseHooks: {
        props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
            "screenX screenY toElement" ).split( " " ),
        filter: function( event, original ) {
            var eventDoc, doc, body,
                button = original.button;

            // Calculate pageX/Y if missing and clientX/Y available
            if ( event.pageX == null && original.clientX != null ) {
                eventDoc = event.target.ownerDocument || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;

                event.pageX = original.clientX +
                    ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                    ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                event.pageY = original.clientY +
                    ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
                    ( doc && doc.clientTop  || body && body.clientTop  || 0 );
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if ( !event.which && button !== undefined ) {
                event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
            }

            return event;
        }
    },

    fix: function( event ) {
        if ( event[ jQuery.expando ] ) {
            return event;
        }

        // Create a writable copy of the event object and normalize some properties
        var i, prop, copy,
            type = event.type,
            originalEvent = event,
            fixHook = this.fixHooks[ type ];

        if ( !fixHook ) {
            this.fixHooks[ type ] = fixHook =
                rmouseEvent.test( type ) ? this.mouseHooks :
                rkeyEvent.test( type ) ? this.keyHooks :
                {};
        }
        copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

        event = new jQuery.Event( originalEvent );

        i = copy.length;
        while ( i-- ) {
            prop = copy[ i ];
            event[ prop ] = originalEvent[ prop ];
        }

        // Support: Cordova 2.5 (WebKit) (#13255)
        // All events should have a target; Cordova deviceready doesn't
        if ( !event.target ) {
            event.target = document;
        }

        // Support: Safari 6.0+, Chrome<28
        // Target should not be a text node (#504, #13143)
        if ( event.target.nodeType === 3 ) {
            event.target = event.target.parentNode;
        }

        return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
    },

    special: {
        load: {

            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
        },
        focus: {

            // Fire native event if possible so blur/focus sequence is correct
            trigger: function() {
                if ( this !== safeActiveElement() && this.focus ) {
                    this.focus();
                    return false;
                }
            },
            delegateType: "focusin"
        },
        blur: {
            trigger: function() {
                if ( this === safeActiveElement() && this.blur ) {
                    this.blur();
                    return false;
                }
            },
            delegateType: "focusout"
        },
        click: {

            // For checkbox, fire native event so checked state will be right
            trigger: function() {
                if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
                    this.click();
                    return false;
                }
            },

            // For cross-browser consistency, don't fire native .click() on links
            _default: function( event ) {
                return jQuery.nodeName( event.target, "a" );
            }
        },

        beforeunload: {
            postDispatch: function( event ) {

                // Support: Firefox 20+
                // Firefox doesn't alert if the returnValue field is not set.
                if ( event.result !== undefined && event.originalEvent ) {
                    event.originalEvent.returnValue = event.result;
                }
            }
        }
    }
};

jQuery.removeEvent = function( elem, type, handle ) {

    // This "if" is needed for plain objects
    if ( elem.removeEventListener ) {
        elem.removeEventListener( type, handle );
    }
};

jQuery.Event = function( src, props ) {

    // Allow instantiation without the 'new' keyword
    if ( !( this instanceof jQuery.Event ) ) {
        return new jQuery.Event( src, props );
    }

    // Event object
    if ( src && src.type ) {
        this.originalEvent = src;
        this.type = src.type;

        // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented = src.defaultPrevented ||
                src.defaultPrevented === undefined &&

                // Support: Android<4.0
                src.returnValue === false ?
            returnTrue :
            returnFalse;

    // Event type
    } else {
        this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if ( props ) {
        jQuery.extend( this, props );
    }

    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = src && src.timeStamp || jQuery.now();

    // Mark it as fixed
    this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
    constructor: jQuery.Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    isSimulated: false,

    preventDefault: function() {
        var e = this.originalEvent;

        this.isDefaultPrevented = returnTrue;

        if ( e && !this.isSimulated ) {
            e.preventDefault();
        }
    },
    stopPropagation: function() {
        var e = this.originalEvent;

        this.isPropagationStopped = returnTrue;

        if ( e && !this.isSimulated ) {
            e.stopPropagation();
        }
    },
    stopImmediatePropagation: function() {
        var e = this.originalEvent;

        this.isImmediatePropagationStopped = returnTrue;

        if ( e && !this.isSimulated ) {
            e.stopImmediatePropagation();
        }

        this.stopPropagation();
    }
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
}, function( orig, fix ) {
    jQuery.event.special[ orig ] = {
        delegateType: fix,
        bindType: fix,

        handle: function( event ) {
            var ret,
                target = this,
                related = event.relatedTarget,
                handleObj = event.handleObj;

            // For mouseenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply( this, arguments );
                event.type = fix;
            }
            return ret;
        }
    };
} );

jQuery.fn.extend( {
    on: function( types, selector, data, fn ) {
        return on( this, types, selector, data, fn );
    },
    one: function( types, selector, data, fn ) {
        return on( this, types, selector, data, fn, 1 );
    },
    off: function( types, selector, fn ) {
        var handleObj, type;
        if ( types && types.preventDefault && types.handleObj ) {

            // ( event )  dispatched jQuery.Event
            handleObj = types.handleObj;
            jQuery( types.delegateTarget ).off(
                handleObj.namespace ?
                    handleObj.origType + "." + handleObj.namespace :
                    handleObj.origType,
                handleObj.selector,
                handleObj.handler
            );
            return this;
        }
        if ( typeof types === "object" ) {

            // ( types-object [, selector] )
            for ( type in types ) {
                this.off( type, selector, types[ type ] );
            }
            return this;
        }
        if ( selector === false || typeof selector === "function" ) {

            // ( types [, fn] )
            fn = selector;
            selector = undefined;
        }
        if ( fn === false ) {
            fn = returnFalse;
        }
        return this.each( function() {
            jQuery.event.remove( this, types, fn, selector );
        } );
    }
} );


var
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

    // Support: IE 10-11, Edge 10240+
    // In IE/Edge using regex groups here causes severe slowdowns.
    // See https://connect.microsoft.com/IE/feedback/details/1736512/
    rnoInnerhtml = /<script|<style|<link/i,

    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptTypeMasked = /^true\/(.*)/,
    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
    return jQuery.nodeName( elem, "table" ) &&
        jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

        elem.getElementsByTagName( "tbody" )[ 0 ] ||
            elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
        elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
    elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
    return elem;
}
function restoreScript( elem ) {
    var match = rscriptTypeMasked.exec( elem.type );

    if ( match ) {
        elem.type = match[ 1 ];
    } else {
        elem.removeAttribute( "type" );
    }

    return elem;
}

function cloneCopyEvent( src, dest ) {
    var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

    if ( dest.nodeType !== 1 ) {
        return;
    }

    // 1. Copy private data: events, handlers, etc.
    if ( dataPriv.hasData( src ) ) {
        pdataOld = dataPriv.access( src );
        pdataCur = dataPriv.set( dest, pdataOld );
        events = pdataOld.events;

        if ( events ) {
            delete pdataCur.handle;
            pdataCur.events = {};

            for ( type in events ) {
                for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                    jQuery.event.add( dest, type, events[ type ][ i ] );
                }
            }
        }
    }

    // 2. Copy user data
    if ( dataUser.hasData( src ) ) {
        udataOld = dataUser.access( src );
        udataCur = jQuery.extend( {}, udataOld );

        dataUser.set( dest, udataCur );
    }
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
    var nodeName = dest.nodeName.toLowerCase();

    // Fails to persist the checked state of a cloned checkbox or radio button.
    if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
        dest.checked = src.checked;

    // Fails to return the selected option to the default selected state when cloning options
    } else if ( nodeName === "input" || nodeName === "textarea" ) {
        dest.defaultValue = src.defaultValue;
    }
}

function domManip( collection, args, callback, ignored ) {

    // Flatten any nested arrays
    args = concat.apply( [], args );

    var fragment, first, scripts, hasScripts, node, doc,
        i = 0,
        l = collection.length,
        iNoClone = l - 1,
        value = args[ 0 ],
        isFunction = jQuery.isFunction( value );

    // We can't cloneNode fragments that contain checked, in WebKit
    if ( isFunction ||
            ( l > 1 && typeof value === "string" &&
                !support.checkClone && rchecked.test( value ) ) ) {
        return collection.each( function( index ) {
            var self = collection.eq( index );
            if ( isFunction ) {
                args[ 0 ] = value.call( this, index, self.html() );
            }
            domManip( self, args, callback, ignored );
        } );
    }

    if ( l ) {
        fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
        first = fragment.firstChild;

        if ( fragment.childNodes.length === 1 ) {
            fragment = first;
        }

        // Require either new content or an interest in ignored elements to invoke the callback
        if ( first || ignored ) {
            scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
            hasScripts = scripts.length;

            // Use the original fragment for the last item
            // instead of the first because it can end up
            // being emptied incorrectly in certain situations (#8070).
            for ( ; i < l; i++ ) {
                node = fragment;

                if ( i !== iNoClone ) {
                    node = jQuery.clone( node, true, true );

                    // Keep references to cloned scripts for later restoration
                    if ( hasScripts ) {

                        // Support: Android<4.1, PhantomJS<2
                        // push.apply(_, arraylike) throws on ancient WebKit
                        jQuery.merge( scripts, getAll( node, "script" ) );
                    }
                }

                callback.call( collection[ i ], node, i );
            }

            if ( hasScripts ) {
                doc = scripts[ scripts.length - 1 ].ownerDocument;

                // Reenable scripts
                jQuery.map( scripts, restoreScript );

                // Evaluate executable scripts on first document insertion
                for ( i = 0; i < hasScripts; i++ ) {
                    node = scripts[ i ];
                    if ( rscriptType.test( node.type || "" ) &&
                        !dataPriv.access( node, "globalEval" ) &&
                        jQuery.contains( doc, node ) ) {

                        if ( node.src ) {

                            // Optional AJAX dependency, but won't run scripts if not present
                            if ( jQuery._evalUrl ) {
                                jQuery._evalUrl( node.src );
                            }
                        } else {
                            jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
                        }
                    }
                }
            }
        }
    }

    return collection;
}

function remove( elem, selector, keepData ) {
    var node,
        nodes = selector ? jQuery.filter( selector, elem ) : elem,
        i = 0;

    for ( ; ( node = nodes[ i ] ) != null; i++ ) {
        if ( !keepData && node.nodeType === 1 ) {
            jQuery.cleanData( getAll( node ) );
        }

        if ( node.parentNode ) {
            if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
                setGlobalEval( getAll( node, "script" ) );
            }
            node.parentNode.removeChild( node );
        }
    }

    return elem;
}

jQuery.extend( {
    htmlPrefilter: function( html ) {
        return html.replace( rxhtmlTag, "<$1></$2>" );
    },

    clone: function( elem, dataAndEvents, deepDataAndEvents ) {
        var i, l, srcElements, destElements,
            clone = elem.cloneNode( true ),
            inPage = jQuery.contains( elem.ownerDocument, elem );

        // Fix IE cloning issues
        if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
                !jQuery.isXMLDoc( elem ) ) {

            // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
            destElements = getAll( clone );
            srcElements = getAll( elem );

            for ( i = 0, l = srcElements.length; i < l; i++ ) {
                fixInput( srcElements[ i ], destElements[ i ] );
            }
        }

        // Copy the events from the original to the clone
        if ( dataAndEvents ) {
            if ( deepDataAndEvents ) {
                srcElements = srcElements || getAll( elem );
                destElements = destElements || getAll( clone );

                for ( i = 0, l = srcElements.length; i < l; i++ ) {
                    cloneCopyEvent( srcElements[ i ], destElements[ i ] );
                }
            } else {
                cloneCopyEvent( elem, clone );
            }
        }

        // Preserve script evaluation history
        destElements = getAll( clone, "script" );
        if ( destElements.length > 0 ) {
            setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
        }

        // Return the cloned set
        return clone;
    },

    cleanData: function( elems ) {
        var data, elem, type,
            special = jQuery.event.special,
            i = 0;

        for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
            if ( acceptData( elem ) ) {
                if ( ( data = elem[ dataPriv.expando ] ) ) {
                    if ( data.events ) {
                        for ( type in data.events ) {
                            if ( special[ type ] ) {
                                jQuery.event.remove( elem, type );

                            // This is a shortcut to avoid jQuery.event.remove's overhead
                            } else {
                                jQuery.removeEvent( elem, type, data.handle );
                            }
                        }
                    }

                    // Support: Chrome <= 35-45+
                    // Assign undefined instead of using delete, see Data#remove
                    elem[ dataPriv.expando ] = undefined;
                }
                if ( elem[ dataUser.expando ] ) {

                    // Support: Chrome <= 35-45+
                    // Assign undefined instead of using delete, see Data#remove
                    elem[ dataUser.expando ] = undefined;
                }
            }
        }
    }
} );

jQuery.fn.extend( {

    // Keep domManip exposed until 3.0 (gh-2225)
    domManip: domManip,

    detach: function( selector ) {
        return remove( this, selector, true );
    },

    remove: function( selector ) {
        return remove( this, selector );
    },

    text: function( value ) {
        return access( this, function( value ) {
            return value === undefined ?
                jQuery.text( this ) :
                this.empty().each( function() {
                    if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                        this.textContent = value;
                    }
                } );
        }, null, value, arguments.length );
    },

    append: function() {
        return domManip( this, arguments, function( elem ) {
            if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                var target = manipulationTarget( this, elem );
                target.appendChild( elem );
            }
        } );
    },

    prepend: function() {
        return domManip( this, arguments, function( elem ) {
            if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                var target = manipulationTarget( this, elem );
                target.insertBefore( elem, target.firstChild );
            }
        } );
    },

    before: function() {
        return domManip( this, arguments, function( elem ) {
            if ( this.parentNode ) {
                this.parentNode.insertBefore( elem, this );
            }
        } );
    },

    after: function() {
        return domManip( this, arguments, function( elem ) {
            if ( this.parentNode ) {
                this.parentNode.insertBefore( elem, this.nextSibling );
            }
        } );
    },

    empty: function() {
        var elem,
            i = 0;

        for ( ; ( elem = this[ i ] ) != null; i++ ) {
            if ( elem.nodeType === 1 ) {

                // Prevent memory leaks
                jQuery.cleanData( getAll( elem, false ) );

                // Remove any remaining nodes
                elem.textContent = "";
            }
        }

        return this;
    },

    clone: function( dataAndEvents, deepDataAndEvents ) {
        dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
        deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

        return this.map( function() {
            return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
        } );
    },

    html: function( value ) {
        return access( this, function( value ) {
            var elem = this[ 0 ] || {},
                i = 0,
                l = this.length;

            if ( value === undefined && elem.nodeType === 1 ) {
                return elem.innerHTML;
            }

            // See if we can take a shortcut and just use innerHTML
            if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
                !wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

                value = jQuery.htmlPrefilter( value );

                try {
                    for ( ; i < l; i++ ) {
                        elem = this[ i ] || {};

                        // Remove element nodes and prevent memory leaks
                        if ( elem.nodeType === 1 ) {
                            jQuery.cleanData( getAll( elem, false ) );
                            elem.innerHTML = value;
                        }
                    }

                    elem = 0;

                // If using innerHTML throws an exception, use the fallback method
                } catch ( e ) {}
            }

            if ( elem ) {
                this.empty().append( value );
            }
        }, null, value, arguments.length );
    },

    replaceWith: function() {
        var ignored = [];

        // Make the changes, replacing each non-ignored context element with the new content
        return domManip( this, arguments, function( elem ) {
            var parent = this.parentNode;

            if ( jQuery.inArray( this, ignored ) < 0 ) {
                jQuery.cleanData( getAll( this ) );
                if ( parent ) {
                    parent.replaceChild( elem, this );
                }
            }

        // Force callback invocation
        }, ignored );
    }
} );

jQuery.each( {
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
}, function( name, original ) {
    jQuery.fn[ name ] = function( selector ) {
        var elems,
            ret = [],
            insert = jQuery( selector ),
            last = insert.length - 1,
            i = 0;

        for ( ; i <= last; i++ ) {
            elems = i === last ? this : this.clone( true );
            jQuery( insert[ i ] )[ original ]( elems );

            // Support: QtWebKit
            // .get() because push.apply(_, arraylike) throws
            push.apply( ret, elems.get() );
        }

        return this.pushStack( ret );
    };
} );


var iframe,
    elemdisplay = {

        // Support: Firefox
        // We have to pre-define these values for FF (#10227)
        HTML: "block",
        BODY: "block"
    };

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
    var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

        display = jQuery.css( elem[ 0 ], "display" );

    // We don't have any data stored on the element,
    // so use "detach" method as fast way to get rid of the element
    elem.detach();

    return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
    var doc = document,
        display = elemdisplay[ nodeName ];

    if ( !display ) {
        display = actualDisplay( nodeName, doc );

        // If the simple way fails, read from inside an iframe
        if ( display === "none" || !display ) {

            // Use the already-created iframe if possible
            iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
                .appendTo( doc.documentElement );

            // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
            doc = iframe[ 0 ].contentDocument;

            // Support: IE
            doc.write();
            doc.close();

            display = actualDisplay( nodeName, doc );
            iframe.detach();
        }

        // Store the correct default display
        elemdisplay[ nodeName ] = display;
    }

    return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

        // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        var view = elem.ownerDocument.defaultView;

        if ( !view || !view.opener ) {
            view = window;
        }

        return view.getComputedStyle( elem );
    };

var swap = function( elem, options, callback, args ) {
    var ret, name,
        old = {};

    // Remember the old values, and insert the new ones
    for ( name in options ) {
        old[ name ] = elem.style[ name ];
        elem.style[ name ] = options[ name ];
    }

    ret = callback.apply( elem, args || [] );

    // Revert the old values
    for ( name in options ) {
        elem.style[ name ] = old[ name ];
    }

    return ret;
};


var documentElement = document.documentElement;



( function() {
    var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
        container = document.createElement( "div" ),
        div = document.createElement( "div" );

    // Finish early in limited (non-browser) environments
    if ( !div.style ) {
        return;
    }

    // Support: IE9-11+
    // Style of cloned element affects source element cloned (#8908)
    div.style.backgroundClip = "content-box";
    div.cloneNode( true ).style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";

    container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
        "padding:0;margin-top:1px;position:absolute";
    container.appendChild( div );

    // Executing both pixelPosition & boxSizingReliable tests require only one layout
    // so they're executed at the same time to save the second computation.
    function computeStyleTests() {
        div.style.cssText =

            // Support: Firefox<29, Android 2.3
            // Vendor-prefix box-sizing
            "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
            "position:relative;display:block;" +
            "margin:auto;border:1px;padding:1px;" +
            "top:1%;width:50%";
        div.innerHTML = "";
        documentElement.appendChild( container );

        var divStyle = window.getComputedStyle( div );
        pixelPositionVal = divStyle.top !== "1%";
        reliableMarginLeftVal = divStyle.marginLeft === "2px";
        boxSizingReliableVal = divStyle.width === "4px";

        // Support: Android 4.0 - 4.3 only
        // Some styles come back with percentage values, even though they shouldn't
        div.style.marginRight = "50%";
        pixelMarginRightVal = divStyle.marginRight === "4px";

        documentElement.removeChild( container );
    }

    jQuery.extend( support, {
        pixelPosition: function() {

            // This test is executed only once but we still do memoizing
            // since we can use the boxSizingReliable pre-computing.
            // No need to check if the test was already performed, though.
            computeStyleTests();
            return pixelPositionVal;
        },
        boxSizingReliable: function() {
            if ( boxSizingReliableVal == null ) {
                computeStyleTests();
            }
            return boxSizingReliableVal;
        },
        pixelMarginRight: function() {

            // Support: Android 4.0-4.3
            // We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
            // since that compresses better and they're computed together anyway.
            if ( boxSizingReliableVal == null ) {
                computeStyleTests();
            }
            return pixelMarginRightVal;
        },
        reliableMarginLeft: function() {

            // Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
            if ( boxSizingReliableVal == null ) {
                computeStyleTests();
            }
            return reliableMarginLeftVal;
        },
        reliableMarginRight: function() {

            // Support: Android 2.3
            // Check if div with explicit width and no margin-right incorrectly
            // gets computed margin-right based on width of container. (#3333)
            // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
            // This support function is only executed once so no memoizing is needed.
            var ret,
                marginDiv = div.appendChild( document.createElement( "div" ) );

            // Reset CSS: box-sizing; display; margin; border; padding
            marginDiv.style.cssText = div.style.cssText =

                // Support: Android 2.3
                // Vendor-prefix box-sizing
                "-webkit-box-sizing:content-box;box-sizing:content-box;" +
                "display:block;margin:0;border:0;padding:0";
            marginDiv.style.marginRight = marginDiv.style.width = "0";
            div.style.width = "1px";
            documentElement.appendChild( container );

            ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

            documentElement.removeChild( container );
            div.removeChild( marginDiv );

            return ret;
        }
    } );
} )();


function curCSS( elem, name, computed ) {
    var width, minWidth, maxWidth, ret,
        style = elem.style;

    computed = computed || getStyles( elem );
    ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

    // Support: Opera 12.1x only
    // Fall back to style even without computed
    // computed is undefined for elems on document fragments
    if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
        ret = jQuery.style( elem, name );
    }

    // Support: IE9
    // getPropertyValue is only needed for .css('filter') (#12537)
    if ( computed ) {

        // A tribute to the "awesome hack by Dean Edwards"
        // Android Browser returns percentage for some values,
        // but width seems to be reliably pixels.
        // This is against the CSSOM draft spec:
        // http://dev.w3.org/csswg/cssom/#resolved-values
        if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

            // Remember the original values
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;

            // Put in the new values to get a computed value out
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;

            // Revert the changed values
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
        }
    }

    return ret !== undefined ?

        // Support: IE9-11+
        // IE returns zIndex value as an integer.
        ret + "" :
        ret;
}


function addGetHookIf( conditionFn, hookFn ) {

    // Define the hook, we'll check on the first run if it's really needed.
    return {
        get: function() {
            if ( conditionFn() ) {

                // Hook not needed (or it's not possible to use it due
                // to missing dependency), remove it.
                delete this.get;
                return;
            }

            // Hook needed; redefine it so that the support test is not executed again.
            return ( this.get = hookFn ).apply( this, arguments );
        }
    };
}


var

    // Swappable if display is none or starts with table
    // except "table", "table-cell", or "table-caption"
    // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/,

    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
    },

    cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
    emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

    // Shortcut for names that are not vendor prefixed
    if ( name in emptyStyle ) {
        return name;
    }

    // Check for vendor prefixed names
    var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
        i = cssPrefixes.length;

    while ( i-- ) {
        name = cssPrefixes[ i ] + capName;
        if ( name in emptyStyle ) {
            return name;
        }
    }
}

function setPositiveNumber( elem, value, subtract ) {

    // Any relative (+/-) values have already been
    // normalized at this point
    var matches = rcssNum.exec( value );
    return matches ?

        // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
        value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
    var i = extra === ( isBorderBox ? "border" : "content" ) ?

        // If we already have the right measurement, avoid augmentation
        4 :

        // Otherwise initialize for horizontal or vertical properties
        name === "width" ? 1 : 0,

        val = 0;

    for ( ; i < 4; i += 2 ) {

        // Both box models exclude margin, so add it if we want it
        if ( extra === "margin" ) {
            val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
        }

        if ( isBorderBox ) {

            // border-box includes padding, so remove it if we want content
            if ( extra === "content" ) {
                val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
            }

            // At this point, extra isn't border nor margin, so remove border
            if ( extra !== "margin" ) {
                val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
            }
        } else {

            // At this point, extra isn't content, so add padding
            val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

            // At this point, extra isn't content nor padding, so add border
            if ( extra !== "padding" ) {
                val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
            }
        }
    }

    return val;
}

function getWidthOrHeight( elem, name, extra ) {

    // Start with offset property, which is equivalent to the border-box value
    var valueIsBorderBox = true,
        val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
        styles = getStyles( elem ),
        isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

    // Some non-html elements return undefined for offsetWidth, so check for null/undefined
    // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
    // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
    if ( val <= 0 || val == null ) {

        // Fall back to computed then uncomputed css if necessary
        val = curCSS( elem, name, styles );
        if ( val < 0 || val == null ) {
            val = elem.style[ name ];
        }

        // Computed unit is not pixels. Stop here and return.
        if ( rnumnonpx.test( val ) ) {
            return val;
        }

        // Check for style in case a browser which returns unreliable values
        // for getComputedStyle silently falls back to the reliable elem.style
        valueIsBorderBox = isBorderBox &&
            ( support.boxSizingReliable() || val === elem.style[ name ] );

        // Normalize "", auto, and prepare for extra
        val = parseFloat( val ) || 0;
    }

    // Use the active box-sizing model to add/subtract irrelevant styles
    return ( val +
        augmentWidthOrHeight(
            elem,
            name,
            extra || ( isBorderBox ? "border" : "content" ),
            valueIsBorderBox,
            styles
        )
    ) + "px";
}

function showHide( elements, show ) {
    var display, elem, hidden,
        values = [],
        index = 0,
        length = elements.length;

    for ( ; index < length; index++ ) {
        elem = elements[ index ];
        if ( !elem.style ) {
            continue;
        }

        values[ index ] = dataPriv.get( elem, "olddisplay" );
        display = elem.style.display;
        if ( show ) {

            // Reset the inline display of this element to learn if it is
            // being hidden by cascaded rules or not
            if ( !values[ index ] && display === "none" ) {
                elem.style.display = "";
            }

            // Set elements which have been overridden with display: none
            // in a stylesheet to whatever the default browser style is
            // for such an element
            if ( elem.style.display === "" && isHidden( elem ) ) {
                values[ index ] = dataPriv.access(
                    elem,
                    "olddisplay",
                    defaultDisplay( elem.nodeName )
                );
            }
        } else {
            hidden = isHidden( elem );

            if ( display !== "none" || !hidden ) {
                dataPriv.set(
                    elem,
                    "olddisplay",
                    hidden ? display : jQuery.css( elem, "display" )
                );
            }
        }
    }

    // Set the display of most of the elements in a second loop
    // to avoid the constant reflow
    for ( index = 0; index < length; index++ ) {
        elem = elements[ index ];
        if ( !elem.style ) {
            continue;
        }
        if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
            elem.style.display = show ? values[ index ] || "" : "none";
        }
    }

    return elements;
}

jQuery.extend( {

    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
        opacity: {
            get: function( elem, computed ) {
                if ( computed ) {

                    // We should always get a number back from opacity
                    var ret = curCSS( elem, "opacity" );
                    return ret === "" ? "1" : ret;
                }
            }
        }
    },

    // Don't automatically add "px" to these possibly-unitless properties
    cssNumber: {
        "animationIterationCount": true,
        "columnCount": true,
        "fillOpacity": true,
        "flexGrow": true,
        "flexShrink": true,
        "fontWeight": true,
        "lineHeight": true,
        "opacity": true,
        "order": true,
        "orphans": true,
        "widows": true,
        "zIndex": true,
        "zoom": true
    },

    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {
        "float": "cssFloat"
    },

    // Get and set the style property on a DOM Node
    style: function( elem, name, value, extra ) {

        // Don't set styles on text and comment nodes
        if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
            return;
        }

        // Make sure that we're working with the right name
        var ret, type, hooks,
            origName = jQuery.camelCase( name ),
            style = elem.style;

        name = jQuery.cssProps[ origName ] ||
            ( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

        // Gets hook for the prefixed version, then unprefixed version
        hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

        // Check if we're setting a value
        if ( value !== undefined ) {
            type = typeof value;

            // Convert "+=" or "-=" to relative numbers (#7345)
            if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
                value = adjustCSS( elem, name, ret );

                // Fixes bug #9237
                type = "number";
            }

            // Make sure that null and NaN values aren't set (#7116)
            if ( value == null || value !== value ) {
                return;
            }

            // If a number was passed in, add the unit (except for certain CSS properties)
            if ( type === "number" ) {
                value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
            }

            // Support: IE9-11+
            // background-* props affect original clone's values
            if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
                style[ name ] = "inherit";
            }

            // If a hook was provided, use that value, otherwise just set the specified value
            if ( !hooks || !( "set" in hooks ) ||
                ( value = hooks.set( elem, value, extra ) ) !== undefined ) {

                style[ name ] = value;
            }

        } else {

            // If a hook was provided get the non-computed value from there
            if ( hooks && "get" in hooks &&
                ( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

                return ret;
            }

            // Otherwise just get the value from the style object
            return style[ name ];
        }
    },

    css: function( elem, name, extra, styles ) {
        var val, num, hooks,
            origName = jQuery.camelCase( name );

        // Make sure that we're working with the right name
        name = jQuery.cssProps[ origName ] ||
            ( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

        // Try prefixed name followed by the unprefixed name
        hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

        // If a hook was provided get the computed value from there
        if ( hooks && "get" in hooks ) {
            val = hooks.get( elem, true, extra );
        }

        // Otherwise, if a way to get the computed value exists, use that
        if ( val === undefined ) {
            val = curCSS( elem, name, styles );
        }

        // Convert "normal" to computed value
        if ( val === "normal" && name in cssNormalTransform ) {
            val = cssNormalTransform[ name ];
        }

        // Make numeric if forced or a qualifier was provided and val looks numeric
        if ( extra === "" || extra ) {
            num = parseFloat( val );
            return extra === true || isFinite( num ) ? num || 0 : val;
        }
        return val;
    }
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
    jQuery.cssHooks[ name ] = {
        get: function( elem, computed, extra ) {
            if ( computed ) {

                // Certain elements can have dimension info if we invisibly show them
                // but it must have a current display style that would benefit
                return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
                    elem.offsetWidth === 0 ?
                        swap( elem, cssShow, function() {
                            return getWidthOrHeight( elem, name, extra );
                        } ) :
                        getWidthOrHeight( elem, name, extra );
            }
        },

        set: function( elem, value, extra ) {
            var matches,
                styles = extra && getStyles( elem ),
                subtract = extra && augmentWidthOrHeight(
                    elem,
                    name,
                    extra,
                    jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
                    styles
                );

            // Convert to pixels if value adjustment is needed
            if ( subtract && ( matches = rcssNum.exec( value ) ) &&
                ( matches[ 3 ] || "px" ) !== "px" ) {

                elem.style[ name ] = value;
                value = jQuery.css( elem, name );
            }

            return setPositiveNumber( elem, value, subtract );
        }
    };
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
    function( elem, computed ) {
        if ( computed ) {
            return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
                elem.getBoundingClientRect().left -
                    swap( elem, { marginLeft: 0 }, function() {
                        return elem.getBoundingClientRect().left;
                    } )
                ) + "px";
        }
    }
);

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
    function( elem, computed ) {
        if ( computed ) {
            return swap( elem, { "display": "inline-block" },
                curCSS, [ elem, "marginRight" ] );
        }
    }
);

// These hooks are used by animate to expand properties
jQuery.each( {
    margin: "",
    padding: "",
    border: "Width"
}, function( prefix, suffix ) {
    jQuery.cssHooks[ prefix + suffix ] = {
        expand: function( value ) {
            var i = 0,
                expanded = {},

                // Assumes a single number if not a string
                parts = typeof value === "string" ? value.split( " " ) : [ value ];

            for ( ; i < 4; i++ ) {
                expanded[ prefix + cssExpand[ i ] + suffix ] =
                    parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
            }

            return expanded;
        }
    };

    if ( !rmargin.test( prefix ) ) {
        jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
    }
} );

jQuery.fn.extend( {
    css: function( name, value ) {
        return access( this, function( elem, name, value ) {
            var styles, len,
                map = {},
                i = 0;

            if ( jQuery.isArray( name ) ) {
                styles = getStyles( elem );
                len = name.length;

                for ( ; i < len; i++ ) {
                    map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
                }

                return map;
            }

            return value !== undefined ?
                jQuery.style( elem, name, value ) :
                jQuery.css( elem, name );
        }, name, value, arguments.length > 1 );
    },
    show: function() {
        return showHide( this, true );
    },
    hide: function() {
        return showHide( this );
    },
    toggle: function( state ) {
        if ( typeof state === "boolean" ) {
            return state ? this.show() : this.hide();
        }

        return this.each( function() {
            if ( isHidden( this ) ) {
                jQuery( this ).show();
            } else {
                jQuery( this ).hide();
            }
        } );
    }
} );


function Tween( elem, options, prop, end, easing ) {
    return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
    constructor: Tween,
    init: function( elem, options, prop, end, easing, unit ) {
        this.elem = elem;
        this.prop = prop;
        this.easing = easing || jQuery.easing._default;
        this.options = options;
        this.start = this.now = this.cur();
        this.end = end;
        this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
    },
    cur: function() {
        var hooks = Tween.propHooks[ this.prop ];

        return hooks && hooks.get ?
            hooks.get( this ) :
            Tween.propHooks._default.get( this );
    },
    run: function( percent ) {
        var eased,
            hooks = Tween.propHooks[ this.prop ];

        if ( this.options.duration ) {
            this.pos = eased = jQuery.easing[ this.easing ](
                percent, this.options.duration * percent, 0, 1, this.options.duration
            );
        } else {
            this.pos = eased = percent;
        }
        this.now = ( this.end - this.start ) * eased + this.start;

        if ( this.options.step ) {
            this.options.step.call( this.elem, this.now, this );
        }

        if ( hooks && hooks.set ) {
            hooks.set( this );
        } else {
            Tween.propHooks._default.set( this );
        }
        return this;
    }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
    _default: {
        get: function( tween ) {
            var result;

            // Use a property on the element directly when it is not a DOM element,
            // or when there is no matching style property that exists.
            if ( tween.elem.nodeType !== 1 ||
                tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
                return tween.elem[ tween.prop ];
            }

            // Passing an empty string as a 3rd parameter to .css will automatically
            // attempt a parseFloat and fallback to a string if the parse fails.
            // Simple values such as "10px" are parsed to Float;
            // complex values such as "rotate(1rad)" are returned as-is.
            result = jQuery.css( tween.elem, tween.prop, "" );

            // Empty strings, null, undefined and "auto" are converted to 0.
            return !result || result === "auto" ? 0 : result;
        },
        set: function( tween ) {

            // Use step hook for back compat.
            // Use cssHook if its there.
            // Use .style if available and use plain properties where available.
            if ( jQuery.fx.step[ tween.prop ] ) {
                jQuery.fx.step[ tween.prop ]( tween );
            } else if ( tween.elem.nodeType === 1 &&
                ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
                    jQuery.cssHooks[ tween.prop ] ) ) {
                jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
            } else {
                tween.elem[ tween.prop ] = tween.now;
            }
        }
    }
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function( tween ) {
        if ( tween.elem.nodeType && tween.elem.parentNode ) {
            tween.elem[ tween.prop ] = tween.now;
        }
    }
};

jQuery.easing = {
    linear: function( p ) {
        return p;
    },
    swing: function( p ) {
        return 0.5 - Math.cos( p * Math.PI ) / 2;
    },
    _default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
    fxNow, timerId,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
    window.setTimeout( function() {
        fxNow = undefined;
    } );
    return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
    var which,
        i = 0,
        attrs = { height: type };

    // If we include width, step value is 1 to do all cssExpand values,
    // otherwise step value is 2 to skip over Left and Right
    includeWidth = includeWidth ? 1 : 0;
    for ( ; i < 4 ; i += 2 - includeWidth ) {
        which = cssExpand[ i ];
        attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
    }

    if ( includeWidth ) {
        attrs.opacity = attrs.width = type;
    }

    return attrs;
}

function createTween( value, prop, animation ) {
    var tween,
        collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
        index = 0,
        length = collection.length;
    for ( ; index < length; index++ ) {
        if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

            // We're done with this property
            return tween;
        }
    }
}

function defaultPrefilter( elem, props, opts ) {
    /* jshint validthis: true */
    var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
        anim = this,
        orig = {},
        style = elem.style,
        hidden = elem.nodeType && isHidden( elem ),
        dataShow = dataPriv.get( elem, "fxshow" );

    // Handle queue: false promises
    if ( !opts.queue ) {
        hooks = jQuery._queueHooks( elem, "fx" );
        if ( hooks.unqueued == null ) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function() {
                if ( !hooks.unqueued ) {
                    oldfire();
                }
            };
        }
        hooks.unqueued++;

        anim.always( function() {

            // Ensure the complete handler is called before this completes
            anim.always( function() {
                hooks.unqueued--;
                if ( !jQuery.queue( elem, "fx" ).length ) {
                    hooks.empty.fire();
                }
            } );
        } );
    }

    // Height/width overflow pass
    if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

        // Make sure that nothing sneaks out
        // Record all 3 overflow attributes because IE9-10 do not
        // change the overflow attribute when overflowX and
        // overflowY are set to the same value
        opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

        // Set display property to inline-block for height/width
        // animations on inline elements that are having width/height animated
        display = jQuery.css( elem, "display" );

        // Test default display if display is currently "none"
        checkDisplay = display === "none" ?
            dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

        if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
            style.display = "inline-block";
        }
    }

    if ( opts.overflow ) {
        style.overflow = "hidden";
        anim.always( function() {
            style.overflow = opts.overflow[ 0 ];
            style.overflowX = opts.overflow[ 1 ];
            style.overflowY = opts.overflow[ 2 ];
        } );
    }

    // show/hide pass
    for ( prop in props ) {
        value = props[ prop ];
        if ( rfxtypes.exec( value ) ) {
            delete props[ prop ];
            toggle = toggle || value === "toggle";
            if ( value === ( hidden ? "hide" : "show" ) ) {

                // If there is dataShow left over from a stopped hide or show
                // and we are going to proceed with show, we should pretend to be hidden
                if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
                    hidden = true;
                } else {
                    continue;
                }
            }
            orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

        // Any non-fx value stops us from restoring the original display value
        } else {
            display = undefined;
        }
    }

    if ( !jQuery.isEmptyObject( orig ) ) {
        if ( dataShow ) {
            if ( "hidden" in dataShow ) {
                hidden = dataShow.hidden;
            }
        } else {
            dataShow = dataPriv.access( elem, "fxshow", {} );
        }

        // Store state if its toggle - enables .stop().toggle() to "reverse"
        if ( toggle ) {
            dataShow.hidden = !hidden;
        }
        if ( hidden ) {
            jQuery( elem ).show();
        } else {
            anim.done( function() {
                jQuery( elem ).hide();
            } );
        }
        anim.done( function() {
            var prop;

            dataPriv.remove( elem, "fxshow" );
            for ( prop in orig ) {
                jQuery.style( elem, prop, orig[ prop ] );
            }
        } );
        for ( prop in orig ) {
            tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

            if ( !( prop in dataShow ) ) {
                dataShow[ prop ] = tween.start;
                if ( hidden ) {
                    tween.end = tween.start;
                    tween.start = prop === "width" || prop === "height" ? 1 : 0;
                }
            }
        }

    // If this is a noop like .hide().hide(), restore an overwritten display value
    } else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
        style.display = display;
    }
}

function propFilter( props, specialEasing ) {
    var index, name, easing, value, hooks;

    // camelCase, specialEasing and expand cssHook pass
    for ( index in props ) {
        name = jQuery.camelCase( index );
        easing = specialEasing[ name ];
        value = props[ index ];
        if ( jQuery.isArray( value ) ) {
            easing = value[ 1 ];
            value = props[ index ] = value[ 0 ];
        }

        if ( index !== name ) {
            props[ name ] = value;
            delete props[ index ];
        }

        hooks = jQuery.cssHooks[ name ];
        if ( hooks && "expand" in hooks ) {
            value = hooks.expand( value );
            delete props[ name ];

            // Not quite $.extend, this won't overwrite existing keys.
            // Reusing 'index' because we have the correct "name"
            for ( index in value ) {
                if ( !( index in props ) ) {
                    props[ index ] = value[ index ];
                    specialEasing[ index ] = easing;
                }
            }
        } else {
            specialEasing[ name ] = easing;
        }
    }
}

function Animation( elem, properties, options ) {
    var result,
        stopped,
        index = 0,
        length = Animation.prefilters.length,
        deferred = jQuery.Deferred().always( function() {

            // Don't match elem in the :animated selector
            delete tick.elem;
        } ),
        tick = function() {
            if ( stopped ) {
                return false;
            }
            var currentTime = fxNow || createFxNow(),
                remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

                // Support: Android 2.3
                // Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
                temp = remaining / animation.duration || 0,
                percent = 1 - temp,
                index = 0,
                length = animation.tweens.length;

            for ( ; index < length ; index++ ) {
                animation.tweens[ index ].run( percent );
            }

            deferred.notifyWith( elem, [ animation, percent, remaining ] );

            if ( percent < 1 && length ) {
                return remaining;
            } else {
                deferred.resolveWith( elem, [ animation ] );
                return false;
            }
        },
        animation = deferred.promise( {
            elem: elem,
            props: jQuery.extend( {}, properties ),
            opts: jQuery.extend( true, {
                specialEasing: {},
                easing: jQuery.easing._default
            }, options ),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function( prop, end ) {
                var tween = jQuery.Tween( elem, animation.opts, prop, end,
                        animation.opts.specialEasing[ prop ] || animation.opts.easing );
                animation.tweens.push( tween );
                return tween;
            },
            stop: function( gotoEnd ) {
                var index = 0,

                    // If we are going to the end, we want to run all the tweens
                    // otherwise we skip this part
                    length = gotoEnd ? animation.tweens.length : 0;
                if ( stopped ) {
                    return this;
                }
                stopped = true;
                for ( ; index < length ; index++ ) {
                    animation.tweens[ index ].run( 1 );
                }

                // Resolve when we played the last frame; otherwise, reject
                if ( gotoEnd ) {
                    deferred.notifyWith( elem, [ animation, 1, 0 ] );
                    deferred.resolveWith( elem, [ animation, gotoEnd ] );
                } else {
                    deferred.rejectWith( elem, [ animation, gotoEnd ] );
                }
                return this;
            }
        } ),
        props = animation.props;

    propFilter( props, animation.opts.specialEasing );

    for ( ; index < length ; index++ ) {
        result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
        if ( result ) {
            if ( jQuery.isFunction( result.stop ) ) {
                jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
                    jQuery.proxy( result.stop, result );
            }
            return result;
        }
    }

    jQuery.map( props, createTween, animation );

    if ( jQuery.isFunction( animation.opts.start ) ) {
        animation.opts.start.call( elem, animation );
    }

    jQuery.fx.timer(
        jQuery.extend( tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
        } )
    );

    // attach callbacks from options
    return animation.progress( animation.opts.progress )
        .done( animation.opts.done, animation.opts.complete )
        .fail( animation.opts.fail )
        .always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
    tweeners: {
        "*": [ function( prop, value ) {
            var tween = this.createTween( prop, value );
            adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
            return tween;
        } ]
    },

    tweener: function( props, callback ) {
        if ( jQuery.isFunction( props ) ) {
            callback = props;
            props = [ "*" ];
        } else {
            props = props.match( rnotwhite );
        }

        var prop,
            index = 0,
            length = props.length;

        for ( ; index < length ; index++ ) {
            prop = props[ index ];
            Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
            Animation.tweeners[ prop ].unshift( callback );
        }
    },

    prefilters: [ defaultPrefilter ],

    prefilter: function( callback, prepend ) {
        if ( prepend ) {
            Animation.prefilters.unshift( callback );
        } else {
            Animation.prefilters.push( callback );
        }
    }
} );

jQuery.speed = function( speed, easing, fn ) {
    var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
        complete: fn || !fn && easing ||
            jQuery.isFunction( speed ) && speed,
        duration: speed,
        easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
    };

    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
        opt.duration : opt.duration in jQuery.fx.speeds ?
            jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

    // Normalize opt.queue - true/undefined/null -> "fx"
    if ( opt.queue == null || opt.queue === true ) {
        opt.queue = "fx";
    }

    // Queueing
    opt.old = opt.complete;

    opt.complete = function() {
        if ( jQuery.isFunction( opt.old ) ) {
            opt.old.call( this );
        }

        if ( opt.queue ) {
            jQuery.dequeue( this, opt.queue );
        }
    };

    return opt;
};

jQuery.fn.extend( {
    fadeTo: function( speed, to, easing, callback ) {

        // Show any hidden elements after setting opacity to 0
        return this.filter( isHidden ).css( "opacity", 0 ).show()

            // Animate to the value specified
            .end().animate( { opacity: to }, speed, easing, callback );
    },
    animate: function( prop, speed, easing, callback ) {
        var empty = jQuery.isEmptyObject( prop ),
            optall = jQuery.speed( speed, easing, callback ),
            doAnimation = function() {

                // Operate on a copy of prop so per-property easing won't be lost
                var anim = Animation( this, jQuery.extend( {}, prop ), optall );

                // Empty animations, or finishing resolves immediately
                if ( empty || dataPriv.get( this, "finish" ) ) {
                    anim.stop( true );
                }
            };
            doAnimation.finish = doAnimation;

        return empty || optall.queue === false ?
            this.each( doAnimation ) :
            this.queue( optall.queue, doAnimation );
    },
    stop: function( type, clearQueue, gotoEnd ) {
        var stopQueue = function( hooks ) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop( gotoEnd );
        };

        if ( typeof type !== "string" ) {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = undefined;
        }
        if ( clearQueue && type !== false ) {
            this.queue( type || "fx", [] );
        }

        return this.each( function() {
            var dequeue = true,
                index = type != null && type + "queueHooks",
                timers = jQuery.timers,
                data = dataPriv.get( this );

            if ( index ) {
                if ( data[ index ] && data[ index ].stop ) {
                    stopQueue( data[ index ] );
                }
            } else {
                for ( index in data ) {
                    if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                        stopQueue( data[ index ] );
                    }
                }
            }

            for ( index = timers.length; index--; ) {
                if ( timers[ index ].elem === this &&
                    ( type == null || timers[ index ].queue === type ) ) {

                    timers[ index ].anim.stop( gotoEnd );
                    dequeue = false;
                    timers.splice( index, 1 );
                }
            }

            // Start the next in the queue if the last step wasn't forced.
            // Timers currently will call their complete callbacks, which
            // will dequeue but only if they were gotoEnd.
            if ( dequeue || !gotoEnd ) {
                jQuery.dequeue( this, type );
            }
        } );
    },
    finish: function( type ) {
        if ( type !== false ) {
            type = type || "fx";
        }
        return this.each( function() {
            var index,
                data = dataPriv.get( this ),
                queue = data[ type + "queue" ],
                hooks = data[ type + "queueHooks" ],
                timers = jQuery.timers,
                length = queue ? queue.length : 0;

            // Enable finishing flag on private data
            data.finish = true;

            // Empty the queue first
            jQuery.queue( this, type, [] );

            if ( hooks && hooks.stop ) {
                hooks.stop.call( this, true );
            }

            // Look for any active animations, and finish them
            for ( index = timers.length; index--; ) {
                if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
                    timers[ index ].anim.stop( true );
                    timers.splice( index, 1 );
                }
            }

            // Look for any animations in the old queue and finish them
            for ( index = 0; index < length; index++ ) {
                if ( queue[ index ] && queue[ index ].finish ) {
                    queue[ index ].finish.call( this );
                }
            }

            // Turn off finishing flag
            delete data.finish;
        } );
    }
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
    var cssFn = jQuery.fn[ name ];
    jQuery.fn[ name ] = function( speed, easing, callback ) {
        return speed == null || typeof speed === "boolean" ?
            cssFn.apply( this, arguments ) :
            this.animate( genFx( name, true ), speed, easing, callback );
    };
} );

// Generate shortcuts for custom animations
jQuery.each( {
    slideDown: genFx( "show" ),
    slideUp: genFx( "hide" ),
    slideToggle: genFx( "toggle" ),
    fadeIn: { opacity: "show" },
    fadeOut: { opacity: "hide" },
    fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
    jQuery.fn[ name ] = function( speed, easing, callback ) {
        return this.animate( props, speed, easing, callback );
    };
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
    var timer,
        i = 0,
        timers = jQuery.timers;

    fxNow = jQuery.now();

    for ( ; i < timers.length; i++ ) {
        timer = timers[ i ];

        // Checks the timer has not already been removed
        if ( !timer() && timers[ i ] === timer ) {
            timers.splice( i--, 1 );
        }
    }

    if ( !timers.length ) {
        jQuery.fx.stop();
    }
    fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
    jQuery.timers.push( timer );
    if ( timer() ) {
        jQuery.fx.start();
    } else {
        jQuery.timers.pop();
    }
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
    if ( !timerId ) {
        timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
    }
};

jQuery.fx.stop = function() {
    window.clearInterval( timerId );

    timerId = null;
};

jQuery.fx.speeds = {
    slow: 600,
    fast: 200,

    // Default speed
    _default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
    time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    type = type || "fx";

    return this.queue( type, function( next, hooks ) {
        var timeout = window.setTimeout( next, time );
        hooks.stop = function() {
            window.clearTimeout( timeout );
        };
    } );
};


( function() {
    var input = document.createElement( "input" ),
        select = document.createElement( "select" ),
        opt = select.appendChild( document.createElement( "option" ) );

    input.type = "checkbox";

    // Support: iOS<=5.1, Android<=4.2+
    // Default value for a checkbox should be "on"
    support.checkOn = input.value !== "";

    // Support: IE<=11+
    // Must access selectedIndex to make default options select
    support.optSelected = opt.selected;

    // Support: Android<=2.3
    // Options inside disabled selects are incorrectly marked as disabled
    select.disabled = true;
    support.optDisabled = !opt.disabled;

    // Support: IE<=11+
    // An input loses its value after becoming a radio
    input = document.createElement( "input" );
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";
} )();


var boolHook,
    attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
    attr: function( name, value ) {
        return access( this, jQuery.attr, name, value, arguments.length > 1 );
    },

    removeAttr: function( name ) {
        return this.each( function() {
            jQuery.removeAttr( this, name );
        } );
    }
} );

jQuery.extend( {
    attr: function( elem, name, value ) {
        var ret, hooks,
            nType = elem.nodeType;

        // Don't get/set attributes on text, comment and attribute nodes
        if ( nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        // Fallback to prop when attributes are not supported
        if ( typeof elem.getAttribute === "undefined" ) {
            return jQuery.prop( elem, name, value );
        }

        // All attributes are lowercase
        // Grab necessary hook if one is defined
        if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
            name = name.toLowerCase();
            hooks = jQuery.attrHooks[ name ] ||
                ( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
        }

        if ( value !== undefined ) {
            if ( value === null ) {
                jQuery.removeAttr( elem, name );
                return;
            }

            if ( hooks && "set" in hooks &&
                ( ret = hooks.set( elem, value, name ) ) !== undefined ) {
                return ret;
            }

            elem.setAttribute( name, value + "" );
            return value;
        }

        if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
            return ret;
        }

        ret = jQuery.find.attr( elem, name );

        // Non-existent attributes return null, we normalize to undefined
        return ret == null ? undefined : ret;
    },

    attrHooks: {
        type: {
            set: function( elem, value ) {
                if ( !support.radioValue && value === "radio" &&
                    jQuery.nodeName( elem, "input" ) ) {
                    var val = elem.value;
                    elem.setAttribute( "type", value );
                    if ( val ) {
                        elem.value = val;
                    }
                    return value;
                }
            }
        }
    },

    removeAttr: function( elem, value ) {
        var name, propName,
            i = 0,
            attrNames = value && value.match( rnotwhite );

        if ( attrNames && elem.nodeType === 1 ) {
            while ( ( name = attrNames[ i++ ] ) ) {
                propName = jQuery.propFix[ name ] || name;

                // Boolean attributes get special treatment (#10870)
                if ( jQuery.expr.match.bool.test( name ) ) {

                    // Set corresponding property to false
                    elem[ propName ] = false;
                }

                elem.removeAttribute( name );
            }
        }
    }
} );

// Hooks for boolean attributes
boolHook = {
    set: function( elem, value, name ) {
        if ( value === false ) {

            // Remove boolean attributes when set to false
            jQuery.removeAttr( elem, name );
        } else {
            elem.setAttribute( name, name );
        }
        return name;
    }
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
    var getter = attrHandle[ name ] || jQuery.find.attr;

    attrHandle[ name ] = function( elem, name, isXML ) {
        var ret, handle;
        if ( !isXML ) {

            // Avoid an infinite loop by temporarily removing this function from the getter
            handle = attrHandle[ name ];
            attrHandle[ name ] = ret;
            ret = getter( elem, name, isXML ) != null ?
                name.toLowerCase() :
                null;
            attrHandle[ name ] = handle;
        }
        return ret;
    };
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
    rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
    prop: function( name, value ) {
        return access( this, jQuery.prop, name, value, arguments.length > 1 );
    },

    removeProp: function( name ) {
        return this.each( function() {
            delete this[ jQuery.propFix[ name ] || name ];
        } );
    }
} );

jQuery.extend( {
    prop: function( elem, name, value ) {
        var ret, hooks,
            nType = elem.nodeType;

        // Don't get/set properties on text, comment and attribute nodes
        if ( nType === 3 || nType === 8 || nType === 2 ) {
            return;
        }

        if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

            // Fix name and attach hooks
            name = jQuery.propFix[ name ] || name;
            hooks = jQuery.propHooks[ name ];
        }

        if ( value !== undefined ) {
            if ( hooks && "set" in hooks &&
                ( ret = hooks.set( elem, value, name ) ) !== undefined ) {
                return ret;
            }

            return ( elem[ name ] = value );
        }

        if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
            return ret;
        }

        return elem[ name ];
    },

    propHooks: {
        tabIndex: {
            get: function( elem ) {

                // elem.tabIndex doesn't always return the
                // correct value when it hasn't been explicitly set
                // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                // Use proper attribute retrieval(#12072)
                var tabindex = jQuery.find.attr( elem, "tabindex" );

                return tabindex ?
                    parseInt( tabindex, 10 ) :
                    rfocusable.test( elem.nodeName ) ||
                        rclickable.test( elem.nodeName ) && elem.href ?
                            0 :
                            -1;
            }
        }
    },

    propFix: {
        "for": "htmlFor",
        "class": "className"
    }
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
    jQuery.propHooks.selected = {
        get: function( elem ) {
            var parent = elem.parentNode;
            if ( parent && parent.parentNode ) {
                parent.parentNode.selectedIndex;
            }
            return null;
        },
        set: function( elem ) {
            var parent = elem.parentNode;
            if ( parent ) {
                parent.selectedIndex;

                if ( parent.parentNode ) {
                    parent.parentNode.selectedIndex;
                }
            }
        }
    };
}

jQuery.each( [
    "tabIndex",
    "readOnly",
    "maxLength",
    "cellSpacing",
    "cellPadding",
    "rowSpan",
    "colSpan",
    "useMap",
    "frameBorder",
    "contentEditable"
], function() {
    jQuery.propFix[ this.toLowerCase() ] = this;
} );




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
    return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
    addClass: function( value ) {
        var classes, elem, cur, curValue, clazz, j, finalValue,
            i = 0;

        if ( jQuery.isFunction( value ) ) {
            return this.each( function( j ) {
                jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
            } );
        }

        if ( typeof value === "string" && value ) {
            classes = value.match( rnotwhite ) || [];

            while ( ( elem = this[ i++ ] ) ) {
                curValue = getClass( elem );
                cur = elem.nodeType === 1 &&
                    ( " " + curValue + " " ).replace( rclass, " " );

                if ( cur ) {
                    j = 0;
                    while ( ( clazz = classes[ j++ ] ) ) {
                        if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
                            cur += clazz + " ";
                        }
                    }

                    // Only assign if different to avoid unneeded rendering.
                    finalValue = jQuery.trim( cur );
                    if ( curValue !== finalValue ) {
                        elem.setAttribute( "class", finalValue );
                    }
                }
            }
        }

        return this;
    },

    removeClass: function( value ) {
        var classes, elem, cur, curValue, clazz, j, finalValue,
            i = 0;

        if ( jQuery.isFunction( value ) ) {
            return this.each( function( j ) {
                jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
            } );
        }

        if ( !arguments.length ) {
            return this.attr( "class", "" );
        }

        if ( typeof value === "string" && value ) {
            classes = value.match( rnotwhite ) || [];

            while ( ( elem = this[ i++ ] ) ) {
                curValue = getClass( elem );

                // This expression is here for better compressibility (see addClass)
                cur = elem.nodeType === 1 &&
                    ( " " + curValue + " " ).replace( rclass, " " );

                if ( cur ) {
                    j = 0;
                    while ( ( clazz = classes[ j++ ] ) ) {

                        // Remove *all* instances
                        while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
                            cur = cur.replace( " " + clazz + " ", " " );
                        }
                    }

                    // Only assign if different to avoid unneeded rendering.
                    finalValue = jQuery.trim( cur );
                    if ( curValue !== finalValue ) {
                        elem.setAttribute( "class", finalValue );
                    }
                }
            }
        }

        return this;
    },

    toggleClass: function( value, stateVal ) {
        var type = typeof value;

        if ( typeof stateVal === "boolean" && type === "string" ) {
            return stateVal ? this.addClass( value ) : this.removeClass( value );
        }

        if ( jQuery.isFunction( value ) ) {
            return this.each( function( i ) {
                jQuery( this ).toggleClass(
                    value.call( this, i, getClass( this ), stateVal ),
                    stateVal
                );
            } );
        }

        return this.each( function() {
            var className, i, self, classNames;

            if ( type === "string" ) {

                // Toggle individual class names
                i = 0;
                self = jQuery( this );
                classNames = value.match( rnotwhite ) || [];

                while ( ( className = classNames[ i++ ] ) ) {

                    // Check each className given, space separated list
                    if ( self.hasClass( className ) ) {
                        self.removeClass( className );
                    } else {
                        self.addClass( className );
                    }
                }

            // Toggle whole class name
            } else if ( value === undefined || type === "boolean" ) {
                className = getClass( this );
                if ( className ) {

                    // Store className if set
                    dataPriv.set( this, "__className__", className );
                }

                // If the element has a class name or if we're passed `false`,
                // then remove the whole classname (if there was one, the above saved it).
                // Otherwise bring back whatever was previously saved (if anything),
                // falling back to the empty string if nothing was stored.
                if ( this.setAttribute ) {
                    this.setAttribute( "class",
                        className || value === false ?
                        "" :
                        dataPriv.get( this, "__className__" ) || ""
                    );
                }
            }
        } );
    },

    hasClass: function( selector ) {
        var className, elem,
            i = 0;

        className = " " + selector + " ";
        while ( ( elem = this[ i++ ] ) ) {
            if ( elem.nodeType === 1 &&
                ( " " + getClass( elem ) + " " ).replace( rclass, " " )
                    .indexOf( className ) > -1
            ) {
                return true;
            }
        }

        return false;
    }
} );




var rreturn = /\r/g,
    rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
    val: function( value ) {
        var hooks, ret, isFunction,
            elem = this[ 0 ];

        if ( !arguments.length ) {
            if ( elem ) {
                hooks = jQuery.valHooks[ elem.type ] ||
                    jQuery.valHooks[ elem.nodeName.toLowerCase() ];

                if ( hooks &&
                    "get" in hooks &&
                    ( ret = hooks.get( elem, "value" ) ) !== undefined
                ) {
                    return ret;
                }

                ret = elem.value;

                return typeof ret === "string" ?

                    // Handle most common string cases
                    ret.replace( rreturn, "" ) :

                    // Handle cases where value is null/undef or number
                    ret == null ? "" : ret;
            }

            return;
        }

        isFunction = jQuery.isFunction( value );

        return this.each( function( i ) {
            var val;

            if ( this.nodeType !== 1 ) {
                return;
            }

            if ( isFunction ) {
                val = value.call( this, i, jQuery( this ).val() );
            } else {
                val = value;
            }

            // Treat null/undefined as ""; convert numbers to string
            if ( val == null ) {
                val = "";

            } else if ( typeof val === "number" ) {
                val += "";

            } else if ( jQuery.isArray( val ) ) {
                val = jQuery.map( val, function( value ) {
                    return value == null ? "" : value + "";
                } );
            }

            hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

            // If set returns undefined, fall back to normal setting
            if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
                this.value = val;
            }
        } );
    }
} );

jQuery.extend( {
    valHooks: {
        option: {
            get: function( elem ) {

                var val = jQuery.find.attr( elem, "value" );
                return val != null ?
                    val :

                    // Support: IE10-11+
                    // option.text throws exceptions (#14686, #14858)
                    // Strip and collapse whitespace
                    // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                    jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
            }
        },
        select: {
            get: function( elem ) {
                var value, option,
                    options = elem.options,
                    index = elem.selectedIndex,
                    one = elem.type === "select-one" || index < 0,
                    values = one ? null : [],
                    max = one ? index + 1 : options.length,
                    i = index < 0 ?
                        max :
                        one ? index : 0;

                // Loop through all the selected options
                for ( ; i < max; i++ ) {
                    option = options[ i ];

                    // IE8-9 doesn't update selected after form reset (#2551)
                    if ( ( option.selected || i === index ) &&

                            // Don't return options that are disabled or in a disabled optgroup
                            ( support.optDisabled ?
                                !option.disabled : option.getAttribute( "disabled" ) === null ) &&
                            ( !option.parentNode.disabled ||
                                !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

                        // Get the specific value for the option
                        value = jQuery( option ).val();

                        // We don't need an array for one selects
                        if ( one ) {
                            return value;
                        }

                        // Multi-Selects return an array
                        values.push( value );
                    }
                }

                return values;
            },

            set: function( elem, value ) {
                var optionSet, option,
                    options = elem.options,
                    values = jQuery.makeArray( value ),
                    i = options.length;

                while ( i-- ) {
                    option = options[ i ];
                    if ( option.selected =
                        jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
                    ) {
                        optionSet = true;
                    }
                }

                // Force browsers to behave consistently when non-matching value is set
                if ( !optionSet ) {
                    elem.selectedIndex = -1;
                }
                return values;
            }
        }
    }
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = {
        set: function( elem, value ) {
            if ( jQuery.isArray( value ) ) {
                return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
            }
        }
    };
    if ( !support.checkOn ) {
        jQuery.valHooks[ this ].get = function( elem ) {
            return elem.getAttribute( "value" ) === null ? "on" : elem.value;
        };
    }
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

    trigger: function( event, data, elem, onlyHandlers ) {

        var i, cur, tmp, bubbleType, ontype, handle, special,
            eventPath = [ elem || document ],
            type = hasOwn.call( event, "type" ) ? event.type : event,
            namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

        cur = tmp = elem = elem || document;

        // Don't do events on text and comment nodes
        if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
            return;
        }

        // focus/blur morphs to focusin/out; ensure we're not firing them right now
        if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
            return;
        }

        if ( type.indexOf( "." ) > -1 ) {

            // Namespaced trigger; create a regexp to match event type in handle()
            namespaces = type.split( "." );
            type = namespaces.shift();
            namespaces.sort();
        }
        ontype = type.indexOf( ":" ) < 0 && "on" + type;

        // Caller can pass in a jQuery.Event object, Object, or just an event type string
        event = event[ jQuery.expando ] ?
            event :
            new jQuery.Event( type, typeof event === "object" && event );

        // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
        event.isTrigger = onlyHandlers ? 2 : 3;
        event.namespace = namespaces.join( "." );
        event.rnamespace = event.namespace ?
            new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
            null;

        // Clean up the event in case it is being reused
        event.result = undefined;
        if ( !event.target ) {
            event.target = elem;
        }

        // Clone any incoming data and prepend the event, creating the handler arg list
        data = data == null ?
            [ event ] :
            jQuery.makeArray( data, [ event ] );

        // Allow special events to draw outside the lines
        special = jQuery.event.special[ type ] || {};
        if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
            return;
        }

        // Determine event propagation path in advance, per W3C events spec (#9951)
        // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
        if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

            bubbleType = special.delegateType || type;
            if ( !rfocusMorph.test( bubbleType + type ) ) {
                cur = cur.parentNode;
            }
            for ( ; cur; cur = cur.parentNode ) {
                eventPath.push( cur );
                tmp = cur;
            }

            // Only add window if we got to document (e.g., not plain obj or detached DOM)
            if ( tmp === ( elem.ownerDocument || document ) ) {
                eventPath.push( tmp.defaultView || tmp.parentWindow || window );
            }
        }

        // Fire handlers on the event path
        i = 0;
        while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

            event.type = i > 1 ?
                bubbleType :
                special.bindType || type;

            // jQuery handler
            handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
                dataPriv.get( cur, "handle" );
            if ( handle ) {
                handle.apply( cur, data );
            }

            // Native handler
            handle = ontype && cur[ ontype ];
            if ( handle && handle.apply && acceptData( cur ) ) {
                event.result = handle.apply( cur, data );
                if ( event.result === false ) {
                    event.preventDefault();
                }
            }
        }
        event.type = type;

        // If nobody prevented the default action, do it now
        if ( !onlyHandlers && !event.isDefaultPrevented() ) {

            if ( ( !special._default ||
                special._default.apply( eventPath.pop(), data ) === false ) &&
                acceptData( elem ) ) {

                // Call a native DOM method on the target with the same name name as the event.
                // Don't do default actions on window, that's where global variables be (#6170)
                if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

                    // Don't re-trigger an onFOO event when we call its FOO() method
                    tmp = elem[ ontype ];

                    if ( tmp ) {
                        elem[ ontype ] = null;
                    }

                    // Prevent re-triggering of the same event, since we already bubbled it above
                    jQuery.event.triggered = type;
                    elem[ type ]();
                    jQuery.event.triggered = undefined;

                    if ( tmp ) {
                        elem[ ontype ] = tmp;
                    }
                }
            }
        }

        return event.result;
    },

    // Piggyback on a donor event to simulate a different one
    // Used only for `focus(in | out)` events
    simulate: function( type, elem, event ) {
        var e = jQuery.extend(
            new jQuery.Event(),
            event,
            {
                type: type,
                isSimulated: true
            }
        );

        jQuery.event.trigger( e, null, elem );
    }

} );

jQuery.fn.extend( {

    trigger: function( type, data ) {
        return this.each( function() {
            jQuery.event.trigger( type, data, this );
        } );
    },
    triggerHandler: function( type, data ) {
        var elem = this[ 0 ];
        if ( elem ) {
            return jQuery.event.trigger( type, data, elem, true );
        }
    }
} );


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu" ).split( " " ),
    function( i, name ) {

    // Handle event binding
    jQuery.fn[ name ] = function( data, fn ) {
        return arguments.length > 0 ?
            this.on( name, null, data, fn ) :
            this.trigger( name );
    };
} );

jQuery.fn.extend( {
    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
} );




support.focusin = "onfocusin" in window;


// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
    jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

        // Attach a single capturing handler on the document while someone wants focusin/focusout
        var handler = function( event ) {
            jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
        };

        jQuery.event.special[ fix ] = {
            setup: function() {
                var doc = this.ownerDocument || this,
                    attaches = dataPriv.access( doc, fix );

                if ( !attaches ) {
                    doc.addEventListener( orig, handler, true );
                }
                dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
            },
            teardown: function() {
                var doc = this.ownerDocument || this,
                    attaches = dataPriv.access( doc, fix ) - 1;

                if ( !attaches ) {
                    doc.removeEventListener( orig, handler, true );
                    dataPriv.remove( doc, fix );

                } else {
                    dataPriv.access( doc, fix, attaches );
                }
            }
        };
    } );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
    return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
    var xml;
    if ( !data || typeof data !== "string" ) {
        return null;
    }

    // Support: IE9
    try {
        xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
    } catch ( e ) {
        xml = undefined;
    }

    if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
        jQuery.error( "Invalid XML: " + data );
    }
    return xml;
};


var
    rhash = /#.*$/,
    rts = /([?&])_=[^&]*/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
    prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
    transports = {},

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = "*/".concat( "*" ),

    // Anchor tag for parsing the document origin
    originAnchor = document.createElement( "a" );
    originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

    // dataTypeExpression is optional and defaults to "*"
    return function( dataTypeExpression, func ) {

        if ( typeof dataTypeExpression !== "string" ) {
            func = dataTypeExpression;
            dataTypeExpression = "*";
        }

        var dataType,
            i = 0,
            dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

        if ( jQuery.isFunction( func ) ) {

            // For each dataType in the dataTypeExpression
            while ( ( dataType = dataTypes[ i++ ] ) ) {

                // Prepend if requested
                if ( dataType[ 0 ] === "+" ) {
                    dataType = dataType.slice( 1 ) || "*";
                    ( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

                // Otherwise append
                } else {
                    ( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
                }
            }
        }
    };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

    var inspected = {},
        seekingTransport = ( structure === transports );

    function inspect( dataType ) {
        var selected;
        inspected[ dataType ] = true;
        jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
            var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
            if ( typeof dataTypeOrTransport === "string" &&
                !seekingTransport && !inspected[ dataTypeOrTransport ] ) {

                options.dataTypes.unshift( dataTypeOrTransport );
                inspect( dataTypeOrTransport );
                return false;
            } else if ( seekingTransport ) {
                return !( selected = dataTypeOrTransport );
            }
        } );
        return selected;
    }

    return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
    var key, deep,
        flatOptions = jQuery.ajaxSettings.flatOptions || {};

    for ( key in src ) {
        if ( src[ key ] !== undefined ) {
            ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
        }
    }
    if ( deep ) {
        jQuery.extend( true, target, deep );
    }

    return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

    var ct, type, finalDataType, firstDataType,
        contents = s.contents,
        dataTypes = s.dataTypes;

    // Remove auto dataType and get content-type in the process
    while ( dataTypes[ 0 ] === "*" ) {
        dataTypes.shift();
        if ( ct === undefined ) {
            ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
        }
    }

    // Check if we're dealing with a known content-type
    if ( ct ) {
        for ( type in contents ) {
            if ( contents[ type ] && contents[ type ].test( ct ) ) {
                dataTypes.unshift( type );
                break;
            }
        }
    }

    // Check to see if we have a response for the expected dataType
    if ( dataTypes[ 0 ] in responses ) {
        finalDataType = dataTypes[ 0 ];
    } else {

        // Try convertible dataTypes
        for ( type in responses ) {
            if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
                finalDataType = type;
                break;
            }
            if ( !firstDataType ) {
                firstDataType = type;
            }
        }

        // Or just use first one
        finalDataType = finalDataType || firstDataType;
    }

    // If we found a dataType
    // We add the dataType to the list if needed
    // and return the corresponding response
    if ( finalDataType ) {
        if ( finalDataType !== dataTypes[ 0 ] ) {
            dataTypes.unshift( finalDataType );
        }
        return responses[ finalDataType ];
    }
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
    var conv2, current, conv, tmp, prev,
        converters = {},

        // Work with a copy of dataTypes in case we need to modify it for conversion
        dataTypes = s.dataTypes.slice();

    // Create converters map with lowercased keys
    if ( dataTypes[ 1 ] ) {
        for ( conv in s.converters ) {
            converters[ conv.toLowerCase() ] = s.converters[ conv ];
        }
    }

    current = dataTypes.shift();

    // Convert to each sequential dataType
    while ( current ) {

        if ( s.responseFields[ current ] ) {
            jqXHR[ s.responseFields[ current ] ] = response;
        }

        // Apply the dataFilter if provided
        if ( !prev && isSuccess && s.dataFilter ) {
            response = s.dataFilter( response, s.dataType );
        }

        prev = current;
        current = dataTypes.shift();

        if ( current ) {

        // There's only work to do if current dataType is non-auto
            if ( current === "*" ) {

                current = prev;

            // Convert response if prev dataType is non-auto and differs from current
            } else if ( prev !== "*" && prev !== current ) {

                // Seek a direct converter
                conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                // If none found, seek a pair
                if ( !conv ) {
                    for ( conv2 in converters ) {

                        // If conv2 outputs current
                        tmp = conv2.split( " " );
                        if ( tmp[ 1 ] === current ) {

                            // If prev can be converted to accepted input
                            conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                converters[ "* " + tmp[ 0 ] ];
                            if ( conv ) {

                                // Condense equivalence converters
                                if ( conv === true ) {
                                    conv = converters[ conv2 ];

                                // Otherwise, insert the intermediate dataType
                                } else if ( converters[ conv2 ] !== true ) {
                                    current = tmp[ 0 ];
                                    dataTypes.unshift( tmp[ 1 ] );
                                }
                                break;
                            }
                        }
                    }
                }

                // Apply converter (if not an equivalence)
                if ( conv !== true ) {

                    // Unless errors are allowed to bubble, catch and return them
                    if ( conv && s.throws ) {
                        response = conv( response );
                    } else {
                        try {
                            response = conv( response );
                        } catch ( e ) {
                            return {
                                state: "parsererror",
                                error: conv ? e : "No conversion from " + prev + " to " + current
                            };
                        }
                    }
                }
            }
        }
    }

    return { state: "success", data: response };
}

jQuery.extend( {

    // Counter for holding the number of active queries
    active: 0,

    // Last-Modified header cache for next request
    lastModified: {},
    etag: {},

    ajaxSettings: {
        url: location.href,
        type: "GET",
        isLocal: rlocalProtocol.test( location.protocol ),
        global: true,
        processData: true,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        /*
        timeout: 0,
        data: null,
        dataType: null,
        username: null,
        password: null,
        cache: null,
        throws: false,
        traditional: false,
        headers: {},
        */

        accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
        },

        contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
        },

        responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
        },

        // Data converters
        // Keys separate source (or catchall "*") and destination types with a single space
        converters: {

            // Convert anything to text
            "* text": String,

            // Text to html (true = no transformation)
            "text html": true,

            // Evaluate text as a json expression
            "text json": jQuery.parseJSON,

            // Parse text as xml
            "text xml": jQuery.parseXML
        },

        // For options that shouldn't be deep extended:
        // you can add your own custom options here if
        // and when you create one that shouldn't be
        // deep extended (see ajaxExtend)
        flatOptions: {
            url: true,
            context: true
        }
    },

    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function( target, settings ) {
        return settings ?

            // Building a settings object
            ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

            // Extending ajaxSettings
            ajaxExtend( jQuery.ajaxSettings, target );
    },

    ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    ajaxTransport: addToPrefiltersOrTransports( transports ),

    // Main method
    ajax: function( url, options ) {

        // If url is an object, simulate pre-1.5 signature
        if ( typeof url === "object" ) {
            options = url;
            url = undefined;
        }

        // Force options to be an object
        options = options || {};

        var transport,

            // URL without anti-cache param
            cacheURL,

            // Response headers
            responseHeadersString,
            responseHeaders,

            // timeout handle
            timeoutTimer,

            // Url cleanup var
            urlAnchor,

            // To know if global events are to be dispatched
            fireGlobals,

            // Loop variable
            i,

            // Create the final options object
            s = jQuery.ajaxSetup( {}, options ),

            // Callbacks context
            callbackContext = s.context || s,

            // Context for global events is callbackContext if it is a DOM node or jQuery collection
            globalEventContext = s.context &&
                ( callbackContext.nodeType || callbackContext.jquery ) ?
                    jQuery( callbackContext ) :
                    jQuery.event,

            // Deferreds
            deferred = jQuery.Deferred(),
            completeDeferred = jQuery.Callbacks( "once memory" ),

            // Status-dependent callbacks
            statusCode = s.statusCode || {},

            // Headers (they are sent all at once)
            requestHeaders = {},
            requestHeadersNames = {},

            // The jqXHR state
            state = 0,

            // Default abort message
            strAbort = "canceled",

            // Fake xhr
            jqXHR = {
                readyState: 0,

                // Builds headers hashtable if needed
                getResponseHeader: function( key ) {
                    var match;
                    if ( state === 2 ) {
                        if ( !responseHeaders ) {
                            responseHeaders = {};
                            while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
                            }
                        }
                        match = responseHeaders[ key.toLowerCase() ];
                    }
                    return match == null ? null : match;
                },

                // Raw string
                getAllResponseHeaders: function() {
                    return state === 2 ? responseHeadersString : null;
                },

                // Caches the header
                setRequestHeader: function( name, value ) {
                    var lname = name.toLowerCase();
                    if ( !state ) {
                        name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                        requestHeaders[ name ] = value;
                    }
                    return this;
                },

                // Overrides response content-type header
                overrideMimeType: function( type ) {
                    if ( !state ) {
                        s.mimeType = type;
                    }
                    return this;
                },

                // Status-dependent callbacks
                statusCode: function( map ) {
                    var code;
                    if ( map ) {
                        if ( state < 2 ) {
                            for ( code in map ) {

                                // Lazy-add the new callback in a way that preserves old ones
                                statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
                            }
                        } else {

                            // Execute the appropriate callbacks
                            jqXHR.always( map[ jqXHR.status ] );
                        }
                    }
                    return this;
                },

                // Cancel the request
                abort: function( statusText ) {
                    var finalText = statusText || strAbort;
                    if ( transport ) {
                        transport.abort( finalText );
                    }
                    done( 0, finalText );
                    return this;
                }
            };

        // Attach deferreds
        deferred.promise( jqXHR ).complete = completeDeferred.add;
        jqXHR.success = jqXHR.done;
        jqXHR.error = jqXHR.fail;

        // Remove hash character (#7531: and string promotion)
        // Add protocol if not provided (prefilters might expect it)
        // Handle falsy url in the settings object (#10093: consistency with old signature)
        // We also use the url parameter if available
        s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
            .replace( rprotocol, location.protocol + "//" );

        // Alias method option to type as per ticket #12004
        s.type = options.method || options.type || s.method || s.type;

        // Extract dataTypes list
        s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

        // A cross-domain request is in order when the origin doesn't match the current origin.
        if ( s.crossDomain == null ) {
            urlAnchor = document.createElement( "a" );

            // Support: IE8-11+
            // IE throws exception if url is malformed, e.g. http://example.com:80x/
            try {
                urlAnchor.href = s.url;

                // Support: IE8-11+
                // Anchor's host property isn't correctly set when s.url is relative
                urlAnchor.href = urlAnchor.href;
                s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
                    urlAnchor.protocol + "//" + urlAnchor.host;
            } catch ( e ) {

                // If there is an error parsing the URL, assume it is crossDomain,
                // it can be rejected by the transport if it is invalid
                s.crossDomain = true;
            }
        }

        // Convert data if not already a string
        if ( s.data && s.processData && typeof s.data !== "string" ) {
            s.data = jQuery.param( s.data, s.traditional );
        }

        // Apply prefilters
        inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

        // If request was aborted inside a prefilter, stop there
        if ( state === 2 ) {
            return jqXHR;
        }

        // We can fire global events as of now if asked to
        // Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
        fireGlobals = jQuery.event && s.global;

        // Watch for a new set of requests
        if ( fireGlobals && jQuery.active++ === 0 ) {
            jQuery.event.trigger( "ajaxStart" );
        }

        // Uppercase the type
        s.type = s.type.toUpperCase();

        // Determine if request has content
        s.hasContent = !rnoContent.test( s.type );

        // Save the URL in case we're toying with the If-Modified-Since
        // and/or If-None-Match header later on
        cacheURL = s.url;

        // More options handling for requests with no content
        if ( !s.hasContent ) {

            // If data is available, append data to url
            if ( s.data ) {
                cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

                // #9682: remove data so that it's not used in an eventual retry
                delete s.data;
            }

            // Add anti-cache in url if needed
            if ( s.cache === false ) {
                s.url = rts.test( cacheURL ) ?

                    // If there is already a '_' parameter, set its value
                    cacheURL.replace( rts, "$1_=" + nonce++ ) :

                    // Otherwise add one to the end
                    cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
            }
        }

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {
            if ( jQuery.lastModified[ cacheURL ] ) {
                jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
            }
            if ( jQuery.etag[ cacheURL ] ) {
                jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
            }
        }

        // Set the correct header, if data is being sent
        if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
            jqXHR.setRequestHeader( "Content-Type", s.contentType );
        }

        // Set the Accepts header for the server, depending on the dataType
        jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
                s.accepts[ s.dataTypes[ 0 ] ] +
                    ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                s.accepts[ "*" ]
        );

        // Check for headers option
        for ( i in s.headers ) {
            jqXHR.setRequestHeader( i, s.headers[ i ] );
        }

        // Allow custom headers/mimetypes and early abort
        if ( s.beforeSend &&
            ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

            // Abort if not done already and return
            return jqXHR.abort();
        }

        // Aborting is no longer a cancellation
        strAbort = "abort";

        // Install callbacks on deferreds
        for ( i in { success: 1, error: 1, complete: 1 } ) {
            jqXHR[ i ]( s[ i ] );
        }

        // Get transport
        transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

        // If no transport, we auto-abort
        if ( !transport ) {
            done( -1, "No Transport" );
        } else {
            jqXHR.readyState = 1;

            // Send global event
            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
            }

            // If request was aborted inside ajaxSend, stop there
            if ( state === 2 ) {
                return jqXHR;
            }

            // Timeout
            if ( s.async && s.timeout > 0 ) {
                timeoutTimer = window.setTimeout( function() {
                    jqXHR.abort( "timeout" );
                }, s.timeout );
            }

            try {
                state = 1;
                transport.send( requestHeaders, done );
            } catch ( e ) {

                // Propagate exception as error if not done
                if ( state < 2 ) {
                    done( -1, e );

                // Simply rethrow otherwise
                } else {
                    throw e;
                }
            }
        }

        // Callback for when everything is done
        function done( status, nativeStatusText, responses, headers ) {
            var isSuccess, success, error, response, modified,
                statusText = nativeStatusText;

            // Called once
            if ( state === 2 ) {
                return;
            }

            // State is "done" now
            state = 2;

            // Clear timeout if it exists
            if ( timeoutTimer ) {
                window.clearTimeout( timeoutTimer );
            }

            // Dereference transport for early garbage collection
            // (no matter how long the jqXHR object will be used)
            transport = undefined;

            // Cache response headers
            responseHeadersString = headers || "";

            // Set readyState
            jqXHR.readyState = status > 0 ? 4 : 0;

            // Determine if successful
            isSuccess = status >= 200 && status < 300 || status === 304;

            // Get response data
            if ( responses ) {
                response = ajaxHandleResponses( s, jqXHR, responses );
            }

            // Convert no matter what (that way responseXXX fields are always set)
            response = ajaxConvert( s, response, jqXHR, isSuccess );

            // If successful, handle type chaining
            if ( isSuccess ) {

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if ( s.ifModified ) {
                    modified = jqXHR.getResponseHeader( "Last-Modified" );
                    if ( modified ) {
                        jQuery.lastModified[ cacheURL ] = modified;
                    }
                    modified = jqXHR.getResponseHeader( "etag" );
                    if ( modified ) {
                        jQuery.etag[ cacheURL ] = modified;
                    }
                }

                // if no content
                if ( status === 204 || s.type === "HEAD" ) {
                    statusText = "nocontent";

                // if not modified
                } else if ( status === 304 ) {
                    statusText = "notmodified";

                // If we have data, let's convert it
                } else {
                    statusText = response.state;
                    success = response.data;
                    error = response.error;
                    isSuccess = !error;
                }
            } else {

                // Extract error from statusText and normalize for non-aborts
                error = statusText;
                if ( status || !statusText ) {
                    statusText = "error";
                    if ( status < 0 ) {
                        status = 0;
                    }
                }
            }

            // Set data for the fake xhr object
            jqXHR.status = status;
            jqXHR.statusText = ( nativeStatusText || statusText ) + "";

            // Success/Error
            if ( isSuccess ) {
                deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
            } else {
                deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
            }

            // Status-dependent callbacks
            jqXHR.statusCode( statusCode );
            statusCode = undefined;

            if ( fireGlobals ) {
                globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
                    [ jqXHR, s, isSuccess ? success : error ] );
            }

            // Complete
            completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

                // Handle the global AJAX counter
                if ( !( --jQuery.active ) ) {
                    jQuery.event.trigger( "ajaxStop" );
                }
            }
        }

        return jqXHR;
    },

    getJSON: function( url, data, callback ) {
        return jQuery.get( url, data, callback, "json" );
    },

    getScript: function( url, callback ) {
        return jQuery.get( url, undefined, callback, "script" );
    }
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {

        // Shift arguments if data argument was omitted
        if ( jQuery.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        // The url can be an options object (which then must have .url)
        return jQuery.ajax( jQuery.extend( {
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        }, jQuery.isPlainObject( url ) && url ) );
    };
} );


jQuery._evalUrl = function( url ) {
    return jQuery.ajax( {
        url: url,

        // Make this explicit, since user can override this through ajaxSetup (#11264)
        type: "GET",
        dataType: "script",
        async: false,
        global: false,
        "throws": true
    } );
};


jQuery.fn.extend( {
    wrapAll: function( html ) {
        var wrap;

        if ( jQuery.isFunction( html ) ) {
            return this.each( function( i ) {
                jQuery( this ).wrapAll( html.call( this, i ) );
            } );
        }

        if ( this[ 0 ] ) {

            // The elements to wrap the target around
            wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

            if ( this[ 0 ].parentNode ) {
                wrap.insertBefore( this[ 0 ] );
            }

            wrap.map( function() {
                var elem = this;

                while ( elem.firstElementChild ) {
                    elem = elem.firstElementChild;
                }

                return elem;
            } ).append( this );
        }

        return this;
    },

    wrapInner: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each( function( i ) {
                jQuery( this ).wrapInner( html.call( this, i ) );
            } );
        }

        return this.each( function() {
            var self = jQuery( this ),
                contents = self.contents();

            if ( contents.length ) {
                contents.wrapAll( html );

            } else {
                self.append( html );
            }
        } );
    },

    wrap: function( html ) {
        var isFunction = jQuery.isFunction( html );

        return this.each( function( i ) {
            jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
        } );
    },

    unwrap: function() {
        return this.parent().each( function() {
            if ( !jQuery.nodeName( this, "body" ) ) {
                jQuery( this ).replaceWith( this.childNodes );
            }
        } ).end();
    }
} );


jQuery.expr.filters.hidden = function( elem ) {
    return !jQuery.expr.filters.visible( elem );
};
jQuery.expr.filters.visible = function( elem ) {

    // Support: Opera <= 12.12
    // Opera reports offsetWidths and offsetHeights less than zero on some elements
    // Use OR instead of AND as the element is not visible if either is true
    // See tickets #10406 and #13132
    return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
};




var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
    var name;

    if ( jQuery.isArray( obj ) ) {

        // Serialize array item.
        jQuery.each( obj, function( i, v ) {
            if ( traditional || rbracket.test( prefix ) ) {

                // Treat each array item as a scalar.
                add( prefix, v );

            } else {

                // Item is non-scalar (array or object), encode its numeric index.
                buildParams(
                    prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
                    v,
                    traditional,
                    add
                );
            }
        } );

    } else if ( !traditional && jQuery.type( obj ) === "object" ) {

        // Serialize object item.
        for ( name in obj ) {
            buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
        }

    } else {

        // Serialize scalar item.
        add( prefix, obj );
    }
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
    var prefix,
        s = [],
        add = function( key, value ) {

            // If value is a function, invoke it and return its value
            value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
            s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
        };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if ( traditional === undefined ) {
        traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }

    // If an array was passed in, assume that it is an array of form elements.
    if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

        // Serialize the form elements
        jQuery.each( a, function() {
            add( this.name, this.value );
        } );

    } else {

        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for ( prefix in a ) {
            buildParams( prefix, a[ prefix ], traditional, add );
        }
    }

    // Return the resulting serialization
    return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
    serialize: function() {
        return jQuery.param( this.serializeArray() );
    },
    serializeArray: function() {
        return this.map( function() {

            // Can add propHook for "elements" to filter or add form elements
            var elements = jQuery.prop( this, "elements" );
            return elements ? jQuery.makeArray( elements ) : this;
        } )
        .filter( function() {
            var type = this.type;

            // Use .is( ":disabled" ) so that fieldset[disabled] works
            return this.name && !jQuery( this ).is( ":disabled" ) &&
                rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
                ( this.checked || !rcheckableType.test( type ) );
        } )
        .map( function( i, elem ) {
            var val = jQuery( this ).val();

            return val == null ?
                null :
                jQuery.isArray( val ) ?
                    jQuery.map( val, function( val ) {
                        return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                    } ) :
                    { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
        } ).get();
    }
} );


jQuery.ajaxSettings.xhr = function() {
    try {
        return new window.XMLHttpRequest();
    } catch ( e ) {}
};

var xhrSuccessStatus = {

        // File protocol always yields status code 0, assume 200
        0: 200,

        // Support: IE9
        // #1450: sometimes IE returns 1223 when it should be 204
        1223: 204
    },
    xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
    var callback, errorCallback;

    // Cross domain only allowed if supported through XMLHttpRequest
    if ( support.cors || xhrSupported && !options.crossDomain ) {
        return {
            send: function( headers, complete ) {
                var i,
                    xhr = options.xhr();

                xhr.open(
                    options.type,
                    options.url,
                    options.async,
                    options.username,
                    options.password
                );

                // Apply custom fields if provided
                if ( options.xhrFields ) {
                    for ( i in options.xhrFields ) {
                        xhr[ i ] = options.xhrFields[ i ];
                    }
                }

                // Override mime type if needed
                if ( options.mimeType && xhr.overrideMimeType ) {
                    xhr.overrideMimeType( options.mimeType );
                }

                // X-Requested-With header
                // For cross-domain requests, seeing as conditions for a preflight are
                // akin to a jigsaw puzzle, we simply never set it to be sure.
                // (it can always be set on a per-request basis or even using ajaxSetup)
                // For same-domain requests, won't change header if already provided.
                if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
                    headers[ "X-Requested-With" ] = "XMLHttpRequest";
                }

                // Set headers
                for ( i in headers ) {
                    xhr.setRequestHeader( i, headers[ i ] );
                }

                // Callback
                callback = function( type ) {
                    return function() {
                        if ( callback ) {
                            callback = errorCallback = xhr.onload =
                                xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

                            if ( type === "abort" ) {
                                xhr.abort();
                            } else if ( type === "error" ) {

                                // Support: IE9
                                // On a manual native abort, IE9 throws
                                // errors on any property access that is not readyState
                                if ( typeof xhr.status !== "number" ) {
                                    complete( 0, "error" );
                                } else {
                                    complete(

                                        // File: protocol always yields status 0; see #8605, #14207
                                        xhr.status,
                                        xhr.statusText
                                    );
                                }
                            } else {
                                complete(
                                    xhrSuccessStatus[ xhr.status ] || xhr.status,
                                    xhr.statusText,

                                    // Support: IE9 only
                                    // IE9 has no XHR2 but throws on binary (trac-11426)
                                    // For XHR2 non-text, let the caller handle it (gh-2498)
                                    ( xhr.responseType || "text" ) !== "text"  ||
                                    typeof xhr.responseText !== "string" ?
                                        { binary: xhr.response } :
                                        { text: xhr.responseText },
                                    xhr.getAllResponseHeaders()
                                );
                            }
                        }
                    };
                };

                // Listen to events
                xhr.onload = callback();
                errorCallback = xhr.onerror = callback( "error" );

                // Support: IE9
                // Use onreadystatechange to replace onabort
                // to handle uncaught aborts
                if ( xhr.onabort !== undefined ) {
                    xhr.onabort = errorCallback;
                } else {
                    xhr.onreadystatechange = function() {

                        // Check readyState before timeout as it changes
                        if ( xhr.readyState === 4 ) {

                            // Allow onerror to be called first,
                            // but that will not handle a native abort
                            // Also, save errorCallback to a variable
                            // as xhr.onerror cannot be accessed
                            window.setTimeout( function() {
                                if ( callback ) {
                                    errorCallback();
                                }
                            } );
                        }
                    };
                }

                // Create the abort callback
                callback = callback( "abort" );

                try {

                    // Do send the request (this may raise an exception)
                    xhr.send( options.hasContent && options.data || null );
                } catch ( e ) {

                    // #14683: Only rethrow if this hasn't been notified as an error yet
                    if ( callback ) {
                        throw e;
                    }
                }
            },

            abort: function() {
                if ( callback ) {
                    callback();
                }
            }
        };
    }
} );




// Install script dataType
jQuery.ajaxSetup( {
    accepts: {
        script: "text/javascript, application/javascript, " +
            "application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /\b(?:java|ecma)script\b/
    },
    converters: {
        "text script": function( text ) {
            jQuery.globalEval( text );
            return text;
        }
    }
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
    if ( s.cache === undefined ) {
        s.cache = false;
    }
    if ( s.crossDomain ) {
        s.type = "GET";
    }
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

    // This transport only deals with cross domain requests
    if ( s.crossDomain ) {
        var script, callback;
        return {
            send: function( _, complete ) {
                script = jQuery( "<script>" ).prop( {
                    charset: s.scriptCharset,
                    src: s.url
                } ).on(
                    "load error",
                    callback = function( evt ) {
                        script.remove();
                        callback = null;
                        if ( evt ) {
                            complete( evt.type === "error" ? 404 : 200, evt.type );
                        }
                    }
                );

                // Use native DOM manipulation to avoid our domManip AJAX trickery
                document.head.appendChild( script[ 0 ] );
            },
            abort: function() {
                if ( callback ) {
                    callback();
                }
            }
        };
    }
} );




var oldCallbacks = [],
    rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
    jsonp: "callback",
    jsonpCallback: function() {
        var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
        this[ callback ] = true;
        return callback;
    }
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    var callbackName, overwritten, responseContainer,
        jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
            "url" :
            typeof s.data === "string" &&
                ( s.contentType || "" )
                    .indexOf( "application/x-www-form-urlencoded" ) === 0 &&
                rjsonp.test( s.data ) && "data"
        );

    // Handle iff the expected data type is "jsonp" or we have a parameter to set
    if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

        // Get callback name, remembering preexisting value associated with it
        callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
            s.jsonpCallback() :
            s.jsonpCallback;

        // Insert callback into url or form data
        if ( jsonProp ) {
            s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
        } else if ( s.jsonp !== false ) {
            s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
        }

        // Use data converter to retrieve json after script execution
        s.converters[ "script json" ] = function() {
            if ( !responseContainer ) {
                jQuery.error( callbackName + " was not called" );
            }
            return responseContainer[ 0 ];
        };

        // Force json dataType
        s.dataTypes[ 0 ] = "json";

        // Install callback
        overwritten = window[ callbackName ];
        window[ callbackName ] = function() {
            responseContainer = arguments;
        };

        // Clean-up function (fires after converters)
        jqXHR.always( function() {

            // If previous value didn't exist - remove it
            if ( overwritten === undefined ) {
                jQuery( window ).removeProp( callbackName );

            // Otherwise restore preexisting value
            } else {
                window[ callbackName ] = overwritten;
            }

            // Save back as free
            if ( s[ callbackName ] ) {

                // Make sure that re-using the options doesn't screw things around
                s.jsonpCallback = originalSettings.jsonpCallback;

                // Save the callback name for future use
                oldCallbacks.push( callbackName );
            }

            // Call if it was a function and we have a response
            if ( responseContainer && jQuery.isFunction( overwritten ) ) {
                overwritten( responseContainer[ 0 ] );
            }

            responseContainer = overwritten = undefined;
        } );

        // Delegate to script
        return "script";
    }
} );




// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
    if ( !data || typeof data !== "string" ) {
        return null;
    }
    if ( typeof context === "boolean" ) {
        keepScripts = context;
        context = false;
    }
    context = context || document;

    var parsed = rsingleTag.exec( data ),
        scripts = !keepScripts && [];

    // Single tag
    if ( parsed ) {
        return [ context.createElement( parsed[ 1 ] ) ];
    }

    parsed = buildFragment( [ data ], context, scripts );

    if ( scripts && scripts.length ) {
        jQuery( scripts ).remove();
    }

    return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
    if ( typeof url !== "string" && _load ) {
        return _load.apply( this, arguments );
    }

    var selector, type, response,
        self = this,
        off = url.indexOf( " " );

    if ( off > -1 ) {
        selector = jQuery.trim( url.slice( off ) );
        url = url.slice( 0, off );
    }

    // If it's a function
    if ( jQuery.isFunction( params ) ) {

        // We assume that it's the callback
        callback = params;
        params = undefined;

    // Otherwise, build a param string
    } else if ( params && typeof params === "object" ) {
        type = "POST";
    }

    // If we have elements to modify, make the request
    if ( self.length > 0 ) {
        jQuery.ajax( {
            url: url,

            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: type || "GET",
            dataType: "html",
            data: params
        } ).done( function( responseText ) {

            // Save response for use in complete callback
            response = arguments;

            self.html( selector ?

                // If a selector was specified, locate the right elements in a dummy div
                // Exclude scripts to avoid IE 'Permission Denied' errors
                jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

                // Otherwise use the full result
                responseText );

        // If the request succeeds, this function gets "data", "status", "jqXHR"
        // but they are ignored because response was set above.
        // If it fails, this function gets "jqXHR", "status", "error"
        } ).always( callback && function( jqXHR, status ) {
            self.each( function() {
                callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
            } );
        } );
    }

    return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
    "ajaxStart",
    "ajaxStop",
    "ajaxComplete",
    "ajaxError",
    "ajaxSuccess",
    "ajaxSend"
], function( i, type ) {
    jQuery.fn[ type ] = function( fn ) {
        return this.on( type, fn );
    };
} );




jQuery.expr.filters.animated = function( elem ) {
    return jQuery.grep( jQuery.timers, function( fn ) {
        return elem === fn.elem;
    } ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
    return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
    setOffset: function( elem, options, i ) {
        var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
            position = jQuery.css( elem, "position" ),
            curElem = jQuery( elem ),
            props = {};

        // Set position first, in-case top/left are set even on static elem
        if ( position === "static" ) {
            elem.style.position = "relative";
        }

        curOffset = curElem.offset();
        curCSSTop = jQuery.css( elem, "top" );
        curCSSLeft = jQuery.css( elem, "left" );
        calculatePosition = ( position === "absolute" || position === "fixed" ) &&
            ( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

        // Need to be able to calculate position if either
        // top or left is auto and position is either absolute or fixed
        if ( calculatePosition ) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;

        } else {
            curTop = parseFloat( curCSSTop ) || 0;
            curLeft = parseFloat( curCSSLeft ) || 0;
        }

        if ( jQuery.isFunction( options ) ) {

            // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
            options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
        }

        if ( options.top != null ) {
            props.top = ( options.top - curOffset.top ) + curTop;
        }
        if ( options.left != null ) {
            props.left = ( options.left - curOffset.left ) + curLeft;
        }

        if ( "using" in options ) {
            options.using.call( elem, props );

        } else {
            curElem.css( props );
        }
    }
};

jQuery.fn.extend( {
    offset: function( options ) {
        if ( arguments.length ) {
            return options === undefined ?
                this :
                this.each( function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                } );
        }

        var docElem, win,
            elem = this[ 0 ],
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;

        if ( !doc ) {
            return;
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if ( !jQuery.contains( docElem, elem ) ) {
            return box;
        }

        box = elem.getBoundingClientRect();
        win = getWindow( doc );
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    },

    position: function() {
        if ( !this[ 0 ] ) {
            return;
        }

        var offsetParent, offset,
            elem = this[ 0 ],
            parentOffset = { top: 0, left: 0 };

        // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
        // because it is its only offset parent
        if ( jQuery.css( elem, "position" ) === "fixed" ) {

            // Assume getBoundingClientRect is there when computed position is fixed
            offset = elem.getBoundingClientRect();

        } else {

            // Get *real* offsetParent
            offsetParent = this.offsetParent();

            // Get correct offsets
            offset = this.offset();
            if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
                parentOffset = offsetParent.offset();
            }

            // Add offsetParent borders
            parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
            parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
        }

        // Subtract parent offsets and element margins
        return {
            top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
            left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
        };
    },

    // This method will return documentElement in the following cases:
    // 1) For the element inside the iframe without offsetParent, this method will return
    //    documentElement of the parent window
    // 2) For the hidden or detached element
    // 3) For body or html element, i.e. in case of the html node - it will return itself
    //
    // but those exceptions were never presented as a real life use-cases
    // and might be considered as more preferable results.
    //
    // This logic, however, is not guaranteed and can change at any point in the future
    offsetParent: function() {
        return this.map( function() {
            var offsetParent = this.offsetParent;

            while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
                offsetParent = offsetParent.offsetParent;
            }

            return offsetParent || documentElement;
        } );
    }
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
    var top = "pageYOffset" === prop;

    jQuery.fn[ method ] = function( val ) {
        return access( this, function( elem, method, val ) {
            var win = getWindow( elem );

            if ( val === undefined ) {
                return win ? win[ prop ] : elem[ method ];
            }

            if ( win ) {
                win.scrollTo(
                    !top ? val : win.pageXOffset,
                    top ? val : win.pageYOffset
                );

            } else {
                elem[ method ] = val;
            }
        }, method, val, arguments.length );
    };
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
    jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
        function( elem, computed ) {
            if ( computed ) {
                computed = curCSS( elem, prop );

                // If curCSS returns percentage, fallback to offset
                return rnumnonpx.test( computed ) ?
                    jQuery( elem ).position()[ prop ] + "px" :
                    computed;
            }
        }
    );
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
    jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
        function( defaultExtra, funcName ) {

        // Margin is only for outerHeight, outerWidth
        jQuery.fn[ funcName ] = function( margin, value ) {
            var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
                extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

            return access( this, function( elem, type, value ) {
                var doc;

                if ( jQuery.isWindow( elem ) ) {

                    // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                    // isn't a whole lot we can do. See pull request at this URL for discussion:
                    // https://github.com/jquery/jquery/pull/764
                    return elem.document.documentElement[ "client" + name ];
                }

                // Get document width or height
                if ( elem.nodeType === 9 ) {
                    doc = elem.documentElement;

                    // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
                    // whichever is greatest
                    return Math.max(
                        elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                        elem.body[ "offset" + name ], doc[ "offset" + name ],
                        doc[ "client" + name ]
                    );
                }

                return value === undefined ?

                    // Get width or height on the element, requesting but not forcing parseFloat
                    jQuery.css( elem, type, extra ) :

                    // Set width or height on the element
                    jQuery.style( elem, type, value, extra );
            }, type, chainable ? margin : undefined, chainable, null );
        };
    } );
} );


jQuery.fn.extend( {

    bind: function( types, data, fn ) {
        return this.on( types, null, data, fn );
    },
    unbind: function( types, fn ) {
        return this.off( types, null, fn );
    },

    delegate: function( selector, types, data, fn ) {
        return this.on( types, selector, data, fn );
    },
    undelegate: function( selector, types, fn ) {

        // ( namespace ) or ( selector, types [, fn] )
        return arguments.length === 1 ?
            this.off( selector, "**" ) :
            this.off( types, selector || "**", fn );
    },
    size: function() {
        return this.length;
    }
} );

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
    define( "jquery", [], function() {
        return jQuery;
    } );
}



var

    // Map over jQuery in case of overwrite
    _jQuery = window.jQuery,

    // Map over the $ in case of overwrite
    _$ = window.$;

jQuery.noConflict = function( deep ) {
    if ( window.$ === jQuery ) {
        window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
        window.jQuery = _jQuery;
    }

    return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
    window.jQuery = window.$ = jQuery;
}

return jQuery;
}));











/*time_conversion*/
(function(e){function t(e,t,n){switch(arguments.length){case 2:return null!=e?e:t;case 3:return null!=e?e:null!=t?t:n;default:throw new Error("Implement me")}}function n(e,t){return Tt.call(e,t)}function s(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function a(e){wt.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+e)}function i(e,t){var n=!0;return _(function(){return n&&(a(e),n=!1),t.apply(this,arguments)},t)}function r(e,t){Mn[e]||(a(t),Mn[e]=!0)}function o(e,t){return function(n){return p(e.call(this,n),t)}}function u(e,t){return function(n){return this.localeData().ordinal(e.call(this,n),t)}}function c(e,t){var n,s,a=12*(t.year()-e.year())+(t.month()-e.month()),i=e.clone().add(a,"months");return 0>t-i?(n=e.clone().add(a-1,"months"),s=(t-i)/(i-n)):(n=e.clone().add(a+1,"months"),s=(t-i)/(n-i)),-(a+s)}function l(e,t,n){var s;return null==n?t:null!=e.meridiemHour?e.meridiemHour(t,n):null!=e.isPM?(s=e.isPM(n),s&&12>t&&(t+=12),s||12!==t||(t=0),t):t}function d(){}function f(e,t){t!==!1&&F(e),m(this,e),this._d=new Date(+e._d),wn===!1&&(wn=!0,wt.updateOffset(this),wn=!1)}function h(e){var t=S(e),n=t.year||0,s=t.quarter||0,a=t.month||0,i=t.week||0,r=t.day||0,o=t.hour||0,u=t.minute||0,c=t.second||0,l=t.millisecond||0;this._milliseconds=+l+1e3*c+6e4*u+36e5*o,this._days=+r+7*i,this._months=+a+3*s+12*n,this._data={},this._locale=wt.localeData(),this._bubble()}function _(e,t){for(var s in t)n(t,s)&&(e[s]=t[s]);return n(t,"toString")&&(e.toString=t.toString),n(t,"valueOf")&&(e.valueOf=t.valueOf),e}function m(e,t){var n,s,a;if("undefined"!=typeof t._isAMomentObject&&(e._isAMomentObject=t._isAMomentObject),"undefined"!=typeof t._i&&(e._i=t._i),"undefined"!=typeof t._f&&(e._f=t._f),"undefined"!=typeof t._l&&(e._l=t._l),"undefined"!=typeof t._strict&&(e._strict=t._strict),"undefined"!=typeof t._tzm&&(e._tzm=t._tzm),"undefined"!=typeof t._isUTC&&(e._isUTC=t._isUTC),"undefined"!=typeof t._offset&&(e._offset=t._offset),"undefined"!=typeof t._pf&&(e._pf=t._pf),"undefined"!=typeof t._locale&&(e._locale=t._locale),It.length>0)for(n in It)s=It[n],a=t[s],"undefined"!=typeof a&&(e[s]=a);return e}function y(e){return 0>e?Math.ceil(e):Math.floor(e)}function p(e,t,n){for(var s=""+Math.abs(e),a=e>=0;s.length<t;)s="0"+s;return(a?n?"+":"":"-")+s}function g(e,t){var n={milliseconds:0,months:0};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=+t-+e.clone().add(n.months,"M"),n}function M(e,t){var n;return t=H(t,e),e.isBefore(t)?n=g(e,t):(n=g(t,e),n.milliseconds=-n.milliseconds,n.months=-n.months),n}function D(e,t){return function(n,s){var a,i;return null===s||isNaN(+s)||(r(t,"_time_conversion_()."+t+"(period, number) is deprecated. Please use _time_conversion_()."+t+"(number, period)."),i=n,n=s,s=i),n="string"==typeof n?+n:n,a=wt.duration(n,s),w(this,a,e),this}}function w(e,t,n,s){var a=t._milliseconds,i=t._days,r=t._months;s=null==s?!0:s,a&&e._d.setTime(+e._d+a*n),i&&mt(e,"Date",_t(e,"Date")+i*n),r&&ht(e,_t(e,"Month")+r*n),s&&wt.updateOffset(e,i||r)}function Y(e){return"[object Array]"===Object.prototype.toString.call(e)}function v(e){return"[object Date]"===Object.prototype.toString.call(e)||e instanceof Date}function k(e,t,n){var s,a=Math.min(e.length,t.length),i=Math.abs(e.length-t.length),r=0;for(s=0;a>s;s++)(n&&e[s]!==t[s]||!n&&O(e[s])!==O(t[s]))&&r++;return r+i}function b(e){if(e){var t=e.toLowerCase().replace(/(.)s$/,"$1");e=fn[e]||hn[t]||t}return e}function S(e){var t,s,a={};for(s in e)n(e,s)&&(t=b(s),t&&(a[t]=e[s]));return a}function T(t){var n,s;if(0===t.indexOf("week"))n=7,s="day";else{if(0!==t.indexOf("month"))return;n=12,s="month"}wt[t]=function(a,i){var r,o,u=wt._locale[t],c=[];if("number"==typeof a&&(i=a,a=e),o=function(e){var t=wt().utc().set(s,e);return u.call(wt._locale,t,a||"")},null!=i)return o(i);for(r=0;n>r;r++)c.push(o(r));return c}}function O(e){var t=+e,n=0;return 0!==t&&isFinite(t)&&(n=t>=0?Math.floor(t):Math.ceil(t)),n}function U(e,t){return new Date(Date.UTC(e,t+1,0)).getUTCDate()}function W(e,t,n){return ct(wt([e,11,31+t-n]),t,n).week}function C(e){return G(e)?366:365}function G(e){return e%4===0&&e%100!==0||e%400===0}function F(e){var t;e._a&&-2===e._pf.overflow&&(t=e._a[Ut]<0||e._a[Ut]>11?Ut:e._a[Wt]<1||e._a[Wt]>U(e._a[Ot],e._a[Ut])?Wt:e._a[Ct]<0||e._a[Ct]>24||24===e._a[Ct]&&(0!==e._a[Gt]||0!==e._a[Ft]||0!==e._a[Pt])?Ct:e._a[Gt]<0||e._a[Gt]>59?Gt:e._a[Ft]<0||e._a[Ft]>59?Ft:e._a[Pt]<0||e._a[Pt]>999?Pt:-1,e._pf._overflowDayOfYear&&(Ot>t||t>Wt)&&(t=Wt),e._pf.overflow=t)}function P(t){return null==t._isValid&&(t._isValid=!isNaN(t._d.getTime())&&t._pf.overflow<0&&!t._pf.empty&&!t._pf.invalidMonth&&!t._pf.nullInput&&!t._pf.invalidFormat&&!t._pf.userInvalidated,t._strict&&(t._isValid=t._isValid&&0===t._pf.charsLeftOver&&0===t._pf.unusedTokens.length&&t._pf.bigHour===e)),t._isValid}function L(e){return e?e.toLowerCase().replace("_","-"):e}function I(e){for(var t,n,s,a,i=0;i<e.length;){for(a=L(e[i]).split("-"),t=a.length,n=L(e[i+1]),n=n?n.split("-"):null;t>0;){if(s=x(a.slice(0,t).join("-")))return s;if(n&&n.length>=t&&k(a,n,!0)>=t-1)break;t--}i++}return null}function x(e){var t=null;if(!Lt[e]&&xt)try{t=wt.locale(),require("./locale/"+e),wt.locale(t)}catch(n){}return Lt[e]}function H(e,t){var n,s;return t._isUTC?(n=t.clone(),s=(wt.isMoment(e)||v(e)?+e:+wt(e))-+n,n._d.setTime(+n._d+s),wt.updateOffset(n,!1),n):wt(e).local()}function A(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function z(e){var t,n,s=e.match(Zt);for(t=0,n=s.length;n>t;t++)s[t]=gn[s[t]]?gn[s[t]]:A(s[t]);return function(a){var i="";for(t=0;n>t;t++)i+=s[t]instanceof Function?s[t].call(a,e):s[t];return i}}function Z(e,t){return e.isValid()?(t=E(t,e.localeData()),_n[t]||(_n[t]=z(t)),_n[t](e)):e.localeData().invalidDate()}function E(e,t){function n(e){return t.longDateFormat(e)||e}var s=5;for(Et.lastIndex=0;s>=0&&Et.test(e);)e=e.replace(Et,n),Et.lastIndex=0,s-=1;return e}function j(e,t){var n,s=t._strict;switch(e){case"Q":return Kt;case"DDDD":return tn;case"YYYY":case"GGGG":case"gggg":return s?nn:qt;case"Y":case"G":case"g":return an;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return s?sn:Vt;case"S":if(s)return Kt;case"SS":if(s)return en;case"SSS":if(s)return tn;case"DDD":return Nt;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Jt;case"a":case"A":return t._locale._meridiemParse;case"x":return Qt;case"X":return Xt;case"Z":case"ZZ":return Rt;case"T":return Bt;case"SSSS":return $t;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return s?en:jt;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return jt;case"Do":return s?t._locale._ordinalParse:t._locale._ordinalParseLenient;default:return n=new RegExp(X(Q(e.replace("\\","")),"i"))}}function N(e){e=e||"";var t=e.match(Rt)||[],n=t[t.length-1]||[],s=(n+"").match(ln)||["-",0,0],a=+(60*s[1])+O(s[2]);return"+"===s[0]?a:-a}function q(e,t,n){var s,a=n._a;switch(e){case"Q":null!=t&&(a[Ut]=3*(O(t)-1));break;case"M":case"MM":null!=t&&(a[Ut]=O(t)-1);break;case"MMM":case"MMMM":s=n._locale.monthsParse(t,e,n._strict),null!=s?a[Ut]=s:n._pf.invalidMonth=t;break;case"D":case"DD":null!=t&&(a[Wt]=O(t));break;case"Do":null!=t&&(a[Wt]=O(parseInt(t.match(/\d{1,2}/)[0],10)));break;case"DDD":case"DDDD":null!=t&&(n._dayOfYear=O(t));break;case"YY":a[Ot]=wt.parseTwoDigitYear(t);break;case"YYYY":case"YYYYY":case"YYYYYY":a[Ot]=O(t);break;case"a":case"A":n._meridiem=t;break;case"h":case"hh":n._pf.bigHour=!0;case"H":case"HH":a[Ct]=O(t);break;case"m":case"mm":a[Gt]=O(t);break;case"s":case"ss":a[Ft]=O(t);break;case"S":case"SS":case"SSS":case"SSSS":a[Pt]=O(1e3*("0."+t));break;case"x":n._d=new Date(O(t));break;case"X":n._d=new Date(1e3*parseFloat(t));break;case"Z":case"ZZ":n._useUTC=!0,n._tzm=N(t);break;case"dd":case"ddd":case"dddd":s=n._locale.weekdaysParse(t),null!=s?(n._w=n._w||{},n._w.d=s):n._pf.invalidWeekday=t;break;case"w":case"ww":case"W":case"WW":case"d":case"e":case"E":e=e.substr(0,1);case"gggg":case"GGGG":case"GGGGG":e=e.substr(0,2),t&&(n._w=n._w||{},n._w[e]=O(t));break;case"gg":case"GG":n._w=n._w||{},n._w[e]=wt.parseTwoDigitYear(t)}}function V(e){var n,s,a,i,r,o,u;n=e._w,null!=n.GG||null!=n.W||null!=n.E?(r=1,o=4,s=t(n.GG,e._a[Ot],ct(wt(),1,4).year),a=t(n.W,1),i=t(n.E,1)):(r=e._locale._week.dow,o=e._locale._week.doy,s=t(n.gg,e._a[Ot],ct(wt(),r,o).year),a=t(n.w,1),null!=n.d?(i=n.d,r>i&&++a):i=null!=n.e?n.e+r:r),u=lt(s,a,i,o,r),e._a[Ot]=u.year,e._dayOfYear=u.dayOfYear}function $(e){var n,s,a,i,r=[];if(!e._d){for(a=R(e),e._w&&null==e._a[Wt]&&null==e._a[Ut]&&V(e),e._dayOfYear&&(i=t(e._a[Ot],a[Ot]),e._dayOfYear>C(i)&&(e._pf._overflowDayOfYear=!0),s=it(i,0,e._dayOfYear),e._a[Ut]=s.getUTCMonth(),e._a[Wt]=s.getUTCDate()),n=0;3>n&&null==e._a[n];++n)e._a[n]=r[n]=a[n];for(;7>n;n++)e._a[n]=r[n]=null==e._a[n]?2===n?1:0:e._a[n];24===e._a[Ct]&&0===e._a[Gt]&&0===e._a[Ft]&&0===e._a[Pt]&&(e._nextDay=!0,e._a[Ct]=0),e._d=(e._useUTC?it:at).apply(null,r),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[Ct]=24)}}function J(e){var t;e._d||(t=S(e._i),e._a=[t.year,t.month,t.day||t.date,t.hour,t.minute,t.second,t.millisecond],$(e))}function R(e){var t=new Date;return e._useUTC?[t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()]:[t.getFullYear(),t.getMonth(),t.getDate()]}function B(t){if(t._f===wt.ISO_8601)return void et(t);t._a=[],t._pf.empty=!0;var n,s,a,i,r,o=""+t._i,u=o.length,c=0;for(a=E(t._f,t._locale).match(Zt)||[],n=0;n<a.length;n++)i=a[n],s=(o.match(j(i,t))||[])[0],s&&(r=o.substr(0,o.indexOf(s)),r.length>0&&t._pf.unusedInput.push(r),o=o.slice(o.indexOf(s)+s.length),c+=s.length),gn[i]?(s?t._pf.empty=!1:t._pf.unusedTokens.push(i),q(i,s,t)):t._strict&&!s&&t._pf.unusedTokens.push(i);t._pf.charsLeftOver=u-c,o.length>0&&t._pf.unusedInput.push(o),t._pf.bigHour===!0&&t._a[Ct]<=12&&(t._pf.bigHour=e),t._a[Ct]=l(t._locale,t._a[Ct],t._meridiem),$(t),F(t)}function Q(e){return e.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,t,n,s,a){return t||n||s||a})}function X(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function K(e){var t,n,a,i,r;if(0===e._f.length)return e._pf.invalidFormat=!0,void(e._d=new Date(0/0));for(i=0;i<e._f.length;i++)r=0,t=m({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._pf=s(),t._f=e._f[i],B(t),P(t)&&(r+=t._pf.charsLeftOver,r+=10*t._pf.unusedTokens.length,t._pf.score=r,(null==a||a>r)&&(a=r,n=t));_(e,n||t)}function et(e){var t,n,s=e._i,a=rn.exec(s);if(a){for(e._pf.iso=!0,t=0,n=un.length;n>t;t++)if(un[t][1].exec(s)){e._f=un[t][0]+(a[6]||" ");break}for(t=0,n=cn.length;n>t;t++)if(cn[t][1].exec(s)){e._f+=cn[t][0];break}s.match(Rt)&&(e._f+="Z"),B(e)}else e._isValid=!1}function tt(e){et(e),e._isValid===!1&&(delete e._isValid,wt.createFromInputFallback(e))}function nt(e,t){var n,s=[];for(n=0;n<e.length;++n)s.push(t(e[n],n));return s}function st(t){var n,s=t._i;s===e?t._d=new Date:v(s)?t._d=new Date(+s):null!==(n=Ht.exec(s))?t._d=new Date(+n[1]):"string"==typeof s?tt(t):Y(s)?(t._a=nt(s.slice(0),function(e){return parseInt(e,10)}),$(t)):"object"==typeof s?J(t):"number"==typeof s?t._d=new Date(s):wt.createFromInputFallback(t)}function at(e,t,n,s,a,i,r){var o=new Date(e,t,n,s,a,i,r);return 1970>e&&o.setFullYear(e),o}function it(e){var t=new Date(Date.UTC.apply(null,arguments));return 1970>e&&t.setUTCFullYear(e),t}function rt(e,t){if("string"==typeof e)if(isNaN(e)){if(e=t.weekdaysParse(e),"number"!=typeof e)return null}else e=parseInt(e,10);return e}function ot(e,t,n,s,a){return a.relativeTime(t||1,!!n,e,s)}function ut(e,t,n){var s=wt.duration(e).abs(),a=St(s.as("s")),i=St(s.as("m")),r=St(s.as("h")),o=St(s.as("d")),u=St(s.as("M")),c=St(s.as("y")),l=a<mn.s&&["s",a]||1===i&&["m"]||i<mn.m&&["mm",i]||1===r&&["h"]||r<mn.h&&["hh",r]||1===o&&["d"]||o<mn.d&&["dd",o]||1===u&&["M"]||u<mn.M&&["MM",u]||1===c&&["y"]||["yy",c];return l[2]=t,l[3]=+e>0,l[4]=n,ot.apply({},l)}function ct(e,t,n){var s,a=n-t,i=n-e.day();return i>a&&(i-=7),a-7>i&&(i+=7),s=wt(e).add(i,"d"),{week:Math.ceil(s.dayOfYear()/7),year:s.year()}}function lt(e,t,n,s,a){var i,r,o=it(e,0,1).getUTCDay();return o=0===o?7:o,n=null!=n?n:a,i=a-o+(o>s?7:0)-(a>o?7:0),r=7*(t-1)+(n-a)+i+1,{year:r>0?e:e-1,dayOfYear:r>0?r:C(e-1)+r}}function dt(t){var n,s=t._i,a=t._f;return t._locale=t._locale||wt.localeData(t._l),null===s||a===e&&""===s?wt.invalid({nullInput:!0}):("string"==typeof s&&(t._i=s=t._locale.preparse(s)),wt.isMoment(s)?new f(s,!0):(a?Y(a)?K(t):B(t):st(t),n=new f(t),n._nextDay&&(n.add(1,"d"),n._nextDay=e),n))}function ft(e,t){var n,s;if(1===t.length&&Y(t[0])&&(t=t[0]),!t.length)return wt();for(n=t[0],s=1;s<t.length;++s)t[s][e](n)&&(n=t[s]);return n}function ht(e,t){var n;return"string"==typeof t&&(t=e.localeData().monthsParse(t),"number"!=typeof t)?e:(n=Math.min(e.date(),U(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n),e)}function _t(e,t){return e._d["get"+(e._isUTC?"UTC":"")+t]()}function mt(e,t,n){return"Month"===t?ht(e,n):e._d["set"+(e._isUTC?"UTC":"")+t](n)}function yt(e,t){return function(n){return null!=n?(mt(this,e,n),wt.updateOffset(this,t),this):_t(this,e)}}function pt(e){return 400*e/146097}function gt(e){return 146097*e/400}function Mt(e){wt.duration.fn[e]=function(){return this._data[e]}}function Dt(e){"undefined"==typeof ender&&(Yt=bt._time_conversion_,bt._time_conversion_=e?i("Accessing _time_conversion_ through the global scope is deprecated, and will be removed in an upcoming release.",wt):wt)}for(var wt,Yt,vt,kt="2.9.0",bt="undefined"==typeof global||"undefined"!=typeof window&&window!==global.window?this:global,St=Math.round,Tt=Object.prototype.hasOwnProperty,Ot=0,Ut=1,Wt=2,Ct=3,Gt=4,Ft=5,Pt=6,Lt={},It=[],xt="undefined"!=typeof module&&module&&module.exports,Ht=/^\/?Date\((\-?\d+)/i,At=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,zt=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,Zt=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,Et=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,jt=/\d\d?/,Nt=/\d{1,3}/,qt=/\d{1,4}/,Vt=/[+\-]?\d{1,6}/,$t=/\d+/,Jt=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Rt=/Z|[\+\-]\d\d:?\d\d/gi,Bt=/T/i,Qt=/[\+\-]?\d+/,Xt=/[\+\-]?\d+(\.\d{1,3})?/,Kt=/\d/,en=/\d\d/,tn=/\d{3}/,nn=/\d{4}/,sn=/[+-]?\d{6}/,an=/[+-]?\d+/,rn=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,on="YYYY-MM-DDTHH:mm:ssZ",un=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],cn=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],ln=/([\+\-]|\d\d)/gi,dn=("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),{Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6}),fn={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",Q:"quarter",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},hn={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},_n={},mn={s:45,m:45,h:22,d:26,M:11},yn="DDD w W M D d".split(" "),pn="M D H h m s w W".split(" "),gn={M:function(){return this.month()+1},MMM:function(e){return this.localeData().monthsShort(this,e)},MMMM:function(e){return this.localeData().months(this,e)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(e){return this.localeData().weekdaysMin(this,e)},ddd:function(e){return this.localeData().weekdaysShort(this,e)},dddd:function(e){return this.localeData().weekdays(this,e)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return p(this.year()%100,2)},YYYY:function(){return p(this.year(),4)},YYYYY:function(){return p(this.year(),5)},YYYYYY:function(){var e=this.year(),t=e>=0?"+":"-";return t+p(Math.abs(e),6)},gg:function(){return p(this.weekYear()%100,2)},gggg:function(){return p(this.weekYear(),4)},ggggg:function(){return p(this.weekYear(),5)},GG:function(){return p(this.isoWeekYear()%100,2)},GGGG:function(){return p(this.isoWeekYear(),4)},GGGGG:function(){return p(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return O(this.milliseconds()/100)},SS:function(){return p(O(this.milliseconds()/10),2)},SSS:function(){return p(this.milliseconds(),3)},SSSS:function(){return p(this.milliseconds(),3)},Z:function(){var e=this.utcOffset(),t="+";return 0>e&&(e=-e,t="-"),t+p(O(e/60),2)+":"+p(O(e)%60,2)},ZZ:function(){var e=this.utcOffset(),t="+";return 0>e&&(e=-e,t="-"),t+p(O(e/60),2)+p(O(e)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},x:function(){return this.valueOf()},X:function(){return this.unix()},Q:function(){return this.quarter()}},Mn={},Dn=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"],wn=!1;yn.length;)vt=yn.pop(),gn[vt+"o"]=u(gn[vt],vt);for(;pn.length;)vt=pn.pop(),gn[vt+vt]=o(gn[vt],2);gn.DDDD=o(gn.DDD,3),_(d.prototype,{set:function(e){var t,n;for(n in e)t=e[n],"function"==typeof t?this[n]=t:this["_"+n]=t;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(e){return this._months[e.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(e){return this._monthsShort[e.month()]},monthsParse:function(e,t,n){var s,a,i;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),s=0;12>s;s++){if(a=wt.utc([2e3,s]),n&&!this._longMonthsParse[s]&&(this._longMonthsParse[s]=new RegExp("^"+this.months(a,"").replace(".","")+"$","i"),this._shortMonthsParse[s]=new RegExp("^"+this.monthsShort(a,"").replace(".","")+"$","i")),n||this._monthsParse[s]||(i="^"+this.months(a,"")+"|^"+this.monthsShort(a,""),this._monthsParse[s]=new RegExp(i.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[s].test(e))return s;if(n&&"MMM"===t&&this._shortMonthsParse[s].test(e))return s;if(!n&&this._monthsParse[s].test(e))return s}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(e){return this._weekdays[e.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(e){return this._weekdaysShort[e.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(e){return this._weekdaysMin[e.day()]},weekdaysParse:function(e){var t,n,s;for(this._weekdaysParse||(this._weekdaysParse=[]),t=0;7>t;t++)if(this._weekdaysParse[t]||(n=wt([2e3,1]).day(t),s="^"+this.weekdays(n,"")+"|^"+this.weekdaysShort(n,"")+"|^"+this.weekdaysMin(n,""),this._weekdaysParse[t]=new RegExp(s.replace(".",""),"i")),this._weekdaysParse[t].test(e))return t},_longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"},longDateFormat:function(e){var t=this._longDateFormat[e];return!t&&this._longDateFormat[e.toUpperCase()]&&(t=this._longDateFormat[e.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e]=t),t},isPM:function(e){return"p"===(e+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(e,t,n){var s=this._calendar[e];return"function"==typeof s?s.apply(t,[n]):s},_relativeTime:{future:"in %s",past:"%s ago",s:"few sec",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(e,t,n,s){var a=this._relativeTime[n];return"function"==typeof a?a(e,t,n,s):a.replace(/%d/i,e)},pastFuture:function(e,t){var n=this._relativeTime[e>0?"future":"past"];return"function"==typeof n?n(t):n.replace(/%s/i,t)},ordinal:function(e){return this._ordinal.replace("%d",e)},_ordinal:"%d",_ordinalParse:/\d{1,2}/,preparse:function(e){return e},postformat:function(e){return e},week:function(e){return ct(e,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},firstDayOfWeek:function(){return this._week.dow},firstDayOfYear:function(){return this._week.doy},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),wt=function(t,n,a,i){var r;return"boolean"==typeof a&&(i=a,a=e),r={},r._isAMomentObject=!0,r._i=t,r._f=n,r._l=a,r._strict=i,r._isUTC=!1,r._pf=s(),dt(r)},wt.suppressDeprecationWarnings=!1,wt.createFromInputFallback=i("_time_conversion_ construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/_time_conversion_/_time_conversion_/issues/1407 for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),wt.min=function(){var e=[].slice.call(arguments,0);return ft("isBefore",e)},wt.max=function(){var e=[].slice.call(arguments,0);return ft("isAfter",e)},wt.utc=function(t,n,a,i){var r;return"boolean"==typeof a&&(i=a,a=e),r={},r._isAMomentObject=!0,r._useUTC=!0,r._isUTC=!0,r._l=a,r._i=t,r._f=n,r._strict=i,r._pf=s(),dt(r).utc()},wt.unix=function(e){return wt(1e3*e)},wt.duration=function(e,t){var s,a,i,r,o=e,u=null;return wt.isDuration(e)?o={ms:e._milliseconds,d:e._days,M:e._months}:"number"==typeof e?(o={},t?o[t]=e:o.milliseconds=e):(u=At.exec(e))?(s="-"===u[1]?-1:1,o={y:0,d:O(u[Wt])*s,h:O(u[Ct])*s,m:O(u[Gt])*s,s:O(u[Ft])*s,ms:O(u[Pt])*s}):(u=zt.exec(e))?(s="-"===u[1]?-1:1,i=function(e){var t=e&&parseFloat(e.replace(",","."));return(isNaN(t)?0:t)*s},o={y:i(u[2]),M:i(u[3]),d:i(u[4]),h:i(u[5]),m:i(u[6]),s:i(u[7]),w:i(u[8])}):null==o?o={}:"object"==typeof o&&("from"in o||"to"in o)&&(r=M(wt(o.from),wt(o.to)),o={},o.ms=r.milliseconds,o.M=r.months),a=new h(o),wt.isDuration(e)&&n(e,"_locale")&&(a._locale=e._locale),a},wt.version=kt,wt.defaultFormat=on,wt.ISO_8601=function(){},wt.momentProperties=It,wt.updateOffset=function(){},wt.relativeTimeThreshold=function(t,n){return mn[t]===e?!1:n===e?mn[t]:(mn[t]=n,!0)},wt.lang=i("_time_conversion_.lang is deprecated. Use _time_conversion_.locale instead.",function(e,t){return wt.locale(e,t)}),wt.locale=function(e,t){var n;return e&&(n="undefined"!=typeof t?wt.defineLocale(e,t):wt.localeData(e),n&&(wt.duration._locale=wt._locale=n)),wt._locale._abbr},wt.defineLocale=function(e,t){return null!==t?(t.abbr=e,Lt[e]||(Lt[e]=new d),Lt[e].set(t),wt.locale(e),Lt[e]):(delete Lt[e],null)},wt.langData=i("_time_conversion_.langData is deprecated. Use _time_conversion_.localeData instead.",function(e){return wt.localeData(e)}),wt.localeData=function(e){var t;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return wt._locale;if(!Y(e)){if(t=x(e))return t;e=[e]}return I(e)},wt.isMoment=function(e){return e instanceof f||null!=e&&n(e,"_isAMomentObject")},wt.isDuration=function(e){return e instanceof h};for(vt=Dn.length-1;vt>=0;--vt)T(Dn[vt]);wt.normalizeUnits=function(e){return b(e)},wt.invalid=function(e){var t=wt.utc(0/0);return null!=e?_(t._pf,e):t._pf.userInvalidated=!0,t},wt.parseZone=function(){return wt.apply(null,arguments).parseZone()},wt.parseTwoDigitYear=function(e){return O(e)+(O(e)>68?1900:2e3)},wt.isDate=v,_(wt.fn=f.prototype,{clone:function(){return wt(this)},valueOf:function(){return+this._d-6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var e=wt(this).utc();return 0<e.year()&&e.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():Z(e,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):Z(e,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var e=this;return[e.year(),e.month(),e.date(),e.hours(),e.minutes(),e.seconds(),e.milliseconds()]},isValid:function(){return P(this)},isDSTShifted:function(){return this._a?this.isValid()&&k(this._a,(this._isUTC?wt.utc(this._a):wt(this._a)).toArray())>0:!1},parsingFlags:function(){return _({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(e){return this.utcOffset(0,e)},local:function(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(this._dateUtcOffset(),"m")),this},format:function(e){var t=Z(this,e||wt.defaultFormat);return this.localeData().postformat(t)},add:D(1,"add"),subtract:D(-1,"subtract"),diff:function(e,t,n){var s,a,i=H(e,this),r=6e4*(i.utcOffset()-this.utcOffset());return t=b(t),"year"===t||"month"===t||"quarter"===t?(a=c(this,i),"quarter"===t?a/=3:"year"===t&&(a/=12)):(s=this-i,a="second"===t?s/1e3:"minute"===t?s/6e4:"hour"===t?s/36e5:"day"===t?(s-r)/864e5:"week"===t?(s-r)/6048e5:s),n?a:y(a)},from:function(e,t){return wt.duration({to:this,from:e}).locale(this.locale()).humanize(!t)},fromNow:function(e){return this.from(wt(),e)},calendar:function(e){var t=e||wt(),n=H(t,this).startOf("day"),s=this.diff(n,"days",!0),a=-6>s?"sameElse":-1>s?"lastWeek":0>s?"lastDay":1>s?"sameDay":2>s?"nextDay":7>s?"nextWeek":"sameElse";return this.format(this.localeData().calendar(a,this,wt(t)))},isLeapYear:function(){return G(this.year())},isDST:function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},day:function(e){var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=rt(e,this.localeData()),this.add(e-t,"d")):t},month:yt("Month",!0),startOf:function(e){switch(e=b(e)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===e?this.weekday(0):"isoWeek"===e&&this.isoWeekday(1),"quarter"===e&&this.month(3*Math.floor(this.month()/3)),this},endOf:function(t){return t=b(t),t===e||"millisecond"===t?this:this.startOf(t).add(1,"isoWeek"===t?"week":t).subtract(1,"ms")},isAfter:function(e,t){var n;return t=b("undefined"!=typeof t?t:"millisecond"),"millisecond"===t?(e=wt.isMoment(e)?e:wt(e),+this>+e):(n=wt.isMoment(e)?+e:+wt(e),n<+this.clone().startOf(t))},isBefore:function(e,t){var n;return t=b("undefined"!=typeof t?t:"millisecond"),"millisecond"===t?(e=wt.isMoment(e)?e:wt(e),+e>+this):(n=wt.isMoment(e)?+e:+wt(e),+this.clone().endOf(t)<n)},isBetween:function(e,t,n){return this.isAfter(e,n)&&this.isBefore(t,n)},isSame:function(e,t){var n;return t=b(t||"millisecond"),"millisecond"===t?(e=wt.isMoment(e)?e:wt(e),+this===+e):(n=+wt(e),+this.clone().startOf(t)<=n&&n<=+this.clone().endOf(t))},min:i("_time_conversion_().min is deprecated, use _time_conversion_.min instead. https://github.com/_time_conversion_/_time_conversion_/issues/1548",function(e){return e=wt.apply(null,arguments),this>e?this:e}),max:i("_time_conversion_().max is deprecated, use _time_conversion_.max instead. https://github.com/_time_conversion_/_time_conversion_/issues/1548",function(e){return e=wt.apply(null,arguments),e>this?this:e}),zone:i("_time_conversion_().zone is deprecated, use _time_conversion_().utcOffset instead. https://github.com/_time_conversion_/_time_conversion_/issues/1779",function(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()}),utcOffset:function(e,t){var n,s=this._offset||0;return null!=e?("string"==typeof e&&(e=N(e)),Math.abs(e)<16&&(e=60*e),!this._isUTC&&t&&(n=this._dateUtcOffset()),this._offset=e,this._isUTC=!0,null!=n&&this.add(n,"m"),s!==e&&(!t||this._changeInProgress?w(this,wt.duration(e-s,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,wt.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?s:this._dateUtcOffset()},isLocal:function(){return!this._isUTC},isUtcOffset:function(){return this._isUTC},isUtc:function(){return this._isUTC&&0===this._offset},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(N(this._i)),this},hasAlignedHourOffset:function(e){return e=e?wt(e).utcOffset():0,(this.utcOffset()-e)%60===0},daysInMonth:function(){return U(this.year(),this.month())},dayOfYear:function(e){var t=St((wt(this).startOf("day")-wt(this).startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")},quarter:function(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)},weekYear:function(e){var t=ct(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==e?t:this.add(e-t,"y")},isoWeekYear:function(e){var t=ct(this,1,4).year;return null==e?t:this.add(e-t,"y")},week:function(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")},isoWeek:function(e){var t=ct(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")},weekday:function(e){var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")},isoWeekday:function(e){return null==e?this.day()||7:this.day(this.day()%7?e:e-7)},isoWeeksInYear:function(){return W(this.year(),1,4)},weeksInYear:function(){var e=this.localeData()._week;return W(this.year(),e.dow,e.doy)},get:function(e){return e=b(e),this[e]()},set:function(e,t){var n;if("object"==typeof e)for(n in e)this.set(n,e[n]);else e=b(e),"function"==typeof this[e]&&this[e](t);return this},locale:function(t){var n;return t===e?this._locale._abbr:(n=wt.localeData(t),null!=n&&(this._locale=n),this)},lang:i("_time_conversion_().lang() is deprecated. Instead, use _time_conversion_().localeData() to get the language configuration. Use _time_conversion_().locale() to change languages.",function(t){return t===e?this.localeData():this.locale(t)}),localeData:function(){return this._locale},_dateUtcOffset:function(){return 15*-Math.round(this._d.getTimezoneOffset()/15)}}),wt.fn.millisecond=wt.fn.milliseconds=yt("Milliseconds",!1),wt.fn.second=wt.fn.seconds=yt("Seconds",!1),wt.fn.minute=wt.fn.minutes=yt("Minutes",!1),wt.fn.hour=wt.fn.hours=yt("Hours",!0),wt.fn.date=yt("Date",!0),wt.fn.dates=i("dates accessor is deprecated. Use date instead.",yt("Date",!0)),wt.fn.year=yt("FullYear",!0),wt.fn.years=i("years accessor is deprecated. Use year instead.",yt("FullYear",!0)),wt.fn.days=wt.fn.day,wt.fn.months=wt.fn.month,wt.fn.weeks=wt.fn.week,wt.fn.isoWeeks=wt.fn.isoWeek,wt.fn.quarters=wt.fn.quarter,wt.fn.toJSON=wt.fn.toISOString,wt.fn.isUTC=wt.fn.isUtc,_(wt.duration.fn=h.prototype,{_bubble:function(){var e,t,n,s=this._milliseconds,a=this._days,i=this._months,r=this._data,o=0;r.milliseconds=s%1e3,e=y(s/1e3),r.seconds=e%60,t=y(e/60),r.minutes=t%60,n=y(t/60),r.hours=n%24,a+=y(n/24),o=y(pt(a)),a-=y(gt(o)),i+=y(a/30),a%=30,o+=y(i/12),i%=12,r.days=a,r.months=i,r.years=o},abs:function(){return this._milliseconds=Math.abs(this._milliseconds),this._days=Math.abs(this._days),this._months=Math.abs(this._months),this._data.milliseconds=Math.abs(this._data.milliseconds),this._data.seconds=Math.abs(this._data.seconds),this._data.minutes=Math.abs(this._data.minutes),this._data.hours=Math.abs(this._data.hours),this._data.months=Math.abs(this._data.months),this._data.years=Math.abs(this._data.years),this},weeks:function(){return y(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*O(this._months/12)
},humanize:function(e){var t=ut(this,!e,this.localeData());return e&&(t=this.localeData().pastFuture(+this,t)),this.localeData().postformat(t)},add:function(e,t){var n=wt.duration(e,t);return this._milliseconds+=n._milliseconds,this._days+=n._days,this._months+=n._months,this._bubble(),this},subtract:function(e,t){var n=wt.duration(e,t);return this._milliseconds-=n._milliseconds,this._days-=n._days,this._months-=n._months,this._bubble(),this},get:function(e){return e=b(e),this[e.toLowerCase()+"s"]()},as:function(e){var t,n;if(e=b(e),"month"===e||"year"===e)return t=this._days+this._milliseconds/864e5,n=this._months+12*pt(t),"month"===e?n:n/12;switch(t=this._days+Math.round(gt(this._months/12)),e){case"week":return t/7+this._milliseconds/6048e5;case"day":return t+this._milliseconds/864e5;case"hour":return 24*t+this._milliseconds/36e5;case"minute":return 24*t*60+this._milliseconds/6e4;case"second":return 24*t*60*60+this._milliseconds/1e3;case"millisecond":return Math.floor(24*t*60*60*1e3)+this._milliseconds;default:throw new Error("Unknown unit "+e)}},lang:wt.fn.lang,locale:wt.fn.locale,toIsoString:i("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",function(){return this.toISOString()}),toISOString:function(){var e=Math.abs(this.years()),t=Math.abs(this.months()),n=Math.abs(this.days()),s=Math.abs(this.hours()),a=Math.abs(this.minutes()),i=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(e?e+"Y":"")+(t?t+"M":"")+(n?n+"D":"")+(s||a||i?"T":"")+(s?s+"H":"")+(a?a+"M":"")+(i?i+"S":""):"P0D"},localeData:function(){return this._locale},toJSON:function(){return this.toISOString()}}),wt.duration.fn.toString=wt.duration.fn.toISOString;for(vt in dn)n(dn,vt)&&Mt(vt.toLowerCase());wt.duration.fn.asMilliseconds=function(){return this.as("ms")},wt.duration.fn.asSeconds=function(){return this.as("s")},wt.duration.fn.asMinutes=function(){return this.as("m")},wt.duration.fn.asHours=function(){return this.as("h")},wt.duration.fn.asDays=function(){return this.as("d")},wt.duration.fn.asWeeks=function(){return this.as("weeks")},wt.duration.fn.asMonths=function(){return this.as("M")},wt.duration.fn.asYears=function(){return this.as("y")},wt.locale("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10,n=1===O(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th";return e+n}}),xt?module.exports=wt:"function"==typeof define&&define.amd?(define(function(e,t,n){return n.config&&n.config()&&n.config().noGlobal===!0&&(bt._time_conversion_=Yt),wt}),Dt(!0)):Dt()}).call(this);
!function(t,a){var e=1e3,i=!1,n=t([]),o=function(){s.resume()},r=function(e,i){var o=e.data("livestampdata");if("number"==typeof i&&(i*=1e3),e.removeAttr("data-livestamp").removeData("livestamp"),i=a(i),a.isMoment(i)&&!isNaN(+i)){var r=t.extend({},{original:e.contents()},o);r._time_conversion_=a(i),e.data("livestampdata",r).empty(),n.push(e[0])}},m=function(){i||(s.update(),setTimeout(m,e))},s={update:function(){t("[data-livestamp]").each(function(){var a=t(this);r(a,a.data("livestamp"))});var e=[];n.each(function(){var i=t(this),n=i.data("livestampdata");if(void 0===n)e.push(this);else if(a.isMoment(n._time_conversion_)){var o=i.html(),r=n._time_conversion_.fromNow();if(o!=r){var m=t.Event("change.livestamp");i.trigger(m,[o,r]),m.isDefaultPrevented()||i.html(r)}}}),n=n.not(e)},pause:function(){i=!0},resume:function(){i=!1,m()},interval:function(t){return void 0===t?e:void(e=t)}},u={add:function(e,i){return"number"==typeof i&&(i*=1e3),i=a(i),a.isMoment(i)&&!isNaN(+i)&&(e.each(function(){r(t(this),i)}),s.update()),e},destroy:function(a){return n=n.not(a),a.each(function(){var e=t(this),i=e.data("livestampdata");return void 0===i?a:void e.html(i.original?i.original:"").removeData("livestampdata")}),a},isLivestamp:function(t){return void 0!==t.data("livestampdata")}};t.livestamp=s,t(o),t.fn.livestamp=function(t,a){return u[t]||(a=t,t="add"),u[t](this,a)}}(jQuery,_time_conversion_);
/*time_conversion*/
