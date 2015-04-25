var Hapi = require('hapi');
var r = require('rethinkdb');
r.connect({ 
        host: 'localhost',
        port: 28015,
        db: process.env.NODE_ENV
    },
    function(err, conn) { 
        if( err ) throw err;
    });

var server = new Hapi.Server();
server.connection({ port: 1337 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('I AM GROOT');
    },
    config: {
        validate: {},
        tags: ['root', 'api', 'get'],
        description: 'Root of the application'
    }
});

server.route({
    method: 'GET',
    path: '/quests/{id}',
    handler: function (request, reply) {
        reply({"id": request.params.id });
    },
    config: {
        validate: {},
        tags: ['quests', 'api', 'get'],
        description: 'Get a quest with requested ID'
    }
});


server.register({ register: require('lout') }, function(err) {
    if( err ) console.log( err );
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});