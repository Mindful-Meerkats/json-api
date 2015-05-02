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
    method: 'POST',
    path: '/login/twitter',
    config: {
        validate: {
            payload: {
                id: Joi.number().required(),
                accessToken: Joi.string(),
                accessTokenSecret: Joi.string()
            }
        },
        tags: ['accounts', 'api', 'post'],
        description: 'Login with a twitter id'
    },
    handler: function( reaccount, reply ){        
        r.table('accounts').filter({twitter: {id: reaccount.payload.id}}).limit(1).run(connection, function(err, cursor) {
            if (err) reply( err );
            cursor.toArray(function(err, result) {
                if( result.length === 0 ){                    
                    r.table('accounts').insert({twitter: reaccount.payload}).run(connection, function( err, result ){                        
                        if( err ) reply( err );
                        else reply( reaccount.payload );
                    });
                }            
                else reply( result );    
            });
        });        
    }
}
];
