var socket = io.connect('http://localhost:8080');
var htmlrow = '<option class="option" value="{:id:}">{:dato:}</option>';

var bustype;

socket.on('refreshbus', function(types, buses) {
	$('option').remove('.option');
	bustype = types;
	for (var type in types) {
		var newtype = htmlrow.replace('{:id:}', types[type].TIPO_BUS);
		newtype = newtype.replace('{:dato:}', types[type].NOMBRE);
		$('#bustypecre').append(newtype);
		$('#bustypemod').append(newtype);
	}
	for (bus in buses) {
		var newbus = htmlrow.replace('{:id:}', buses[bus].BUS);
		newbus = newbus.replace('{:dato:}', buses[bus].PLACA);
		$('#buses').append(newbus);
		$('#busesdel').append(newbus);
	}	
});

socket.on('busdeleted', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	socket.emit('requestmanagebus');
	window.alert("Bus deleted");	
});

socket.on('buscorrect', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	socket.emit('requestmanagebus');
	window.alert("Bus added");	
});

socket.on('busmodified', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	socket.emit('requestmanagebus');
	window.alert("Bus modified");	
});

socket.on('busnotdeleted', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	window.alert("Bus not deleted");	
});

socket.on('busincorrect', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	window.alert("Bus not added");	
});

socket.on('busnotmodified', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	window.alert("Bus not modified");	
});

var main = function () {
	$('#bus').toggle();
	$('#route').toggle();
	$('#home').click(function() {
		window.location.replace('http://localhost:8080/');
	});
	$('#managebus').click(function() {	
		$('#bus').toggle();
		socket.emit('requestmanagebus');
	});
	$('#createbus').click(function() {
		var type = $('#bustypecre').val();
		var plate = $('#busplatecre').val();
		socket.emit('addbus', plate, type);
	});
	$('#modifybus').click(function() {
		console.log('Modifying bus...');
		var type = $('#bustypemod').val();
		var plate = $('#busplatemod').val();
		var id = $('#buses').val();
		socket.emit('modbus', id, plate, type);
	});
	$('#deletebus').click(function() {
		console.log('Deleting bus...');
		var id = $('#busesdel').val();
		socket.emit('delbus', id);
	});
	$('#manageroute').click(function() {
		$('#route').toggle();	
		socket.emit('requestmanageroute');
	});
};

$(document).ready(main);
