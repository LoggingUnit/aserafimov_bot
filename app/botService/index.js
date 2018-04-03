// botService/index.js
const botService = require('./bot_service');


module.exports = function(database) {
  botService(database);
};