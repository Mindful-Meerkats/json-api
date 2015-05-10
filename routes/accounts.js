var Joi = require('joi');
var r = require('rethinkdb');
var node_env = process.env.NODE_ENV;

r.connect({
        host: 'localhost',
        port: 28015,
        db: node_env
    },
    function(err, conn) {
        if( err ) throw err;
        connection = conn;
    });

/// Acounts
module.exports = [
{
    method: 'GET',
    path: '/accounts',
    config: {
        validate: {},
        auth: 'token',
        tags: ['accounts', 'api', 'get'],
        description: 'Get all accounts'
    },
    handler: function( reaccount, reply ){
        r.table('accounts').run(connection, function(err, cursor) {
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
    path: '/accounts/{id}',
    config: {
        validate: {},
        auth: 'token',
        tags: ['accounts', 'api', 'get'],
        description: 'Get an account with reaccounted ID'
    },
    handler: function( reaccount, reply ){
        r.table('accounts').get( reaccount.params.id ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'POST',
    path: '/accounts',
    config: {
        validate: {
            payload: {                
                screen_name: Joi.string(),
                is_admin: Joi.boolean(),
                is_app:   Joi.boolean()                                
            }
        },
        auth: 'token',
        tags: ['accounts', 'api', 'post'],
        description: 'Create an account'
    },
    handler: function( reaccount, reply ){
        var account = reaccount.payload;
        r.table('accounts').insert( account ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'PUT',
    path: '/accounts/{id}',
    config: {
        validate: {
            payload: {                                
                screen_name: Joi.string(),
                is_admin: Joi.boolean(),
                is_app:   Joi.boolean()                                
            }
        },
        auth: 'token',
        tags: ['accounts', 'api', 'put'],
        description: 'Update an account'
    },
    handler: function( reaccount, reply ){
        var account = reaccount.payload;
        r.table('accounts').get( reaccount.params.id ).update( account ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'DELETE',
    path: '/accounts/{id}',
    config: {
        validate: {},
        auth: 'token',
        tags: ['accounts', 'api', 'delete'],
        description: 'Delete an account'
    },
    handler: function( reaccount, reply ){
        var account = reaccount.payload;
        r.table('accounts').get( reaccount.params.id ).delete().run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
}
];