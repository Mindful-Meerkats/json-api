var Hapi = require('hapi');
var r = require('rethinkdb');
var node_env = process.env.NODE_ENV;
var Joi = require('joi');
var routes = require('./routes');
var jwt = require('jsonwebtoken');
var config = require('./config.json');
var connection;

r.connect({
        host: 'localhost',
        port: 28015,
        db: node_env
    },
    function(err, conn) {
        if (err) throw err;
        connection = conn;
    });

var validate = function(decodedToken, callback) {
    var error;

    /*var credentials = r.table('apps').filter({ id: decodedToken.appId }).run( connection, function( err, result ){
        if( err ) return {};
        else return result;
    });*/

    return callback(error, true, decodedToken);

    //if (!credentials) return callback(error, false, credentials);
    //else return callback(error, true, credentials);
};

var new_insertion = function(request){
  r.table('meerkats').insert({
      "account_id": request.auth.credentials.account_id,
      "birthdate": null,
      "full_name": null,
      "nickname": request.auth.credentials.screen_name,
      "notifiers": {},
      "skin": {
          "meerkat": "default"
      },
      "quests": {
          awaiting: [],
          accepted: [],
          declined: [],
          done: []
      },
      "scores": {
          happiness: -1,
          fitness: -1,
          wellbeing: -1,
          pawprint: -1,
          community: -1,
          thriftness: -1,
          wisdom: -1
      }
  }, {
      returnChanges: true
  }).run(connection, function(err, result) {
      if (err) throw err;
      else return {
          "msg": "Hey there, Welcome to the Mindful Meerkats API.",
          "account": request.auth.credentials,
          "meerkat": result.changes[0].new_val,
          "documentation": "/docs"
      };
  });
};


var server = new Hapi.Server();
server.connection({
    port: 1337,
    routes: {
        cors: true
    }
});

server.register({
    register: require('hapi-alive'),
    options: {
        path: '/health', //Health route path
        tags: ['health', 'monitor'],
        healthCheck: function(server, callback) {
            //Here you should preform your health checks
            //If something went wrong provide the callback with an error
            callback();
        }
    }
}, function(err) {

    if (err) {
        console.log(err);
    }
});

server.register(require('hapi-auth-jwt'), function(error) {
    if (error) throw error;
    server.auth.strategy('token', 'jwt', {
        key: config.privateKey,
        validateFunc: validate
    });
});

server.register({
    register: require('lout')
}, function(err) {
    if (err) throw err;
});

server.route({
    method: 'GET',
    path: '/',
    config: {
        validate: {},
        //auth: 'token',
        tags: ['root', 'api', 'get'],
        description: 'Hey there, Welcome to the Mindful Meerkats API. This is the root of the API.'
    },
    handler: function(request, reply) {
        request.auth.credentials.account_id = "73fe649c-8ee9-488a-8f77-8d7702ca2cc2";
        r.table('meerkats').getAll(request.auth.credentials.account_id, {
            index: 'accounts'
        }).run(connection, function(err, cursor) {
            cursor.toArray(function(err, meerkats) {
                if (err) throw err;
                if (meerkats.length === 0) {
                    console.log('creating a new user/meerkat');
                    var ret  = new_insertion(request);
                    reply(ret);
                } else {
                    reply({
                        "msg": "Hey there, Welcome to the Mindful Meerkats API.",
                        "account": request.auth.credentials,
                        "meerkat": meerkats[0],
                        "documentation": "/docs"
                    });
                }
            });

        });

    }
});

// All the other routes
server.route(routes);

server.start(function() {
    console.log('Server running at:', server.info.uri);
});
