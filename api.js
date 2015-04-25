var Hapi = require('hapi');
var r = require('rethinkdb');
var node_env = process.env.NODE_ENV;
var Joi = require('joi');
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
server.connection({ port: 1337 });

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

//////////// QUESTS

server.route({
    method: 'GET',
    path: '/quests',
    config: {
        validate: {},
        tags: ['quests', 'api', 'get'],
        description: 'Get all quests'
    },    
    handler: function( request, reply ){
        r.table('quests').run(connection, function(err, cursor) {
            if (err) reply( err );
            cursor.toArray(function(err, result) {
                if (err) reply( err );
                else reply( result );
            });
        });
    }
});

server.route({
    method: 'GET',
    path: '/quests/{id}',
    config: {
        validate: {},
        tags: ['quests', 'api', 'get'],
        description: 'Get a quest with requested ID'
    },    
    handler: function( request, reply ){
        r.table('quests').get( request.params.id ).run(connection, function( err, result ){
            reply( result );
        });
    }
});

server.route({
    method: 'POST',
    path: '/quests/',
    config: {
        validate: {
            payload: {
                title: Joi.string().min(5).max(40).required(),
                description: Joi.string().min(5).max(140).required(),
                completed_text: Joi.string().min(5).max(140).required()
            }
        },
        tags: ['quests', 'api', 'post'],
        description: 'Create a quest record'
    },
    handler: function( request, reply ){
        var quest = request.payload;
        r.table('quests').insert( quest ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }    
});

server.route({
    method: 'PUT',
    path: '/quests/{id}',
    config: {
        validate: {},
        tags: ['quests', 'api', 'put'],
        description: 'Update a quest record'
    },
    handler: function (request, reply) {
        reply({"id": request.params.id });
    }
});


server.register({ register: require('lout') }, function(err) {
    if( err ) console.log( err );
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});