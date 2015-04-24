var socket = io.connect('http://localhost:8080');
var htmlrow = '<option class="option" value="{:id:}">{:nombre:}</option>';

var bustype;

socket.on('refreshbus', function(rows) {
	$('option').remove('.option');
	bustype = rows;
	for (var row in rows) {
		console.log(row);
		var newoption = htmlrow.replace('{:id:}', rows[row].TIPO_BUS);
		newoption = newoption.replace('{:nombre:}', rows[row].NOMBRE);
		console.log(newoption);
		$('#bustype').append(newoption);
	}	
});

socket.on('buscorrect', function() {
	$('#busplate').val('');
	window.alert("Bus added");	
});


socket.on('busincorrect', function() {
	$('#busplate').val('');
	window.alert("Error");	
});

var main = function () {
	$('#bus').toggle();
	$('#route').toggle();
	$('#home').click(function() {
		window.location.replace('http://localhost:8080/');
	});
	$('#addbus').click(function() {	
		$('#bus').toggle();
		socket.emit('requestaddbus');
	});
	$('#createbus').click(function() {
		var type = $('#bustype').val();
		var plate = $('#busplate').val();
		socket.emit('addbus', plate, type);
	});
	$('#addroute').click(function() {
		$('#route').toggle();	
		socket.emit('requestaddroute');
	});
};

$(document).ready(main);
