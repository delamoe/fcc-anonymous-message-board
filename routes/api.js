/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

const MONGODB_CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/threads/:board/')

    // I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
    .post(function (req, res) {
      // console.log('req.params: ', req.params);
      // console.log('req.query: ', req.query);
      // console.log('req.body: ', req.body);
      var created_on = new Date();
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var anonMessageBoard_db = process.env.NODE_ENV === 'test' ?
          db.db('test').collection('anonMessageBoard_db_TEST') :
          db.db('test').collection('anonMessageBoard_db');
        anonMessageBoard_db.insertOne(
          {
            // _id: id,
            board: req.params.board,
            text: req.body.text,
            created_on: created_on,
            bumped_on: created_on,
            reported: false,
            delete_password: req.body.delete_password,
            replies: []
          }
        ).then(data => {
          // console.log(data);
          res.redirect('/b/' + req.params.board + '/');
        });
        db.close();
      });
    })

    // I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.
    .get(function (req, res) {
      // console.log('req.params: ', req.params);
      // console.log('req.query: ', req.query);
      // console.log('req.body: ', req.body);
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var anonMessageBoard_db = process.env.NODE_ENV === 'test' ?
          db.db('test').collection('anonMessageBoard_db_TEST') :
          db.db('test').collection('anonMessageBoard_db');
        anonMessageBoard_db.find(
          { board: req.params.board }
        )
          .project({ reported: 0, delete_password: 0 })
          .sort({ bumped_on: -1 })
          .limit(10)
          .toArray().then(data => {
            var threads = data.map(thread => {
              return {
                _id: thread._id,
                board: thread.board,
                text: thread.text,
                created_on: thread.created_on,
                bumped_on: thread.bumped_on,
                replies: thread.replies.slice(0, 3),
                replycount: thread.replies.length
              };
            });
            // console.log(threads);
            res.json(threads);
          });
        db.close();
      });
    })

    // I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')
    .delete(function (req, res) {
      // console.log('req.params: ', req.params);
      // console.log('req.query: ', req.query);
      // console.log('req.body: ', req.body);
      console.log('req.params: ', req.params);
      console.log('req.body: ', req.body);
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var anonMessageBoard_db = process.env.NODE_ENV === 'test' ?
          db.db('test').collection('anonMessageBoard_db_TEST') :
          db.db('test').collection('anonMessageBoard_db');
        anonMessageBoard_db.deleteOne(
          {
            _id: ObjectId(req.body.thread_id),
            delete_password: req.body.delete_password
          })
          .then(data => {
            console.log(data.deletedCount);
            var message = data.deletedCount > 0 ? 'success' : 'incorrect password';
            res.send(message);
          });
        db.close();
      });
    })

    // I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. (Text response will be 'success')
    .put(function (req, res) {
      // console.log('req.params: ', req.params);
      // console.log('req.query: ', req.query);
      // console.log('req.body: ', req.body);
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var anonMessageBoard_db = process.env.NODE_ENV === 'test' ?
          db.db('test').collection('anonMessageBoard_db_TEST') :
          db.db('test').collection('anonMessageBoard_db');
        anonMessageBoard_db.updateOne(
          { _id: ObjectId(req.body.report_id) },
          { $set: { reported: true } }
        )
          .then(data => {
            // console.log(data.modifiedCount);
            var message = data.modifiedCount > 0 ? 'success' : 'error';
            res.send(message);
          });
        db.close();
      });
    });

  app.route('/api/replies/:board')

    // I can POST a reply to a thead on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
    .post(function (req, res) {
      // console.log('req.params: ', req.params);
      // console.log('req.query: ', req.query);
      // console.log('req.body: ', req.body);
      console.log('req.params: ', req.params);
      console.log('req.body: ', req.body);
      var bumped_on = new Date();
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var anonMessageBoard_db = process.env.NODE_ENV === 'test' ?
          db.db('test').collection('anonMessageBoard_db_TEST') :
          db.db('test').collection('anonMessageBoard_db');
        var reply = {
          _id: ObjectId(),
          text: req.body.text,
          created_on: bumped_on,
          delete_password: req.body.delete_password,
          reported: false
        };
        anonMessageBoard_db.updateOne(
          { _id: ObjectId(req.body.thread_id) },
          { $set: { bumped_on: bumped_on }, $push: { replies: reply } }
        ).then(data => {
          console.log(data.modifiedCount);
          res.redirect('/b/' + req.params.board + '/' + req.body.thread_id + '/');
        });
        db.close();
      });
    })

    // I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
    .get(function (req, res) {
      // console.log('req.params: ', req.params);
      // console.log('req.query: ', req.query);
      // console.log('req.body: ', req.body);
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var anonMessageBoard_db = process.env.NODE_ENV === 'test' ?
          db.db('test').collection('anonMessageBoard_db_TEST') :
          db.db('test').collection('anonMessageBoard_db');
        anonMessageBoard_db.findOne(
          { _id: ObjectId(req.query.thread_id) },
          {
            projection: {
              reported: 0,
              delete_password: 0,
              "replies.delete_password": 0,
              "replies.reported": 0
            }
          }
        )
          .then(data => {
            // console.log(data);
            res.json(data);
          });
        db.close();
      });
    })

    // I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')
    .delete(function (req, res) {
      console.log('req.params: ', req.params);
      console.log('req.query: ', req.query);
      console.log('req.body: ', req.body);
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var anonMessageBoard_db = process.env.NODE_ENV === 'test' ?
          db.db('test').collection('anonMessageBoard_db_TEST') :
          db.db('test').collection('anonMessageBoard_db');
        anonMessageBoard_db.updateOne(
          {
            _id: ObjectId(req.body.thread_id),
            "replies._id": ObjectId(req.body.reply_id)
          },
          { $set: { "replies.$.text": '[deleted]' } }
        )
          .then(data => {
            // console.log(data.modifiedCount);
            var message = data.modifiedCount > 0 ? 'success' : 'incorrect password';
            res.send(message);
          });
        db.close();
      });
    })

    // I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')
    .put(function (req, res) {
      // console.log('req.params: ', req.params);
      // console.log('req.query: ', req.query);
      // console.log('req.body: ', req.body);
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true }, function (err, db) {
        if (err) return console.error(err);
        var anonMessageBoard_db = process.env.NODE_ENV === 'test' ?
          db.db('test').collection('anonMessageBoard_db_TEST') :
          db.db('test').collection('anonMessageBoard_db');
        anonMessageBoard_db.updateOne(
          {
            _id: ObjectId(req.body.thread_id),
            "replies._id": ObjectId(req.body.reply_id)
          },
          { $set: { "replies.$.reported": true } }
        )
          .then(data => {
            console.log(data.modifiedCount);
            var message = data.modifiedCount > 0 ? 'success' : 'error';
            res.send(message);
          });
        db.close();
      });
    });

};
