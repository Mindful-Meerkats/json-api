var Joi = require('joi');
var r = require('rethinkdb');
var node_env = process.env.NODE_ENV;
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

//////////// quizes

module.exports = [
{
    method: 'GET',
    path: '/quizes',
    config: {
        validate: {},
        auth: 'token',
        tags: ['quizes', 'api', 'get'],
        description: 'Get all quizes'
    },
    handler: function( requiz, reply ){
        r.table('quests').filter({type: "quiz"}).run(connection, function(err, cursor) {
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
    path: '/quizes/{id}',
    config: {
        validate: {},
        tags: ['quizes', 'api', 'get'],
        description: 'Get a quiz with requized ID'
    },
    handler: function( requiz, reply ){
        r.table('quests').get( requiz.params.id ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'POST',
    path: '/quizes',
    config: {
        validate: {
            payload: {
                title: Joi.string().min(5).max(40).required(),
                description: Joi.string().min(5).max(140).required(),
                // questions: [],
                completed_text: Joi.string().min(5).max(140).required(),
                points: Joi.number().integer()
            }
        },
        tags: ['quizes', 'api', 'post'],
        description: 'Create a quiz record'
    },
    handler: function( requiz, reply ){
        var quiz = requiz.payload;
        quiz.type = "quiz";
        r.table('quests').insert( quiz ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'PUT',
    path: '/quizes/{id}',
    config: {
        validate: {
            payload: {
                title: Joi.string().min(5).max(40),
                description: Joi.string().min(5).max(140),
                completed_text: Joi.string().min(5).max(140),
                points: Joi.number().integer()
            }
        },
        tags: ['quizes', 'api', 'put'],
        description: 'Update a quiz record'
    },
    handler: function( requiz, reply ){
        var quiz = requiz.payload;
        r.table('quizes').get( requiz.params.id ).update( quiz ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'DELETE',
    path: '/quizes/{id}',
    config: {
        validate: {},
        tags: ['quizes', 'api', 'delete'],
        description: 'delete a quiz record'
    },
    handler: function( requiz, reply ){
        var quiz = requiz.payload;
        r.table('quizes').get( requiz.params.id ).delete().run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
}
];