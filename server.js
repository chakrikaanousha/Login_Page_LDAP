var express = require('express');
var app = express();
var ldap = require('ldapjs');
var bodyParser = require('body-parser');
var { check, validationResult } = require('express-validator');

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, function() {
  console.log("Server up on http://localhost:3000");
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post(
  '/login',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  function(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log('Validation failed:', errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    var username = req.body.username;
    var password = req.body.password;

    // Construct the full DN dynamically based on the provided uid
    var userDN = `uid=${username}, ou=users, ou=system`;

    authenticationDN(userDN, password, function(err) {
      if (err) {
        console.log("Authentication failed: " + err);
        res.status(401).send('Authentication failed');
      } else {
        console.log("Authentication successful");
        res.send('Welcome To the Other side!');
      }
    });
  }
);

function authenticationDN(userDN, password, callback) {
  var client = ldap.createClient({
    url: 'ldap://127.0.0.1:10389',
  });

  client.bind(userDN, password, function(err) {
    if (err) {
      console.log("Error in new connection: " + err);
      callback(err);
    } else {
      console.log("Success");
      callback(null);
    }

    client.unbind();
  });
}
