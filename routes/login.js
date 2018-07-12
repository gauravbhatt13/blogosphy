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

router.get('/verify/:verificationCode', function (req, res, next) {
  console.log('****************verify request received*******************');
  verifyUser(res, req.params.verificationCode);
});

async function verifyUser(res, data) {
  const responseQueue = await esClient.verifyUser(indexName, data, primaryKey);
  res.send('<p>Thanks for verifying your account. Please login <a href="https://blogosphy.herokuapp.com>Login</a>"</p>');
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
    var emailURL = 'https://blogosphy.herokuapp.com/verify/' + data.verificationCode;
    var mailOptions = {
      from: 'reviewscan@outlook.com',
      to: data.email,
      subject: 'Verify your blogosphy account',
      text: 'Please verify your account by clicking on the link\n',
      html:
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
      '<html xmlns="http://www.w3.org/1999/xhtml">\n' +
      '<head>\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
      '  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n' +
      '  <title>Verify your email address</title>\n' +
      '  <style type="text/css" rel="stylesheet" media="all">\n' +
      '    /* Base ------------------------------ */\n' +
      '    *:not(br):not(tr):not(html) {\n' +
      '      font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;\n' +
      '      -webkit-box-sizing: border-box;\n' +
      '      box-sizing: border-box;\n' +
      '    }\n' +
      '    body {\n' +
      '      width: 100% !important;\n' +
      '      height: 100%;\n' +
      '      margin: 0;\n' +
      '      line-height: 1.4;\n' +
      '      background-color: #F5F7F9;\n' +
      '      color: #839197;\n' +
      '      -webkit-text-size-adjust: none;\n' +
      '    }\n' +
      '    a {\n' +
      '      color: #414EF9;\n' +
      '    }\n' +
      '    /* Layout ------------------------------ */\n' +
      '    .email-wrapper {\n' +
      '      width: 100%;\n' +
      '      margin: 0;\n' +
      '      padding: 0;\n' +
      '      background-color: #F5F7F9;\n' +
      '    }\n' +
      '    .email-content {\n' +
      '      width: 100%;\n' +
      '      margin: 0;\n' +
      '      padding: 0;\n' +
      '    }\n' +
      '    /* Masthead ----------------------- */\n' +
      '    .email-masthead {\n' +
      '      padding: 25px 0;\n' +
      '      text-align: center;\n' +
      '    }\n' +
      '    .email-masthead_logo {\n' +
      '      max-width: 400px;\n' +
      '      border: 0;\n' +
      '    }\n' +
      '    .email-masthead_name {\n' +
      '      font-size: 16px;\n' +
      '      font-weight: bold;\n' +
      '      color: #839197;\n' +
      '      text-decoration: none;\n' +
      '      text-shadow: 0 1px 0 white;\n' +
      '    }\n' +
      '    /* Body ------------------------------ */\n' +
      '    .email-body {\n' +
      '      width: 100%;\n' +
      '      margin: 0;\n' +
      '      padding: 0;\n' +
      '      border-top: 1px solid #E7EAEC;\n' +
      '      border-bottom: 1px solid #E7EAEC;\n' +
      '      background-color: #FFFFFF;\n' +
      '    }\n' +
      '    .email-body_inner {\n' +
      '      width: 570px;\n' +
      '      margin: 0 auto;\n' +
      '      padding: 0;\n' +
      '    }\n' +
      '    .email-footer {\n' +
      '      width: 570px;\n' +
      '      margin: 0 auto;\n' +
      '      padding: 0;\n' +
      '      text-align: center;\n' +
      '    }\n' +
      '    .email-footer p {\n' +
      '      color: #839197;\n' +
      '    }\n' +
      '    .body-action {\n' +
      '      width: 100%;\n' +
      '      margin: 30px auto;\n' +
      '      padding: 0;\n' +
      '      text-align: center;\n' +
      '    }\n' +
      '    .body-sub {\n' +
      '      margin-top: 25px;\n' +
      '      padding-top: 25px;\n' +
      '      border-top: 1px solid #E7EAEC;\n' +
      '    }\n' +
      '    .content-cell {\n' +
      '      padding: 35px;\n' +
      '    }\n' +
      '    .align-right {\n' +
      '      text-align: right;\n' +
      '    }\n' +
      '    /* Type ------------------------------ */\n' +
      '    h1 {\n' +
      '      margin-top: 0;\n' +
      '      color: #292E31;\n' +
      '      font-size: 19px;\n' +
      '      font-weight: bold;\n' +
      '      text-align: left;\n' +
      '    }\n' +
      '    h2 {\n' +
      '      margin-top: 0;\n' +
      '      color: #292E31;\n' +
      '      font-size: 16px;\n' +
      '      font-weight: bold;\n' +
      '      text-align: left;\n' +
      '    }\n' +
      '    h3 {\n' +
      '      margin-top: 0;\n' +
      '      color: #292E31;\n' +
      '      font-size: 14px;\n' +
      '      font-weight: bold;\n' +
      '      text-align: left;\n' +
      '    }\n' +
      '    p {\n' +
      '      margin-top: 0;\n' +
      '      color: #839197;\n' +
      '      font-size: 16px;\n' +
      '      line-height: 1.5em;\n' +
      '      text-align: left;\n' +
      '    }\n' +
      '    p.sub {\n' +
      '      font-size: 12px;\n' +
      '    }\n' +
      '    p.center {\n' +
      '      text-align: center;\n' +
      '    }\n' +
      '    /* Buttons ------------------------------ */\n' +
      '    .button {\n' +
      '      display: inline-block;\n' +
      '      width: 200px;\n' +
      '      background-color: #414EF9;\n' +
      '      border-radius: 3px;\n' +
      '      color: #ffffff;\n' +
      '      font-size: 15px;\n' +
      '      line-height: 45px;\n' +
      '      text-align: center;\n' +
      '      text-decoration: none;\n' +
      '      -webkit-text-size-adjust: none;\n' +
      '      mso-hide: all;\n' +
      '    }\n' +
      '    .button--green {\n' +
      '      background-color: #28DB67;\n' +
      '    }\n' +
      '    .button--red {\n' +
      '      background-color: #FF3665;\n' +
      '    }\n' +
      '    .button--blue {\n' +
      '      background-color: #414EF9;\n' +
      '    }\n' +
      '    /*Media Queries ------------------------------ */\n' +
      '    @media only screen and (max-width: 600px) {\n' +
      '      .email-body_inner,\n' +
      '      .email-footer {\n' +
      '        width: 100% !important;\n' +
      '      }\n' +
      '    }\n' +
      '    @media only screen and (max-width: 500px) {\n' +
      '      .button {\n' +
      '        width: 100% !important;\n' +
      '      }\n' +
      '    }\n' +
      '  </style>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">\n' +
      '    <tr>\n' +
      '      <td align="center">\n' +
      '        <table class="email-content" width="100%" cellpadding="0" cellspacing="0">\n' +
      '          <!-- Logo -->\n' +
      '          <tr>\n' +
      '            <td class="email-masthead">\n' +
      '              <a class="email-masthead_name">Canvas</a>\n' +
      '            </td>\n' +
      '          </tr>\n' +
      '          <!-- Email Body -->\n' +
      '          <tr>\n' +
      '            <td class="email-body" width="100%">\n' +
      '              <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">\n' +
      '                <!-- Body content -->\n' +
      '                <tr>\n' +
      '                  <td class="content-cell">\n' +
      '                    <h1>Verify your email address</h1>\n' +
      '                    <p>Thanks for signing up for Blogosphy! We\'re excited to have you as an early user.</p>\n' +
      '                    <!-- Action -->\n' +
      '                    <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">\n' +
      '                      <tr>\n' +
      '                        <td align="center">\n' +
      '                          <div>\n' +
      '                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="emailUrl" style="height:45px;v-text-anchor:middle;width:200px;" arcsize="7%" stroke="f" fill="t">\n' +
      '                            <v:fill type="tile" color="#414EF9" />\n' +
      '                            <w:anchorlock/>\n' +
      '                            <center style="color:#ffffff;font-family:sans-serif;font-size:15px;">Verify Email</center>\n' +
      '                          </v:roundrect><![endif]-->\n' +
      '                            <a href="' + emailURL + '" class="button button--blue">Verify Email</a>\n' +
      '                          </div>\n' +
      '                        </td>\n' +
      '                      </tr>\n' +
      '                    </table>\n' +
      '                    <p>Thanks,<br>The Blogosphy Team</p>\n' +
      '                    <!-- Sub copy -->\n' +
      '                    <table class="body-sub">\n' +
      '                      <tr>\n' +
      '                        <td>\n' +
      '                          <p class="sub">If you’re having trouble clicking the button, copy and paste the URL below into your web browser.\n' +
      '                          </p>\n' +
      '                          <p class="sub"><a href="' + emailURL + '">Email</a></p>\n' +
      '                        </td>\n' +
      '                      </tr>\n' +
      '                    </table>\n' +
      '                  </td>\n' +
      '                </tr>\n' +
      '              </table>\n' +
      '            </td>\n' +
      '          </tr>\n' +
      '          <tr>\n' +
      '            <td>\n' +
      '              <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0">\n' +
      '                <tr>\n' +
      '                  <td class="content-cell">\n' +
      '                    <p class="sub center">\n' +
      '                      Blogosphy, Inc.\n' +
      '                      <br>3 9th St, San Francisco, CA 94103\n' +
      '                    </p>\n' +
      '                  </td>\n' +
      '                </tr>\n' +
      '              </table>\n' +
      '            </td>\n' +
      '          </tr>\n' +
      '        </table>\n' +
      '      </td>\n' +
      '    </tr>\n' +
      '  </table>\n' +
      '</body>\n' +
      '</html>\n'
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
