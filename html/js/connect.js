var socket = io.connect('http://localhost:8080');
var htmlrow = '<option class="info" value="{:id:}">{:dato:}</option>';
var htmlinput = '<input type="checkbox" name="schedulelist" value="{:id:}">{:dato:}<br>';
var htmltext = '<input type="checkbox" name="ticketlist" value="{:id:}">{:dato:}<br>';

var chkArray = [];
var total = 0;

socket.on('refreshschedule', function(routes) {
	$('option').remove('.info');
	$('#expandedticket').empty();
	$('#amount').val('');
	for (var route in routes) {
		var newhtmlrow = htmlrow.replace('{:id:}',routes[route].RUTA + '/' + routes[route].HORA_PARTIDA + '/' + routes[route].BUS);
		newhtmlrow = newhtmlrow.replace('{:dato:}','Route: ' + routes[route].RUTA + ' Start: ' + routes[route].HORA_PARTIDA + ' Bus: ' + routes[route].BUS);
		$('#route').append(newhtmlrow);
	}
});

socket.on('expandschedule', function(routes) {
	$('#expanded').empty();
	$('#expandedticket').empty();
	for (var route in routes) {
		var newhtmlinput = htmlinput.replace('{:id:}',routes[route].RUTA + '/' + routes[route].HORA_LUGAR + '/' + routes[route].LUGAR + '/' + routes[route].HORA_PARTIDA + '/' + routes[route].BUS + '/' + routes[route].COSTO_DESDE_ANT);
		newhtmlinput = newhtmlinput.replace('{:dato:}','Route: ' + routes[route].RUTA + ' Hour: ' + routes[route].HORA_LUGAR + ' Place: ' + routes[route].NOMBRE + ' Value: ' + routes[route].COSTO_DESDE_ANT);
		$('#expanded').append(newhtmlinput);
	}
});

socket.on('refreshticket', function(routes, places, fields) {
	$('#expandedticket').empty();
	$('#ticket').val('');
	console.log('Showing places' + places);
	for (var place in places) {
		
		var newhtmlrow = htmltext.replace('{:id:}',places[place].RUTA);
		newhtmlrow = newhtmlrow.replace('{:dato:}','Route: ' + places[place].RUTA + ' Start: ' + places[place].HORA_PARTIDA + ' City: ' +  places[place].NOMBRE);
		$('#expandedticket').append(newhtmlrow);
	}
});

socket.on('paycorrect', function(routes, idticket, idconfi) {
	$('#expanded').empty();
	$('#amount').val('');
	window.alert("Payment Successful\nYour ticket is : " + idticket);
});


socket.on('payincorrect', function(routes) {
	$('#expanded').empty();
	$('#amount').val('');
	window.alert('Payment Unsuccessful');
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
	$('#expand').click(function() {
		var vals = $('#route').val().split('/');
		$('#amount').val('');
		socket.emit('expandroute', vals[0], vals[1], vals[2]);
	});
	$('#generate').click(function() {
		chkArray = [];
		total = 0;
		$("input:checkbox:checked").each(function() {
			chkArray.push($(this).val());
		});

		for (var i = 1; i < chkArray.length; i++) {
			var val = chkArray[i].split('/');
			total += parseInt(val[val.length - 1]);
		}
		$('#amount').val(total);
	});
	$('#pay').click(function() {
		socket.emit('payticket', chkArray, total);
	});
	$('#show').click(function() {
		var ticket = $('#ticket').val();
		socket.emit('showticket', ticket);
	});
};

$(document).ready(main);
