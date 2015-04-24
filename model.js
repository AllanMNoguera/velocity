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
					console.log('Bus added');
					socket.emit('buscorrect');
				} else {
					console.log('Bus not created... ' + err);
					socket.emit('busincorrect');
				}
			});
		});
	});
}

var modbus = function (socket, id, plate, type) {
	box.connect(function(conn) {
		conn.query('UPDATE BUS SET PLACA = "?", TIPO_BUS = ? WHERE BUS = ?;', [plate,type,id],function(err, types, fields) {
			if(err === null) {
				console.log('Bus modified');
				socket.emit('busmodified');
			} else {
				console.log('Bus not modified... ' + err);
				socket.emit('busnotmodified');
			}
		});
	});
}

var delbus = function (socket, id) {
	box.connect(function(conn) {
		conn.query('DELETE FROM BUS WHERE BUS = ?;', [id],function(err, types, fields) {
			if(err === null) {
				console.log('Bus deleted');
				socket.emit('busdeleted');
			} else {
				console.log('Bus not deleted... ' + err);
				socket.emit('busnotdeleted');
			}
		});
	});
}

var busmanage = function (socket) {
	box.connect(function(conn) {
		conn.query('SELECT * FROM TIPO_BUS;',function(err, types, fields) {
			console.log('Types fetched...');
			conn.query('SELECT BUS, PLACA FROM BUS;',function(err, buses, fields) {
				console.log('Buses fetched...');
				socket.emit('refreshbus',types,buses);
			});
		});
	});
}

exports.schedule = schedule;
exports.busmanage = busmanage;
exports.addbus = addbus;
exports.modbus = modbus;
exports.delbus = delbus;
