// server.js
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const dbCfg = require('./config/dbCfg');
const app = express();


const port = process.env.PORT || 8000;

app.use(bodyParser.json());

MongoClient.connect(dbCfg.URL, (err, database) => {
  if (err) return console.log(err)
  require('./server/routes')(app, database);
  require('./server/botService')(database);
  
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
})