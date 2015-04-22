var server = require('./server');
var router = require('./router');
var handler = require('./handler');

var handle = {}
handle['/'] = handler.index;

server.iniciar(router.route, handle);
