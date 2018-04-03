// routes/index.js
const staticRoutes = require('./static_routes');


module.exports = function(app, db) {
  staticRoutes(app, db);
};