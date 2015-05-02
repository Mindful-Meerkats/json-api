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
    path: '/login',
    config: {
        validate: {
            payload: {
                email: Joi.string(),
                twitter_id: Joi.number(),
                key: Joi.string().required()
            }
        },
        tags: ['accounts', 'api', 'post'],
        description: 'Login with a twitter id'
    },
    handler: function( reaccount, reply ){        
        r.table('accounts').filter({auth: reaccount.payload }).limit(1).run(connection, function(err, cursor) {
            if (err) reply( err );
            cursor.toArray(function(err, result) {
                if( result.length === 0 ){                    
                    r.table('accounts').insert({auth: reaccount.payload}).run(connection, function( err, result ){                        
                        if( err ) reply( err );
                        else reply( { id: result.generated_keys[0] } );
                    });
                }            
                else reply( { id: result[0].id } );    
            });
        });        
    }
}
];
