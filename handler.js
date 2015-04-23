var fs = require('fs');
var util = require('util');
var url = require('url');


function index(response) {
	var rs = fs.createReadStream('html/main.html');
	util.pump(rs, response);
}

function connect(response) {
	var rs = fs.createReadStream('html/js/connect.js');
	util.pump(rs, response);
}

exports.index = index;
exports.connect = connect;
