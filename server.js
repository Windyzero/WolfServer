var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var NetDef = require('./NetDef.js');

app.use(express.static(__dirname + "/public"));

var onlineUsers = {};

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('a user disconnect');
    })

    var response = {};
    response.actionType = NetDef.Response.CONNECTED;
    response.string = "nectwork server string";
    var str = JSON.stringify(response);    
    socket.emit('response', str);
});

http.listen(3000, function(){
    console.log('listening on : 3000');
});