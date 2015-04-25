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
		conn.query('SELECT * FROM RUTA;',function(err, routes, fields) {
			console.log('Sending schedule...');
			socket.emit('refreshschedule',routes);
		});
	});
}

var showticket = function (socket, ticket) {
	box.connect(function(conn) {
		conn.query('SELECT * FROM RUTA_TIQUETE R JOIN LUGAR L ON R.LUGAR = L.LUGAR WHERE TIQUETE = ?;', [ticket],function(err, places, fields) {
			console.log('Sending places...');
			socket.emit('refreshticket', places.length, places);
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
			conn.query('INSERT INTO BUS VALUES(?,?,?);',[id,plate,type],function (err, rows) {
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
		conn.query('UPDATE BUS SET PLACA = ?, TIPO_BUS = ? WHERE BUS = ?;', [plate,type,id],function(err, rows) {
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
		conn.query('DELETE FROM BUS WHERE BUS = ?;', [id],function(err, rows) {
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
				conn.query('SELECT RUTA, HORA_PARTIDA FROM RUTA;',function(err, routes, fields) {
					console.log('Routes fetched...');
					socket.emit('refreshbus',types,buses,routes);
				});
			});
		});
	});
}

var addtoroute = function (socket, point) {
	box.connect(function(conn) {
		conn.query('INSERT INTO RUTA_LUGAR VALUES(?,?,?,?,?,?,?);',
			   [point.route, point.cityhour, point.city, point.routehour,
			    point.busid, point.value, point.type],function (err, rows) {
			if(err === null) {
				console.log('Added to route...');
				socket.emit('addedtoroute');
			} else {
				console.log('Not added to route... ' + err);
				socket.emit('notaddedtoroute');
			}
		});
	});
}

var expandroute = function (socket, route, hour, busid) {
	box.connect(function(conn) {
		conn.query('SELECT * FROM RUTA_LUGAR AS R JOIN LUGAR AS L ON R.LUGAR = L.LUGAR WHERE R.RUTA = ? AND R.HORA_PARTIDA = ? AND BUS = ? ORDER BY RUTA,TIPO_PUNTO;', [route, hour, busid] ,function(err, routes, fields) {
			if(err === null){
				console.log('Sending schedule...');
				socket.emit('expandschedule',routes);
			} else {
				console.log('Expanding error: ' + err);
			}
		});
	});
}

var delroute = function (socket, route, hour) {
	box.connect(function(conn) {
		console.log(route + ' - ' + hour);
		conn.query('DELETE FROM RUTA WHERE RUTA = ? AND HORA_PARTIDA = ? ;', [route, hour],function(err, rows) {
			if(err === null) {
				console.log('Deleting route:' + rows.length);
				conn.query('DELETE FROM RUTA_LUGAR WHERE RUTA = ? AND HORA_PARTIDA = ?;', [route, hour],function(err, rows) {
					if(err === null) {
						console.log('Route deleted...');
						socket.emit('routedeleted');
					} else {
						console.log('Route not deleted... ' + err);
						socket.emit('routenotdeleted');
					}
				});
			} else {
				console.log('Route not deleted... ' + err);
				socket.emit('routenotdeleted');
			}
		});
	});
}

var routemanage = function (socket, route, hour, busid) {
	box.connect(function(conn) {
		conn.query('SELECT * FROM TIPO_PUNTO;',function(err, types, fields) {
			console.log('Types fetched...');
			conn.query('SELECT LUGAR, NOMBRE FROM LUGAR;',function(err, cities, fields) {
				console.log('Cities fetched...');
				socket.emit('refreshroute',types,cities);
			});
		});
		console.log(hour);
		conn.query('INSERT INTO RUTA VALUES(?,?,?);',[route, hour, busid],function (err, rows) {
			if(err === null) {
				console.log('Route added');
				socket.emit('routecorrect');
			} else {
				console.log('Route not created... ' + err);
				socket.emit('routeincorrect');
			}
		});
	});
}

var pay = function(socket, checklist, total) {
	box.connect(function(conn) {
		conn.query('SELECT TIQUETE FROM TIQUETE ORDER BY TIQUETE DESC LIMIT 1;',function(err, rows, fields) {
			var idt = 1;
			var idc = 1;
			if(rows.length > 0) {
				idt = parseInt(rows[0].TIQUETE) + 1;
			}
			conn.query('SELECT CONFIRMACION FROM PAGO ORDER BY CONFIRMACION DESC LIMIT 1;',function(err, rows, fields) {
				if(rows.length > 0) {
					idc = parseInt(rows[0].CONFIRMACION) + 1;
				}
				conn.query('INSERT INTO TIQUETE VALUES(?,now());',[idt],function (err, rows) {
					if(err === null) {
						conn.query('INSERT INTO PAGO VALUES(?,?,?);',[idc,total,idt],function (err, rows) {
							if(err === null) {
								for (check in checklist) {
									var data = checklist[check].split('/');
									var type = 2;
									if (check == 0) {type = 1};
									if (check == checklist.length - 1) {type = 3};
									conn.query('INSERT INTO RUTA_TIQUETE VALUES(?,?,?,?,?,?,?);',[data[0],data[1],data[2],data[3],data[4],idt,type],function (err, rows) {
										console.log('Payment successful...');
									});
								}
								socket.emit('paycorrect',idt,idc);
							} else {
								console.log('Payment rejected... ' + err);
								socket.emit('payincorrect');
							}
						});
					} else {
						console.log('Payment rejected... ' + err);
						socket.emit('payincorrect');
					}
				});
			});
		});
	});
}

exports.schedule = schedule;
exports.busmanage = busmanage;
exports.expandroute = expandroute;
exports.routemanage = routemanage;
exports.addtoroute = addtoroute;
exports.delroute = delroute;
exports.showticket = showticket;
exports.addbus = addbus;
exports.modbus = modbus;
exports.delbus = delbus;
exports.pay = pay;
