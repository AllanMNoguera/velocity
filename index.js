var server = require('./server');
var router = require('./router');
var handler = require('./handler');

var handle = {}
handle['/'] = handler.index
handle['/admin'] = handler.admin
handle['/html/js/connect.js'] = handler.connect
handle['/html/js/admin.js'] = handler.connectadmin
handle['/html/css/main.css'] = handler.maincss

server.iniciar(router.route, handle);
