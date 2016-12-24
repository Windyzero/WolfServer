var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var handler = require('./NetRequestHandler.js');
var Data = require('./Data.js');
var NetDef = require('./NetDef.js');

app.use(express.static(__dirname + "/public"));
handler.setIo(io);

io.on('connection', function(socket){
    socket.on('request', function(msg){
        handler.onRequest(socket, msg);
    })

    socket.on('disconnect', function(){
        if(Data.onlineUsers.hasOwnProperty(socket.name)) {		
			delete Data.onlineUsers[socket.name];
			Data.onlineCount--;

            var data = {
                notifyType: NetDef.NotifyType.USER_DISCONNECT,
                username: socket.name,
                onlineUsers:Data.onlineUsers, 
                onlineCount:Data.onlineCount
            };
            var msg = JSON.stringify(data);
			
			io.emit('notify', msg);
			console.log(socket.name +' disconnect');
		}
    })

    var response = {};
    response.responseType = NetDef.ResponseType.CONNECTED; 
    socket.emit('response', JSON.stringify(response));
});

http.listen(3000, function(){
    console.log('listening on : 3000');
});