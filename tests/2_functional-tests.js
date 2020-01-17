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

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite('API ROUTING FOR /api/threads/:board', function () {

    suite('POST', function () {
      test('post-test', function (done) {
        this.timeout(15000);
        chai.request(server)
          .post('/api/threads/post-test/')
          .send({
            text: '/api/threads/post-test/',
            delete_password: 'test-delete'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            chai.request(server)
              .get('/b/post-test/')
              .end(function (err, res) {
                assert.equal(res.status, 200);
                console.log(Object.keys(res));
                done();
              });
          });
      });
    });

    suite('GET', function () {

    });

    suite('DELETE', function () {

    });

    suite('PUT', function () {

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

  });

});
