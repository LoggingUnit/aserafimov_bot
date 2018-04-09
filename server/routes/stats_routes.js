/**
 * stats_routes.js
 * Serves statistics request routing 
 */

var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {

  app.get('/getRequestsByInterval/:interval', getRequestsByIntervalController);
  app.get('/getRequestsPopular', getRequestsPopularController);

  /**
   * Controller to work with GET requests by "/getRequestsByInterval/" url
   * Receives cut-off parameter "interval" from client side as part of request url
   * Makes requests to db with interval as cut-off after interval transformed into Unix time
   * to get messages what received only within interval selected by user
   * Responses with messages received by db within cut-off interval, if interval undefined 
   * all messages will be sent to client
   */
  function getRequestsByIntervalController(req, res) {
    console.log(`stats_routes.js getRequestsByInterval ${req.method} to ${req.originalUrl}`);
    const details = {
      $query: {
        date: { $gt: calculateCutOffUnixTime(req.params.interval) }
      },
    }
    db.collection('messages').find(details).sort({ date: -1 }).toArray()
      .then((data) => {
        res.send(data);
      })
  }

  /**
   * Method to calculate cut-off date in Unix time format according to received interval
   * In case of 'undefined' interval returns 0 as cut-off date
   * @param {string} interval number of days since now to include to into cut-off interval
   * @return {number} cut-off date in Unix time format
   */
  function calculateCutOffUnixTime(interval) {
    if (interval === 'undefined') {
      return 0;
    } else {
      //Get current time in milliseconds and transform it into seconds
      let currentTime = Date.now() / 1000;
      //24 - hours per day, 3600 - seconds per hour
      return currentTime - (interval * 24 * 3600)
    }
  }

  /**
   * Controller to work with GET requests by "/getRequestsPopular" url
   * Makes requests to db to group messages by text field, calculate total count for each field
   * and sort by descending order
   * Responses to client with array of objects consisted of value of text field and count 
   * of messages with such value sorted descendingly as soon as response from db received
   */
  function getRequestsPopularController(req, res) {
    console.log(`stats_routes.js getRequestsPopularController ${req.method} to ${req.originalUrl}`);
    const pipeline = [{
      "$group": {
        "_id": {
          "text": "$text"
        },
        "count": {
          "$sum": 1
        }
      }
    }, {
      "$sort": { "count": -1 }
    }];
    db.collection('messages').aggregate(pipeline).toArray()
      .then((data) => {
        res.send(data);
      })
  }
};
