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
  var delete_password = "deleteMe"

  suite('API ROUTING FOR /api/threads/:board', function () {

    suite('POST', function () {

      test('post-thread-test', function (done) {
        // this.timeout(15000);
        var boardName = 'post-thread-test';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            assert.equal(postRes.status, 200);
            assert.isArray(postRes.redirects);
            assert.equal(postRes.redirects[0].slice(-`/b/${boardName}/`.length), `/b/${boardName}/`);
            chai.request(server)
              .get(`/api/threads/${boardName}/`)
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                // console.log("getRes.body[0] ", getRes.body[0]);
                assert.isArray(getRes.body, 'the body should be an array');
                assert.equal(getRes.body[0].text, text, `the text should be '${text}'`);
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
                  .delete(`/api/threads/${boardName}/`)
                  .query({ test: true })
                  .send({
                    thread_id: _id,
                    delete_password: delete_password
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

      test('get-thread-thread', function (done) {
        // this.timeout(15000);
        var boardName = 'get-thread-test';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            chai.request(server)
              .get(`/api/threads/${boardName}/`)
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                // console.log("getRes.body[0] ", getRes.body[0]);
                assert.isArray(getRes.body, 'the body should be an array');
                assert.equal(getRes.body[0].text, text, `the text should be '${text}'`);
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
                  .delete(`/api/threads/${boardName}/`)
                  .query({ test: true })
                  .send({
                    thread_id: _id,
                    delete_password: delete_password
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
      test('delete-thread-test', function (done) {
        // this.timeout(15000);
        var boardName = 'delete-thread-test';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            chai.request(server)
              .get(`/api/threads/${boardName}/`)
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                assert.equal(getRes.body[0].text, text, `the text should be '${text}'`);
                chai.request(server)
                  .delete(`/api/threads/${boardName}/`)
                  .query({ test: true })
                  .send({
                    thread_id: _id,
                    delete_password: delete_password
                  })
                  .end(function (err, deleteRes) {
                    assert.equal(deleteRes.status, 200);
                    assert.equal(deleteRes.text, 'success', "thread should delete successfully");
                    chai.request(server)
                      .get(`/api/threads/${boardName}/`)
                      .query({ test: true })
                      .end(function (err, getResAfter) {
                        assert.equal(getResAfter.status, 200);
                        // console.log("getResAfter.body[0] ", getResAfter.body[0]);
                        assert.isArray(getResAfter.body, 'the body should be an array');
                        // assert.isUndefined(getResAfter.body[0], "body array should be empty");
                      });
                  });
              });
          });
        done();
      });

      test('delete-thread-test-wrong password', function (done) {
        // this.timeout(15000);
        var boardName = 'delete-thread-test-wrong password';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            chai.request(server)
              .get(`/api/threads/${boardName}/`)
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                chai.request(server)
                  .delete(`/api/threads/${boardName}/`)
                  .query({ test: true })
                  .send({
                    thread_id: _id,
                    delete_password: 'wrong-delete_password'
                  })
                  .end(function (err, deleteRes) {
                    assert.equal(deleteRes.status, 200);
                    assert.equal(deleteRes.text, 'incorrect password', "thread should not delete successfully");
                    chai.request(server)
                      .delete(`/api/threads/${boardName}/`)
                      .query({ test: true })
                      .send({
                        thread_id: _id,
                        delete_password: delete_password
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
      test('put-thread-report-test', function (done) {
        // this.timeout(15000);
        var boardName = 'put-thread-report-test';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            chai.request(server)
              .get(`/api/threads/${boardName}/`)
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                chai.request(server)
                  .put(`/api/threads/${boardName}/`)
                  .query({ test: true })
                  .send({ report_id: ObjectId(_id) })
                  .end(function (err, putRes) {
                    assert.equal(putRes.status, 200);
                    assert.equal(putRes.text, 'success');
                    chai.request(server)
                      .delete(`/api/threads/${boardName}/`)
                      .query({ test: true })
                      .send({
                        thread_id: _id,
                        delete_password: delete_password
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

      test('post-reply-test', function (done) {
        // this.timeout(15000);
        var boardName = 'post-reply-test';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: "thread for " + text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            assert.equal(postRes.status, 200);
            assert.isArray(postRes.redirects);
            assert.equal(postRes.redirects[0].slice(-`/b/${boardName}/`.length), `/b/${boardName}/`);
            chai.request(server)
              .get(`/api/threads/${boardName}/`)
              .query({ test: true })
              .end(function (err, getRes) {
                assert.equal(getRes.status, 200);
                // console.log("getRes.body[0] ", getRes.body[0]);
                assert.isArray(getRes.body, 'the body should be an array');
                assert.equal(getRes.body[0].text, "thread for " + text, `the text should be '${"thread for " + text}'`);
                chai.request(server)
                  .post(`/api/replies/${_id}`)
                  .query({ test: true })
                  .send({
                    thread_id: _id,
                    text: text,
                    delete_password: delete_password
                  })
                  .end(function (err, postReplyRes) {
                    assert.equal(postReplyRes.status, 200);
                    chai.request(server)
                      .get(`/api/threads/${boardName}/`)
                      .query({ test: true })
                      .end(function (err, getReplyRes) {
                        assert.equal(getReplyRes.status, 200);
                        // console.log("getReplyRes.body ", getReplyRes.body);
                        assert.property(getReplyRes.body[0], "replies", message + " 'replies'");
                        assert.equal(getReplyRes.body[0].replies[0].text, text, boardName + " reply text should equal " + text);
                        chai.request(server)
                          .delete(`/api/threads/${boardName}/`)
                          .query({ test: true })
                          .send({
                            thread_id: _id,
                            delete_password: delete_password
                          })
                          .end(function (err, deleteRes) {
                            assert.equal(deleteRes.status, 200);
                            assert.equal(deleteRes.text, 'success', "thread should delete successfully");
                          });
                      });
                  });
              });
          });
        done();
      });

    });

    suite('GET', function () {

      test('get-replies-test', function (done) {
        // this.timeout(15000);
        var boardName = 'get-replies-test';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: "thread for " + text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            assert.equal(postRes.status, 200);
            assert.isArray(postRes.redirects);
            assert.equal(postRes.redirects[0].slice(-`/b/${boardName}/`.length), `/b/${boardName}/`);
            chai.request(server)
              .post(`/api/replies/${_id}`)
              .query({ test: true })
              .send({
                thread_id: _id,
                text: text,
                delete_password: delete_password
              })
              .end(function (err, postReplyRes) {
                assert.equal(postReplyRes.status, 200);
                chai.request(server)
                  .get(`/api/threads/${boardName}/`)
                  .query({ test: true, thread_id: _id })
                  .end(function (err, getReplyRes) {
                    assert.equal(getReplyRes.status, 200);
                    // console.log("getReplyRes.body ", getReplyRes.body);
                    assert.property(getReplyRes.body[0], "replies", message + " 'replies'");
                    assert.equal(getReplyRes.body[0].replies[0].text, text, boardName + " reply text should equal " + text);
                    chai.request(server)
                      .delete(`/api/threads/${boardName}/`)
                      .query({ test: true })
                      .send({
                        thread_id: _id,
                        delete_password: delete_password
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

    suite('PUT', function () {

      test('get-replies-test', function (done) {
        // this.timeout(15000);
        var boardName = 'get-replies-test';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        var reply_id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: "thread for " + text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            assert.equal(postRes.status, 200);
            assert.isArray(postRes.redirects);
            assert.equal(postRes.redirects[0].slice(-`/b/${boardName}/`.length), `/b/${boardName}/`);
            chai.request(server)
              .post(`/api/replies/${boardName}`)
              .query({ test: true })
              .send({
                thread_id: _id,
                reply_id: reply_id,
                text: text,
                delete_password: delete_password
              })
              .end(function (err, postReplyRes) {
                assert.equal(postReplyRes.status, 200);
                chai.request(server)
                  .put(`/api/replies/${boardName}`)
                  .query({ test: true })
                  .send({
                    thread_id: _id,
                    reply_id: reply_id,
                  })
                  .end(function (err, reportReplyRes) {
                    assert.equal(reportReplyRes.status, 200);
                    assert.equal(reportReplyRes.text, 'success', "reply should be reported successfully");
                    chai.request(server)
                      .delete(`/api/threads/${boardName}/`)
                      .query({ test: true })
                      .send({
                        thread_id: _id,
                        delete_password: delete_password
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

    suite('DELETE', function () {

      test('delete-replies-test', function (done) {
        // this.timeout(15000);
        var boardName = 'delete-replies-test';
        var text = `${boardName}: ${new Date()}`;
        var _id = ObjectId();
        var reply_id = ObjectId();
        chai.request(server)
          .post(`/api/threads/${boardName}/`)
          .query({ test: true })
          .send({
            _id: _id,
            text: "thread for " + text,
            delete_password: delete_password
          })
          .end(function (err, postRes) {
            assert.equal(postRes.status, 200);
            assert.isArray(postRes.redirects);
            assert.equal(postRes.redirects[0].slice(-`/b/${boardName}/`.length), `/b/${boardName}/`);
            chai.request(server)
              .post(`/api/replies/${boardName}`)
              .query({ test: true })
              .send({
                thread_id: _id,
                reply_id: reply_id,
                text: text,
                delete_password: delete_password
              })
              .end(function (err, postReplyRes) {
                assert.equal(postReplyRes.status, 200);
                chai.request(server)
                  .delete(`/api/replies/${boardName}`)
                  .query({ test: true })
                  .send({
                    thread_id: _id,
                    reply_id: reply_id,
                    delete_password: delete_password
                  })
                  .end(function (err, deleteReplyRes) {
                    assert.equal(deleteReplyRes.status, 200);
                    assert.equal(deleteReplyRes.text, 'success', "reply should be 'deleted' successfully");
                    chai.request(server)
                      .delete(`/api/threads/${boardName}/`)
                      .query({ test: true })
                      .send({
                        thread_id: _id,
                        delete_password: delete_password
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


});
