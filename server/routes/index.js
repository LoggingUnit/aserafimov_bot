// routes/index.js
const staticRoutes = require('./static_routes');
const statsRoutes = require('./stats_routes');


module.exports = function(app, db) {
  staticRoutes(app, db);
  statsRoutes(app, db);
};