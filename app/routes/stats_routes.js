// stats_routes.js
var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {

  app.get('/getAll', getAllController);

  function getAllController(req, res) {
    console.log(`stats_routes.js getAllController ${req.method} to ${req.originalUrl}`);
    const details = {};
    db.collection('messages').find(details, {}).toArray()
      .then((data) => {
        res.send(data);
      })
  }


  // function userDeleteController(req, res) {
  //   const user = req.params.user;
  //   console.log(user);
  //   const details = { 'user': user };
  //   db.collection('users').remove(details, (err, item) => {
  //     if (err) {
  //       res.send({ 'error': 'An error has occurred' });
  //     } else {
  //       res.send('User ' + user + ' deleted!');
  //     }
  //   });
  // };

  // function userPutController(req, res) {
  //   const user = req.params.user;
  //   const details = { 'user': user };
  //   const note = { text: req.body.body, title: req.body.title };
  //   db.collection('users').update(details, note, (err, result) => {
  //     if (err) {
  //       res.send({ 'error': 'An error has occurred' });
  //     } else {
  //       res.send(note);
  //     }
  //   });
  // };

  // function findSessionByToken(token) {
  //   return new Promise((resolve, reject) => {
  //     const details = { '_id': new ObjectID(token) };
  //     db.collection('sessions').findOne(details, (err, item) => {
  //       if (err) {
  //         reject({ 'error': 'An error has occurred' });
  //       } else {
  //         if (!item) {
  //           reject({ 'error': 'No session found' });
  //         }
  //         resolve(item);
  //       }
  //     })
  //   })
  // }

  // function findUserByUserName(userName) {
  //   return new Promise((resolve, reject) => {
  //     const details = { 'userName': userName };

  //     db.collection('users').findOne(details, (err, item) => {
  //       if (err) {
  //         reject({ 'error': 'An error has occurred' });
  //       } else {
  //         if (!item) {
  //           reject({ 'error': 'No user found' });
  //         }
  //         resolve(item);
  //       }
  //     })
  //   })
  // }
};
