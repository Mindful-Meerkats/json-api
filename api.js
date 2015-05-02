var Hapi = require('hapi');
var r = require('rethinkdb');
var node_env = process.env.NODE_ENV;
var Joi = require('joi');
var routes = require('./routes');
var jwt = require('jsonwebtoken');
var connection;

var accounts = {
    123: {
        id: 123,
        user: 'john',
        fullName: 'John Doe',
        scope: ['a', 'b']
    }
};

var privateKey = 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc';

// Use this token to build your request with the 'Authorization' header.
// Ex:
//     Authorization: Bearer <token>
var token = jwt.sign({ accountId: 123 }, privateKey);
console.log('Use this as a Bearer token: ' + token );

var validate = function (decodedToken, callback) {

    var error,
        credentials = accounts[decodedToken.accountId] || {};

    if (!credentials) {
        return callback(error, false, credentials);
    }

    return callback(error, true, credentials)
};

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

server.register(require('hapi-auth-jwt'), function(error) {
    if( error ) throw error;
    server.auth.strategy('token', 'jwt', {
        key: privateKey,
        validateFunc: validate
    });
});

server.register({ register: require('lout') }, function(err) {
    if( err ) throw err;
});

server.route({
    method: 'GET',
    path: '/',
    config: {
        validate: {},
        auth: 'token',
        tags: ['root', 'api', 'get'],
        description: 'Hey there, Welcome to the Mindful Meerkats API. This is the root of the API.'
    },
    handler: function (request, reply) {
        reply({ "msg": "Hey there, Welcome to the Mindful Meerkats API.", "documentation": "/docs" });
    }
});

// All the other routes
server.route(routes);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});