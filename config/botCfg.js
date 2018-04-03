module.exports = {
  BOT_API_KEY: process.env.BOT_API_KEY,
  BOT_ENDPOINT: 'https://api.telegram.org/bot',

  WEATHER_ENDPOINT: 'https://api.openweathermap.org/data/2.5/find?q=',
  
  requestOptionsTelegram: {
    timeout: 600, //sec per request
    limit: 1,
    allowed_updates: 'message'
  },

  requestOptionsWeather: {
    appid: process.env.WEATHER_API_KEY,
    units: 'metric',
    mode: 'json'
  }

};