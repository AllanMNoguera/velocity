var socket = io.connect('http://localhost:8080');
var htmlrow = '<option class="option" value="{:id:}">{:dato:}</option>';

var BUSID;

var times =  function(){
	for (var i = 0; i <= 23; i++) {
		var newtime = htmlrow.replace('{:id:}',i + ':00').replace('class="option"','');
		newtime = newtime.replace('{:dato:}', i + ':00');
		$('#routehour').append(newtime);
		$('#cityhour').append(newtime);
	}	
};

socket.on('refreshbus', function(types, buses, routes) {
	$('option').remove('.option');
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
		$('#busesroute').append(newbus);
	}
	for (route in routes) {
		var newroute = htmlrow.replace('{:id:}', routes[route].RUTA + '/' + routes[route].HORA_PARTIDA);
		newroute = newroute.replace('{:dato:}', 'Route:' + routes[route].RUTA + ' - Hour :' + routes[route].HORA_PARTIDA);
		$('#routedel').append(newroute);
	}	
});

socket.on('refreshroute', function(types, cities) {
	$('option').remove('.routeop');
	for (var type in types) {
		var newtype = htmlrow.replace('{:id:}', types[type].TIPO_PUNTO).replace('"option"','"routeop"');
		newtype = newtype.replace('{:dato:}', types[type].TIPO);
		$('#citytype').append(newtype);
	}
	for (city in cities) {
		var newcity = htmlrow.replace('{:id:}', cities[city].LUGAR).replace('"option"','"routeop"');
		newcity = newcity.replace('{:dato:}', cities[city].NOMBRE);
		$('#city').append(newcity);
	}	
});

socket.on('routecorrect', function() {
	socket.emit('requestmanagebus');
	window.alert("Route added");	
});

socket.on('addedtoroute', function() {
	$('#routeval').val('');
	window.alert("Added to route");	
});

socket.on('busdeleted', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	socket.emit('requestmanagebus');
	window.alert("Bus deleted");	
});

socket.on('routedeleted', function() {
	socket.emit('requestmanagebus');
	window.alert("Route deleted");	
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

socket.on('routeincorrect', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	$('#add_tool').toggle();
	$('#routecod').removeAttr('disabled');
	$('#routehour').removeAttr('disabled');
	$('#busesroute').removeAttr('disabled');
	$('#startroute').removeAttr('disabled');
	$('#endroute').prop('disabled','true');
	window.alert("Route not added");	
});

socket.on('notaddedtoroute', function() {
	window.alert("Not added to route");	
});

socket.on('busnotdeleted', function() {
	$('#busplatecre').val('');
	$('#busplatemod').val('');
	window.alert("Bus not deleted");	
});

socket.on('routenotdeleted', function() {
	window.alert("Route not deleted");	
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
	times();
	$('#add_tool').toggle();
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
		$('#startroute').removeAttr('disabled');
		$('#endroute').prop('disabled','true');
		socket.emit('requestmanagebus');
	});
	$('#startroute').click(function() {
		var route = $('#routecod').val();
		var hour = $('#routehour').val();
		var bus = $('#busesroute').val();
		$('#routecod').removeAttr('disabled');
		$('#routehour').removeAttr('disabled');
		$('#busesroute').removeAttr('disabled');
		if(route === '' && hour === '') {
			$('#routecod').val('');
			$('#routehour').val('');
			window.alert('You must input route code and route hour to proceed');
		} else {
			$('#add_tool').toggle();
			$('#endroute').removeAttr('disabled');
			$('#startroute').prop('disabled','true');

			var route = $('#routecod').val();
			var busid = $('#busesroute').val();
			var hour = $('#routehour').val();

			BUSID = busid;
			
			$('#routecod').prop('disabled','true');
			$('#routehour').prop('disabled','true');
			$('#busesroute').prop('disabled','true');
			socket.emit('requestmanageroute', route, hour, busid);
		}
	});
	$('#addtoroute').click(function() {
		var route = $('#routecod').val();
		var busid = $('#busroute').val();
		var rhour = $('#routehour').val();
		var city = $('#city').val();
		var type = $('#citytype').val();
		var chour = $('#cityhour').val();
		var val = $('#routeval').val();
		var json = {'route':route, 'busid':BUSID, 'routehour':rhour,
			    'city':city, 'type':type, 'cityhour':chour, 'value':val};
		socket.emit('addtoroute', json);
		console.log(json.busid);
	});
	$('#cancelroute').click(function() {
		$('#routeval').val('');
	});
	$('#delroute').click(function() {
		var route = $('#routedel').val();
		var vals = route.split('/');
		console.log(vals[0] + ' - ' + vals[1]);
		socket.emit('delroute', vals[0], vals[1]);
	});
	$('#endroute').click(function() {
		$('#add_tool').toggle();
		$('#routecod').val('');
		$('#routehour').val('');
		$('#routecod').removeAttr('disabled');
		$('#routehour').removeAttr('disabled');
		$('#busesroute').removeAttr('disabled');
		$('#startroute').removeAttr('disabled');
		$('#endroute').prop('disabled','true');
	});
};

$(document).ready(main);
