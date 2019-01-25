var webSocketUrl = "wss://api.artik.cloud/v1.1/websocket?ack=true";
var device_id = "Your Device ID";
var device_token = "Your Device Token";

var WebSocket = require('ws');
var isWebSocketReady = false;
var ws = null;

var puts = require('sys').puts;

setInterval(function() {
    sendSensorValueToArtikCloud();
}, 5000);

function getTimeMillis(){
    return parseInt(Date.now().toString());
}

function start() {
    //Create the WebSocket connection
    isWebSocketReady = false;
    ws = new WebSocket(webSocketUrl);
    ws.on('open', function() {
        console.log("WebSocket connection is open ....");
        register();
    });
    ws.on('message', function(data) {
       console.log("Received message: " + data + '\n');
         handleRcvMsg(data);
    });
    ws.on('close', function() {
        console.log("WebSocket connection is closed ....");
        exitClosePins();
    });
}

function register(){
    console.log("Registering device on the WebSocket connection");
    try{
        var registerMessage = 
           '{"type":"register", "sdid":"'+device_id+'", "Authorization":"bearer '+device_token+'", "cid":"'+getTimeMillis()+'"}';
        console.log('Sending register message ' + registerMessage + '\n');
        ws.send(registerMessage, {mask: true});
        isWebSocketReady = true;
    }
    catch (e) {
        console.error('Failed to register messages. Error in registering message: ' 
        + e.toString());
    }    
}

function sendSensorValueToArtikCloud(){
    try{
        ts = ', "ts": '+getTimeMillis();
        var temp = Math.floor((Math.random() * 100) + 1);
        var data = {
              "Temperature": temp 
            };
        var payload = '{"sdid":"'+device_id+'"'+ts+', "data": '+JSON.stringify(data)+', "cid":"'+getTimeMillis()+'"}';        
        console.log('Sending payload ' + payload + '\n');
        ws.send(payload, {mask: true});
    } catch (e) {
        console.error('Error in sending a message: ' + e.toString() +'\n');
    }    
}

function exitClosePins() {
    console.log('Exit and destroy all pins!');
    process.exit();
}

start();
