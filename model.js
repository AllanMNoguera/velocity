var db = require('node-mysql');
var DB = db.DB;
var box = new DB({
	host 	: 'localhost',
	user 	: 'root',
	password: 'nostramorte',
	database: 'control',
	connectionLimit: 50
});

var schedule = function (socket) {
	box.connect(function(conn) {
		conn.query('SELECT * FROM example;',function(err, rows, fields) {
			console.log('Sending response');
			socket.emit('refresh',rows);
		});
	});
}

exports.schedule = schedule;
