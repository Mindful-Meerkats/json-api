var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply){
        reply('I AM ROOT');
    }
});

server.route({
    method: 'GET',
    path: '/quest/:id',
    handler: function(request, reply){
        // reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
        reply( request.params.id );
    }
});

server.start(function(){
    console.log('Server running at:', server.info.uri);
});