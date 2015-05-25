var quests = require('./quests');
var quizes = require('./quizes');
var questions = require('./questions');
var accounts = require('./accounts');
var meerkats = require('./meerkats');
var login = require('./login.js');
var apps = require('./apps.js');

module.exports = [].concat(quests, accounts, meerkats, login, apps, quizes);