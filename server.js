var Hapi = require('hapi');
var r = require('rethinkdb');

var server = new Hapi.Server();
server.connection({ port: 1337 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('I AM GROOT');
    }
});

server.route({
    method: 'GET',
    path: '/quests/{id}',
    handler: function (request, reply) {
        reply({"id": request.params.id });
    }
});


server.register({ register: require('lout') }, function(err) {
    console.log( err );
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});