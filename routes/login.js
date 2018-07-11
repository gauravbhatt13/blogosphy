const express = require('express');
const router = express.Router();
const util = require('util');
const esClient = require('../modules/esClient');
const indexName = 'users';
const primaryKey = 'email';
/* GET home page. */
router.post('/register', function (req, res, next) {
  console.log('****************register request received*******************');
  console.log('username : ' + req.body.email);
  console.log('password : ' + req.body.pwd);
  registerUser(res, req.body);
});

router.post('/signin', function (req, res, next) {
  console.log('****************signin request received*******************');
  console.log('username : ' + req.body.email);
  console.log('password : ' + req.body.pwd);
  getUser(res, req.body);
});

async function getUser(res, data) {
  const users = [];
  const responseQueue = await esClient.getEntity(indexName, data, primaryKey);

  responseQueue.hits.hits.forEach(function (hit) {
    users.push(hit._source);
  });

  console.log('users found : ' + users.length);
  if (users.length === 0) {
    res.send({code: 3, user: data});
  } else {
    res.send({code: 4, user: users[0]});
  }
}

async function registerUser(res, data) {
  const exists = await esClient.exists(indexName, data, primaryKey);
  if (!exists) {
    console.log('user exists status : ' + exists);
    data.verified = false;
    data.admin = false;
    esClient.saveEntity(indexName, data, primaryKey);
    res.send({code: 1, user: data});
    console.log('*************user registered*********************');
  } else {
    res.send({code: 2, user: data});
  }
}

module.exports = router;
