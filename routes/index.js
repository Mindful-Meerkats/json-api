var quests = require('./quests');
var accounts = require('./accounts');
var meerkats = require('./meerkats');
var login = require('./login');
var apps = require('./apps.js');

module.exports = [].concat(quests, accounts, meerkats, login, apps);