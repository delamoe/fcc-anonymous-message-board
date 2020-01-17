/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var ObjectId = require('mongodb').ObjectId;

chai.use(chaiHttp);

suite('Functional Tests', function () {

  var message = "the body should have a property";
  var notMessage = "the body should not have a property";

  suite('API ROUTING FOR /api/threads/:board', function () {

    suite('POST', function () {
      test('post-test', function (done) {
        this.timeout(15000);
        chai.request(server)
          .post('/api/threads/post-test/')
          .query({ test: true })
          .send({
            text: '/api/threads/post-test/',
            delete_password: 'test-delete_password'
          })
          .end(function (err, postRes) {
            assert.equal(postRes.status, 200);
            assert.isArray(postRes.redirects);
            assert.equal(postRes.redirects[0].slice(-'/b/post-test/'.length), '/b/post-test/');
            chai.request(server)
              .get('/api/threads/post-test/')
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                // console.log("getRes.body[0] ", getRes.body[0]);
                assert.isArray(getRes.body, 'the body should be an array');
                assert.property(getRes.body[0], "_id", message + " '_id'");
                assert.property(getRes.body[0], "board", message + " 'board'");
                assert.property(getRes.body[0], "text", message + " 'text'");
                assert.property(getRes.body[0], "created_on", message + " 'created_on'");
                assert.property(getRes.body[0], "bumped_on", message + " 'bumped_on'");
                assert.property(getRes.body[0], "replies", message + " 'replies'");
                assert.property(getRes.body[0], "replycount", message + " 'replycount'");
                assert.notProperty(getRes.body[0], "reported", notMessage + " 'reported'");
                assert.notProperty(getRes.body[0], "delete_password", notMessage + " 'delete_password'");
                chai.request(server)
                  .delete('/api/threads/post-test/')
                  .query({ test: true })
                  .send({
                    thread_id: getRes.body[0]._id,
                    delete_password: 'test-delete_password'
                  })
                  .end(function (err, deleteRes) {
                    assert.equal(deleteRes.status, 200);
                    assert.equal(deleteRes.text, 'success', "thread should delete successfully");
                  });
              });
          });
        done();
      });
    });

    suite('GET', function () {
      test('get-test', function (done) {
        this.timeout(15000);
        chai.request(server)
          .post('/api/threads/get-test/')
          .query({ test: true })
          .send({
            text: '/api/threads/get-test/',
            delete_password: 'test-delete_password'
          })
          .end(function (err, postRes) {
            chai.request(server)
              .get('/api/threads/get-test/')
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                // console.log("getRes.body[0] ", getRes.body[0]);
                assert.isArray(getRes.body, 'the body should be an array');
                assert.property(getRes.body[0], "_id", message + " '_id'");
                assert.property(getRes.body[0], "board", message + " 'board'");
                assert.property(getRes.body[0], "text", message + " 'text'");
                assert.property(getRes.body[0], "created_on", message + " 'created_on'");
                assert.property(getRes.body[0], "bumped_on", message + " 'bumped_on'");
                assert.property(getRes.body[0], "replies", message + " 'replies'");
                assert.property(getRes.body[0], "replycount", message + " 'replycount'");
                assert.notProperty(getRes.body[0], "reported", notMessage + " 'reported'");
                assert.notProperty(getRes.body[0], "delete_password", notMessage + " 'delete_password'");
                chai.request(server)
                  .delete('/api/threads/get-test/')
                  .query({ test: true })
                  .send({
                    thread_id: getRes.body[0]._id,
                    delete_password: 'test-delete_password'
                  })
                  .end(function (err, deleteRes) {
                    assert.equal(deleteRes.status, 200);
                    assert.equal(deleteRes.text, 'success', "thread should delete successfully");
                  });
              });
          });
        done();
      });
    });

    suite('DELETE', function () {
      test('delete-test', function (done) {
        this.timeout(15000);
        chai.request(server)
          .post('/api/threads/delete-test/')
          .query({ test: true })
          .send({
            text: '/api/threads/delete-test/',
            delete_password: 'test-delete_password'
          })
          .end(function (err, postRes) {
            chai.request(server)
              .get('/api/threads/delete-test/')
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                chai.request(server)
                  .delete('/api/threads/delete-test/')
                  .query({ test: true })
                  .send({
                    thread_id: getRes.body[0]._id,
                    delete_password: 'test-delete_password'
                  })
                  .end(function (err, deleteRes) {
                    assert.equal(deleteRes.status, 200);
                    assert.equal(deleteRes.text, 'success', "thread should delete successfully");
                    chai.request(server)
                      .get('/api/threads/delete-test/')
                      .query({ test: true })
                      .end(function (err, getResAfter) {
                        assert.equal(getResAfter.status, 200);
                        // console.log("getResAfter.body[0] ", getResAfter.body[0]);
                        assert.isArray(getResAfter.body, 'the body should be an array');
                        assert.isUndefined(getResAfter.body[0], "body array should be empty");
                      });
                  });
              });
          });
        done();
      });

      test('delete-test-wrong password', function (done) {
        this.timeout(15000);
        chai.request(server)
          .post('/api/threads/delete-test-wrong password/')
          .query({ test: true })
          .send({
            text: '/api/threads/delete-test-wrong password/',
            delete_password: 'test-delete_password'
          })
          .end(function (err, postRes) {
            chai.request(server)
              .get('/api/threads/delete-test-wrong password/')
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                chai.request(server)
                  .delete('/api/threads/delete-test-wrong password/')
                  .query({ test: true })
                  .send({
                    thread_id: getRes.body[0]._id,
                    delete_password: 'wrong-delete_password'
                  })
                  .end(function (err, deleteRes) {
                    assert.equal(deleteRes.status, 200);
                    assert.equal(deleteRes.text, 'incorrect password', "thread should not delete successfully");
                    chai.request(server)
                      .delete('/api/threads/delete-test-wrong password/')
                      .query({ test: true })
                      .send({
                        thread_id: getRes.body[0]._id,
                        delete_password: 'test-delete_password'
                      })
                      .end(function (err, deleteRes) {
                        assert.equal(deleteRes.status, 200);
                        assert.equal(deleteRes.text, 'success', "thread should not delete successfully");
                      });
                  });
              });
          });
        done();
      });
    });

    suite('PUT', function () {
      test('put-test', function (done) {
        this.timeout(15000);
        chai.request(server)
          .post('/api/threads/put-test/')
          .query({ test: true })
          .send({
            text: '/api/threads/put-test/',
            delete_password: 'test-delete_password'
          })
          .end(function (err, postRes) {
            chai.request(server)
              .get('/api/threads/put-test/')
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                chai.request(server)
                  .put('/api/threads/put-test/')
                  .query({ test: true })
                  .send({ report_id: ObjectId(getRes.body[0]._id) })
                  .end(function (err, putRes) {
                    assert.equal(putRes.status, 200);
                    assert.equal(putRes.text, 'success');
                    chai.request(server)
                      .delete('/api/threads/put-test/')
                      .query({ test: true })
                      .send({
                        thread_id: ObjectId(getRes.body[0]._id),
                        delete_password: 'test-delete_password'
                      })
                      .end(function (err, deleteRes) {
                        assert.equal(deleteRes.status, 200);
                        assert.equal(deleteRes.text, 'success', "thread should delete successfully");
                      });
                  });
              });
          });
        done();
      });
    });


  });

  suite('API ROUTING FOR /api/replies/:board', function () {

    suite('POST', function () {

    });

    suite('GET', function () {

    });

    suite('PUT', function () {

    });

    suite('DELETE', function () {

    });

    /* suite('DELETE_ALL', function () {
      test('put-test', function (done) {
        this.timeout(15000);
        chai.request(server)
          .get('/api/threads/whatever/')
          .query({ test: true })
          .end(function (err, getRes) {
            getRes.body.forEach(thread => {
              chai.request(server)
                .delete('/api/threads/put-test/')
                .query({ test: true })
                .send({
                  thread_id: ObjectId(thread._id),
                  delete_password: 'test-delete_password'
                })
                .end(function (err, deleteRes) {
                  assert.equal(deleteRes.status, 200);
                  assert.equal(deleteRes.text, 'success', "thread should delete successfully");
                });
            });
          });
          done();
      });
    }); */
  });
});
