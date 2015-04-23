var socket = io.connect('http://localhost:8080');
var htmlrow = '<tr class="info"><td>{:id:}</td><td>{:data:}</tr>';

socket.on('refresh', function(rows) {
	$('tr').remove('.info');
	for (var row in rows) {
		var newhtmlrow = htmlrow.replace('{:id:}',rows[row].id);
		newhtmlrow = newhtmlrow.replace('{:data:}',rows[row].data);
		$('#itinerario').append(newhtmlrow);
	}
});

var main = function () {
	$('#button').click(function() {
		socket.emit('request');
	});
};

$(document).ready(main);
