var http = require('http');
var url = require('url');
var io = require('socket.io');


function iniciar(route, handle) {
	function onRequest(req, res) {
		var pathname = url.parse(req.url).pathname;
		var querystring = url.parse(req.url).query;
		if(pathname !=='/favicon.ico') {
			console.log('Request Recived for ' + pathname);
			route(pathname, querystring, handle, res);
		} else if(pathname === '/'){
			res.end();
		}
	}

	var server = http.createServer(onRequest);
	var socket = io(server);
	socket.on('connection', function(socket_listener){
		console.log('User has connected');
		socket_listener.on('request', function(socker_listener){
			console.log('User sent request');
			socket_listener.emit('refresh','2H','21:00');
			console.log('Response sent');
		});
	});
	server.listen(8080, '0.0.0.0');
	console.log('Server Initiated at http://0.0.0.0:8080/');
}

exports.iniciar = iniciar;
