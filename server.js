var http = require('http');
var url = require('url');
var io = require('socket.io');
var model = require('./model');


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
		socket_listener.on('addbus', function(plate, type){
			console.log('Adding bus...');
			model.addbus(socket_listener, plate, type);
		});
		socket_listener.on('modbus', function(id, plate, type){
			console.log('Modifying bus...');
			model.modbus(socket_listener, id, plate, type);
		});
		socket_listener.on('delbus', function(id, plate, type){
			console.log('Deleting bus...');
			model.delbus(socket_listener, id);
		});
		socket_listener.on('requestschedule', function(){
			console.log('Requesting schedule...');
			model.schedule(socket_listener);
		});
		socket_listener.on('requestmanagebus', function(){
			console.log('Requesting bus info...');
			model.busmanage(socket_listener);
		});
		socket_listener.on('requestmanageroute', function(){
			console.log('Requesting route info...');
		});
	});
	server.listen(8080, '0.0.0.0');
	console.log('Server Initiated at http://0.0.0.0:8080/');
}

exports.iniciar = iniciar;
