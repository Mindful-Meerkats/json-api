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

//////////// QUESTS

module.exports = [
{
	method: 'GET',
	path: '/quests',
	config: {
		validate: {},
		auth: 'token',
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
},
{
	method: 'GET',
	path: '/quests/{id}',
	config: {
		validate: {},
		tags: ['quests', 'api', 'get'],
		description: 'Get a quest with requested ID'
	},
	handler: function( request, reply ){
		r.table('quests').get( request.params.id ).run(connection, function( err, result ){
			if( err ) reply( err );
			else reply( result );
		});
	}
},
{
	method: 'POST',
	path: '/quests',
	config: {
		validate: {
			payload: {
				title: Joi.string().min(5).max(40).required(),
				description: Joi.string().min(5).max(140).required(),
				completed_text: Joi.string().min(5).max(140).required(),
				points: {
					paw_print: §Joi.number().integer(),
					fitness: Joi.number().integer(),
					wellbeing: Joi.number().integer(),
					community: Joi.number().integer(),
					thriftiness: Joi.number().integer(),
					wisdom: Joi.number().integer()
				},
				penalty: {
					paw_print: Joi.number().integer(),
					fitness: Joi.number().integer(),
					wellbeing: Joi.number().integer(),
					community: Joi.number().integer(),
					thriftiness: Joi.number().integer(),
					wisdom: Joi.number().integer()
				}
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
},
{
	method: 'PUT',
	path: '/quests/{id}',
	config: {
		validate: {
			payload: {
				title: Joi.string().min(5).max(40),
				description: Joi.string().min(5).max(140),
				completed_text: Joi.string().min(5).max(140),
				points: {
					paw_print: Joi.number().integer(),
					fitness: Joi.number().integer(),
					wellbeing: Joi.number().integer(),
					community: Joi.number().integer(),
					thriftiness: Joi.number().integer(),
					wisdom: Joi.number().integer()
				},
				penalty: {
					paw_print: Joi.number().integer(),
					fitness: Joi.number().integer(),
					wellbeing: Joi.number().integer(),
					community: Joi.number().integer(),
					thriftiness: Joi.number().integer(),
					wisdom: Joi.number().integer()
				}
			}
		},
		tags: ['quests', 'api', 'put'],
		description: 'Update a quest record'
	},
	handler: function( request, reply ){
		var quest = request.payload;
		r.table('quests').get( request.params.id ).update( quest ).run(connection, function( err, result ){
			if( err ) reply( err );
			else reply( result );
		});
	}
},
{
	method: 'DELETE',
	path: '/quests/{id}',
	config: {
		validate: {},
		tags: ['quests', 'api', 'delete'],
		description: 'delete a quest record'
	},
	handler: function( request, reply ){
		var quest = request.payload;
		r.table('quests').get( request.params.id ).delete().run(connection, function( err, result ){
			if( err ) reply( err );
			else reply( result );
		});
	}
}
];