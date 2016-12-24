var NetDef = require('./NetDef.js');
var Data = require('./Data.js');
var server = require('./server.js');

var Handler = {
    setIo: function(io){
        this.io = io;
    },

    onRequest: function(socket, msg){
        console.log(msg);
        var req = JSON.parse(msg);
        var response;

        switch(req.actionType){
        case NetDef.ActionType.LOGIN:
            response = this.handleLogin(socket, req);
            break;
        default:
            console.log("unknown request");
            response = {
                responseType: NetDef.Response.ERROR,
                string: "系统错误！"
            }
            break;
        }
        response.actionType = req.actionType;
        var str = JSON.stringify(response);
        socket.emit('response', str);  
    },

    handleLogin: function(socket, req){
        socket.name = req.name;
        var response = {};

		if(!Data.onlineUsers.hasOwnProperty(req.name)) {
			Data.onlineCount++;
            Data.onlineUsers[req.name] = req.name;

            response.responseType = NetDef.ResponseType.SUCCESS;
            response.name = req.name;

            console.log(req.name + ' login');
            this.notifyUserLogin(req.name);
		}else{
            response.responseType = NetDef.ResponseType.ERROR;
            response.string = "该昵称已存在！";
        }

        return response;
    },

    notifyUserLogin: function(name){
        var data = {
            notifyType: NetDef.NotifyType.USER_LOGIN,
            username: name,
            onlineUsers:Data.onlineUsers, 
            onlineCount:Data.onlineCount
        };
        var str = JSON.stringify(data);
		this.io.emit('notify', str);
    } 
}

module.exports = Handler;