var Hapi = require('hapi');
var r = require('rethinkdb');
var node_env = process.env.NODE_ENV;
var Joi = require('joi');
var routes = require('./routes');
var connection;

r.connect({ 
        host: 'localhost',
        port: 28015,
        db: node_env
    },
    function(err, conn) { 
        if( err ) throw err;
        connection = conn;
    });

var server = new Hapi.Server();
server.connection({ port: 1337, routes: { cors: true } });

server.route({
    method: 'GET',
    path: '/',
    config: {
        validate: {},
        tags: ['root', 'api', 'get'],
        description: 'Hey there, Welcome to the Mindful Meerkats API. This is the root of the API.'
    },    
    handler: function (request, reply) {
        reply({ "msg": "Hey there, Welcome to the Mindful Meerkats API.", "documentation": "/docs" });
    }
});

// All the other routes
server.route(routes);

server.register({ register: require('lout') }, function(err) {
    if( err ) console.log( err );
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});