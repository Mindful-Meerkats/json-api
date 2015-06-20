var Joi = require('joi');
var r = require('rethinkdb');
var node_env = process.env.NODE_ENV;
var moment = require('moment');
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

/// Meerkats
module.exports = [
{
	method: 'GET',
	path: '/meerkats',
	config: {
		validate: {},
		auth: 'token',
		tags: ['meerkats', 'api', 'get'],
		description: 'Get all meerkats'
	},
	handler: function( remeerkat, reply ){
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
		auth: 'token',
		tags: ['meerkats', 'api', 'get'],
		description: 'Get an meerkat with remeerkated ID'
	},
	handler: function( remeerkat, reply ){
		r.table('meerkats').get( remeerkat.params.id ).run(connection, function( err, result ){
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
				account_id:  Joi.string().required(),
				birthdate: Joi.string().allow( null ),
				full_name:  Joi.string().min(5).max(50),
				nickname:  Joi.string().min(5).max(20).required(),
				notifiers: {
					email: Joi.string().email(),
					phone:  Joi.string()
				},
				quests: {
				    awaiting: Joi.array().items( Joi.any() ),
				    done: Joi.array().items( Joi.any() ),
				    accepted: Joi.array().items( Joi.any() ),
				    declined: Joi.array().items( Joi.any() )
				},
				scores: {
				    happiness: Joi.number().integer(),
				    fitness: Joi.number().integer(),
				    wellbeing: Joi.number().integer(),
				    community: Joi.number().integer(),
				    thriftness: Joi.number().integer(),
				    wisdom: Joi.number().integer(),
				    pawprint: Joi.number().integer()
				},
				skin : {
					meerkat:  Joi.string().required()
				}
			}
		},
		auth: 'token',
		tags: ['meerkats', 'api', 'post'],
		description: 'Create an meerkat'
	},
	handler: function( remeerkat, reply ){
		var meerkat = remeerkat.payload;
		r.table('meerkats').insert( meerkat ).run(connection, function( err, result ){
			if( err ) reply( err );
			else reply( result );
		});
	}
},
{
	method: 'PATCH',
	path: '/meerkats/{id}',
	config: {
		validate: {
			payload: {
				account_id:  Joi.string(),
				id: Joi.string(),
				birthdate: Joi.string().allow( null ),
				full_name:  Joi.string().min(5).max(50),
				nickname:  Joi.string().min(5).max(20),
				notifiers: {
					email: Joi.string().email(),
					phone:  Joi.string()
				},
				quests: {
				    awaiting: Joi.array().items( Joi.any() ),
				    done: Joi.array().items( Joi.any() ),
				    accepted: Joi.array().items( Joi.any() ),
				    declined: Joi.array().items( Joi.any() )
				},
				scores: {
					happiness: Joi.number().integer(),
				    fitness: Joi.number().integer(),
				    wellbeing: Joi.number().integer(),
				    community: Joi.number().integer(),
				    thriftness: Joi.number().integer(),
				    wisdom: Joi.number().integer(),
				    pawprint: Joi.number().integer()
				},
				skin : {
					meerkat:  Joi.string()
				}
			}
		},
		auth: 'token',
		tags: ['meerkats', 'api', 'put'],
		description: 'Update an meerkat'
	},
	handler: function( remeerkat, reply ){
		var meerkat = remeerkat.payload;

		r.table('meerkats').get( remeerkat.params.id ).update( meerkat ).run(connection, function( err, result ){
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
				account_id:  Joi.string(),
				id: Joi.string(),
				birthdate: Joi.string().allow( null ),
				full_name:  Joi.string().min(5).max(50),
				nickname:  Joi.string().min(5).max(20),
				notifiers: {
					email: Joi.string().email(),
					phone:  Joi.string()
				},
				quests: {
				    awaiting: Joi.array().items( Joi.any() ),
				    done: Joi.array().items( Joi.any() ),
				    accepted: Joi.array().items( Joi.any() ),
				    declined: Joi.array().items( Joi.any() )
				},
				scores: {
					happiness: Joi.number().integer(),
				    fitness: Joi.number().integer(),
				    wellbeing: Joi.number().integer(),
				    community: Joi.number().integer(),
				    thriftness: Joi.number().integer(),
				    wisdom: Joi.number().integer(),
				    pawprint: Joi.number().integer()
				},
				skin : {
					meerkat:  Joi.string()
				}
			}
		},
		auth: 'token',
		tags: ['meerkats', 'api', 'put'],
		description: 'Update an meerkat' 
	},
	handler: function( remeerkat, reply ){
		var meerkat = remeerkat.payload;
		r.table('meerkats').get( remeerkat.params.id ).replace( meerkat ).run(connection, function( err, result ){
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
		auth: 'token',
		tags: ['meerkats', 'api', 'delete'],
		description: 'Delete an meerkat'
	},
	handler: function( remeerkat, reply ){
		var meerkat = remeerkat.payload;
		r.table('meerkats').get( remeerkat.params.id ).delete().run(connection, function( err, result ){
			if( err ) reply( err );
			else reply( result );
		});
	}
}
];