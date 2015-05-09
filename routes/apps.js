var Joi = require('joi');
var r = require('rethinkdb');
var node_env = process.env.NODE_ENV;
var config = require('../config.json');
var jwt = require('jsonwebtoken');
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

/// Apps
module.exports = [
{
    method: 'GET',
    path: '/apps',
    config: {
        validate: {},
        auth: 'token',
        tags: ['apps', 'api', 'get'],
        description: 'Get all apps'
    },
    handler: function( reapp, reply ){
        r.table('apps').run(connection, function(err, cursor) {
            if (err) reply( err );
            cursor.toArray(function(err, result) {
                if (err) reply( err );
                else reply( result );
            });
        });
    }
},
{
    method: 'GET',
    path: '/apps/{id}',
    config: {
        validate: {},
        auth: 'token',
        tags: ['apps', 'api', 'get'],
        description: 'Get an app with reapped ID'
    },
    handler: function( reapp, reply ){
        r.table('apps').get( reapp.params.id ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'POST',
    path: '/apps',
    config: {
        validate: {
            payload: {
                name: Joi.string().required(),
                description: Joi.string().min(5).max(200).required(),
                token: Joi.string()
            }
        },
        auth: 'token',
        tags: ['apps', 'api', 'post'],
        description: 'Create an app'
    },
    handler: function( reapp, reply ){
        var app = reapp.payload;
        r.table('apps').insert( app ).run(connection, function( err, result ){
            if( err ) {
                reply( err );
            }else {
                var token = jwt.sign({ appId: result.generated_keys[0] }, config.privateKey );
                r.table('apps').get( result.generated_keys[0] ).update( { token: token } ).run(connection, function( er, res ){
                    if( er ) {
                        reply( er );
                    } else {
                        reply( res );
                    }
                });
            }
        });
    }
},
{
    method: 'PUT',
    path: '/apps/{id}',
    config: {
        validate: {
            payload: {
                name: Joi.string(),
                description: Joi.string().min(5).max(200),
                token: Joi.string()
            }
        },
        auth: 'token',
        tags: ['apps', 'api', 'put'],
        description: 'Update an app'
    },
    handler: function( reapp, reply ){
        var app = reapp.payload;
        if( !app.token ) app.token = jwt.sign({ appId: app.id }, config.privateKey );
        r.table('apps').get( reapp.params.id ).update( app ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'DELETE',
    path: '/apps/{id}',
    config: {
        validate: {},
        auth: 'token',
        tags: ['apps', 'api', 'delete'],
        description: 'Delete an app'
    },
    handler: function( reapp, reply ){
        var app = reapp.payload;
        r.table('apps').get( reapp.params.id ).delete().run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
}
];