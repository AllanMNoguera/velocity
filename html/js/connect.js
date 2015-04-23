var socket = io.connect('http://localhost:8080');
socket.on('refresh', function(ruta,hora) {
	$('#itinerario').append("<tr><td>"+ruta+"</td><td>"+hora+"</tr>");
});

var main = function () {
	$('#button').click(function() {
		socket.emit('request');
	});
};

$(document).ready(main);
