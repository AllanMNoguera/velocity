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
	$('#bus').toggle();
	$('#route').toggle();
	$('#home').click(function() {
		window.location.replace('http://localhost:8080/');
	});
	$('#addbus').click(function() {	
		$('#bus').toggle();
	});
	$('#addroute').click(function() {
		$('#route').toggle();	
		socket.emit('requestaddroute');
	});
};

$(document).ready(main);
