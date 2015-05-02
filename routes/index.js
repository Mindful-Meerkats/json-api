var quests = require('./quests');
var accounts = require('./accounts');
var meerkats = require('./meerkats');
var login = require('./login');

module.exports = [].concat(quests, accounts, meerkats, login);