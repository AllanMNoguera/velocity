var fs = require('fs');
var util = require('util');
var url = require('url');


function index(response) {
	var rs = fs.createReadStream('html/main.html');
	util.pump(rs, response);
}

function admin(response) {
	var rs = fs.createReadStream('html/admin.html');
	util.pump(rs, response);
}

function connect(response) {
	var rs = fs.createReadStream('html/js/connect.js');
	util.pump(rs, response);
}

function connectadmin(response) {
	var rs = fs.createReadStream('html/js/admin.js');
	util.pump(rs, response);
}

function maincss(response) {
	var rs = fs.createReadStream('html/css/main.css');
	util.pump(rs, response);
}

exports.index = index;
exports.admin = admin;
exports.connect = connect;
exports.connectadmin = connectadmin;
exports.maincss = maincss;
