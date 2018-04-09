/**
 * dbCfg.js
 * Contains mongo db address
 * BOT_DB_USERNAME and BOT_DB_PASSWORD stored as enviroment variables
 */
module.exports = {
    URL : `mongodb://${process.env.BOT_DB_USERNAME}:${process.env.BOT_DB_PASSWORD}@ds231549.mlab.com:31549/aserafimov_bot_db`
  };