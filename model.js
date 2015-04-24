var db = require('node-mysql');
var DB = db.DB;
var box = new DB({
	host 	: 'localhost',
	user 	: 'root',
	password: 'nostramorte',
	database: 'velocity',
	connectionLimit: 50
});

var schedule = function (socket) {
	box.connect(function(conn) {
		conn.query('SELECT * FROM TIPO_BUS;',function(err, rows, fields) {
			console.log('Sending response/n'+rows);
			socket.emit('refresh',rows);
		});
	});
}

exports.schedule = schedule;
