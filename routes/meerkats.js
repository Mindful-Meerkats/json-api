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
    path: '/meerkats',
    config: {
        validate: {},
        tags: ['meerkats', 'api', 'get'],
        description: 'Get all meerkats'
    },    
    handler: function( request, reply ){
        r.table('meerkats').run(connection, function(err, cursor) {
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
    path: '/meerkats/{id}',
    config: {
        validate: {},
        tags: ['meerkats', 'api', 'get'],
        description: 'Get an meerkat with requested ID'
    },    
    handler: function( request, reply ){
        r.table('meerkats').get( request.params.id ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'POST',
    path: '/meerkats',
    config: {
        validate: {
            payload: {
                account_id:  Joi.string(),
                birthdate: "Wed Apr 07 1982 00:00:00 GMT+00:00" ,
                full_name:  "Ralf Nieuwenhuijsen" ,
                nick_name:  "Fladder" ,
                notifiers: {
                    email: "ralf@lietspiek.nl",
                    phone:  "3163123232"
                },
                skin : {
                    meerkat:  "default"
                },
                email: Joi.string().email().required(),
                password: Joi.string().min(5).max(200).required(),
                is_admin: Joi.boolean()
            }
        },
        tags: ['meerkats', 'api', 'post'],
        description: 'Create an meerkat'
    },
    handler: function( request, reply ){
        var quest = request.payload;
        r.table('meerkats').insert( quest ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }    
},
{
    method: 'PUT',
    path: '/meerkats/{id}',
    config: {
        validate: {
            payload: {
                email: Joi.string().email(),
                password: Joi.string().min(5).max(200),
                is_admin: Joi.boolean()
            }
        },
        tags: ['meerkats', 'api', 'put'],
        description: 'Update an meerkat'
    },
    handler: function( request, reply ){
        var quest = request.payload;
        r.table('meerkats').get( request.params.id ).update( quest ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }    
},
{
    method: 'DELETE',
    path: '/meerkats/{id}',
    config: {
        validate: {},
        tags: ['meerkats', 'api', 'delete'],
        description: 'Delete an meerkat'
    },
    handler: function( request, reply ){
        var quest = request.payload;
        r.table('meerkats').get( request.params.id ).delete().run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
}
];