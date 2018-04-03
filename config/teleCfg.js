module.exports = {
  BOT_API_KEY: process.env.BOT_API_KEY,
  BOT_ENDPOINT: 'https://api.telegram.org/bot',

  requestOptions: {
    timeout: 600, //sec per request
    limit: 1,
  }

};