var db = require('node-mysql');
var DB = db.DB;
var box = new DB({
	host 	: 'localhost',
	user 	: 'root',
	password: 'nostramorte',
	database: 'control',
	connectionLimit: 50
});

var init = function() {
	box.connect(function(conn) {
		console.log('Connected to MySQL');
	});
}

var schedule = function (socket) {
	console.log('Sending response');
	socket.emit('refresh','2H','21:00');
}

exports.init = init;
exports.schedule = schedule;
