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

//////////// questions

module.exports = [
{
    method: 'GET',
    path: '/questions',
    config: {
        validate: {},
        auth: 'token',
        tags: ['questions', 'api', 'get'],
        description: 'Get all questions'
    },
    handler: function( requestion, reply ){
        r.table('questions').run(connection, function(err, cursor) {
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
    path: '/questions/{id}',
    config: {
        validate: {},
        tags: ['questions', 'api', 'get'],
        description: 'Get a question with requestioned ID'
    },
    handler: function( requestion, reply ){
        r.table('questions').get( requestion.params.id ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'POST',
    path: '/questions',
    config: {
        validate: {
            payload: {
                title: Joi.string().min(5).max(40).required(),
                description: Joi.string().min(5).max(140).required(),
                completed_text: Joi.string().min(5).max(140).required(),
                points: Joi.number().integer()
            }
        },
        tags: ['questions', 'api', 'post'],
        description: 'Create a question record'
    },
    handler: function( requestion, reply ){
        var question = requestion.payload;
        if( !question.type ) question.type = 'questions';
        r.table('quests').insert( question ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'PUT',
    path: '/questions/{id}',
    config: {
        validate: {
            payload: {
                title: Joi.string().min(5).max(40),
                description: Joi.string().min(5).max(140),
                completed_text: Joi.string().min(5).max(140),
                points: Joi.number().integer()
            }
        },
        tags: ['questions', 'api', 'put'],
        description: 'Update a question record'
    },
    handler: function( requestion, reply ){
        var question = requestion.payload;
        if( !question.type ) question.type = 'questions';
        r.table('quest').get( requestion.params.id ).update( question ).run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
},
{
    method: 'DELETE',
    path: '/questions/{id}',
    config: {
        validate: {},
        tags: ['questions', 'api', 'delete'],
        description: 'delete a question record'
    },
    handler: function( requestion, reply ){
        var question = requestion.payload;
        r.table('quest').get( requestion.params.id ).delete().run(connection, function( err, result ){
            if( err ) reply( err );
            else reply( result );
        });
    }
}
];