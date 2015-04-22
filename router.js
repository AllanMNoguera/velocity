var fs = require('fs');
var querystring = require('querystring');


function route(pathname, query, handle, response) {
	if(typeof handle[pathname] === 'function') {
		handle[pathname](response);
	} else {
		response.write("Error 404");
		response.end();
	}
}

exports.route = route;
