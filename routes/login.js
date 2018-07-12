const express = require('express');
const router = express.Router();
const util = require('util');
const esClient = require('../modules/esClient');
var nodemailer = require('nodemailer');
const indexName = 'users';
const primaryKey = 'email';
const USER_REGISTERED = 1;
const USER_ALREADY_REGISTERED = 2;
const USER_NOT_FOUND = 3;
const SUCCESS = 4;
const INVALID_PASSWORD = 5;
/* GET home page. */
router.post('/register', function (req, res, next) {
  console.log('****************register request received*******************');
  registerUser(res, req.body);
});

router.post('/signin', function (req, res, next) {
  console.log('****************signin request received*******************');
  getUser(res, req.body);
});

router.post('/verify/:verificationCode', function (req, res, next) {
  console.log('****************verify request received*******************');
  verifyUser(req.params.verificationCode);
});

async function verifyUser(data) {
  esClient.verifyUser(indexName, data, primaryKey);
}

async function getUser(res, data) {
  const users = [];
  const responseQueue = await esClient.getEntity(indexName, data, primaryKey);

  responseQueue.hits.hits.forEach(function (hit) {
    users.push(hit._source);
  });
  if (users.length === 0) {
    res.send({code: USER_NOT_FOUND, user: data});
  } else if (users[0].verified && users[0].pwd === data.pwd) {
    res.send({code: SUCCESS, user: users[0]});
  } else {
    res.send({code: INVALID_PASSWORD, user: users[0]});
  }
}

async function registerUser(res, data) {
  const exists = await esClient.exists(indexName, data, primaryKey);
  if (!exists) {
    data.verified = false;
    data.admin = false;
    var rand = Math.floor((Math.random() * 100) + 54);
    data.verificationCode = rand;
    esClient.saveEntity(indexName, data, primaryKey);
    var transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'reviewscan@outlook.com',
        pass: 'Signin@132'
      }
    });
    var mailOptions = {
      from: 'reviewscan@outlook.com',
      to: data.email,
      subject: 'Verify your blogosphy account',
      text: 'Please verify your account by clicking on the link\n',
      html: '<p>Click <a href="https://blogosphy.herokuapp.com/verify/' + data.verificationCode + '">here</a> to verify your account.</p>'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('message couldnt be sent : ' + error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.send({code: USER_REGISTERED, user: data});
    console.log('*************user registered********************');
  } else {
    res.send({code: USER_ALREADY_REGISTERED, user: data});
  }
}

module.exports = router;
