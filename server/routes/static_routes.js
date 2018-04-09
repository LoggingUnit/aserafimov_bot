/**
 * static_routes.js
 * Serves static request routing 
 */

const express = require('express');

module.exports = function (app, db) {

  app.use(express.static('client/build'));

};
