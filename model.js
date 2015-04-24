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

var addbus = function (socket, plate, type) {
	box.connect(function(conn) {
		conn.query('SELECT BUS FROM BUS ORDER BY BUS DESC LIMIT 1;',function(err, rows, fields) {
			console.log('Adding bus...');
			var id = 1;
			if(rows.length > 0) {
				id = parseInt(rows[0].BUS) + 1;
			}
			console.log('Adding index ' + id);
			conn.query('INSERT INTO BUS VALUES(?,"?",?);',[id,plate,type],function (err, rows, fields) {
				if(err === null) {
					console.log('Bus added.');
					socket.emit('buscorrect');
				} else {
					console.log('Bus error ' + err);
					socket.emit('busincorrect');
				}
			});
		});
	});
}

var bustype = function (socket) {
	box.connect(function(conn) {
		conn.query('SELECT * FROM TIPO_BUS;',function(err, rows, fields) {
			console.log('Sending types...');
			socket.emit('refreshbus',rows);
		});
	});
}

exports.schedule = schedule;
exports.bustype = bustype;
exports.addbus = addbus;
