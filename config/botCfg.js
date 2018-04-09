/**
 * botCfg.js
 * Contains bot related parameters
 * BOT_API_KEY and WEATHER_API_KEY stored as enviroment variables
 */

module.exports = {
  BOT_API_KEY: process.env.BOT_API_KEY,
  BOT_ENDPOINT: 'https://api.telegram.org/bot',

  WEATHER_ENDPOINT: 'https://api.openweathermap.org/data/2.5/find?q=',
  
  requestOptionsTelegram: {
    timeout: 600, //sec per request until obsolate
    limit: 1, //only one request per update object
    allowed_updates: 'message' 
  },

  requestOptionsWeather: {
    appid: process.env.WEATHER_API_KEY,
    units: 'metric',
    mode: 'json'
  }

};