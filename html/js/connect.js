var socket = io.connect('http://localhost:8080');
var htmlrow = '<tr class="info"><td>{:id:}</td><td>{:data:}</tr>';

socket.on('refresh', function(rows) {
	$('tr').remove('.info');
	for (var row in rows) {
		var newhtmlrow = htmlrow.replace('{:id:}',rows[row].TIPO_BUS);
		newhtmlrow = newhtmlrow.replace('{:data:}',rows[row].NOMBRE);
		$('#itinerario').append(newhtmlrow);
	}
});

var main = function () {
	$('#login_tool').toggle();	
	socket.emit('requestschedule');
	$('#refresh').click(function() {
		socket.emit('requestschedule');
	});
	$('#admin').click(function() {
		$('#login_tool').toggle();
	});
	$('#login').click(function() {
		var user = $('#user').val();
		var pass = $('#pass').val();
		if(user === 'Admin' && pass === 'velocity') {
			window.location.replace('http://localhost:8080/admin');
		} else {
			$('#user').val('');
			$('#pass').val('');
		}
	});
};

$(document).ready(main);
