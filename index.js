var server = require('./server');
var router = require('./router');
var handler = require('./handler');

var handle = {}
handle['/'] = handler.index;
handle['/html/js/connect.js'] = handler.connect

server.iniciar(router.route, handle);
