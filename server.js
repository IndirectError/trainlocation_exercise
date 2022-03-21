const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const bodyParser = require('body-parser'); // Create application/x-www-form-urlencoded parser (for POST)
const url = require('url');
const mysql = require('mysql');
const util = require('util'); // for async calls
const secrets = require('./config/secrets.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
let hashedPw;


/**
 * bodyParser used to read JSONs from the app queries
 */
let urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // for reading JSON

/**
 * Variables to handle the user accessToken
 */
let accessToken;

/**
 * variable to handle uesr id
 */
let id;
/**
 * List variable to contain the train location data gotten from the api endpoint
 * @type {*[]}
 *
 * Currently holds a test, since no live data is currently pushed to the api
 */
const trainList = [{trainNumber:53,coordinates:[21.794674,63.064011],speed:110},
  {trainNumber:58,coordinates:[24.845201,60.640353],speed:99},
  {trainNumber:73,departureDate:"2022-03-20",timestamp:"2022-03-20T21:53:31.000Z",coordinates:[27.666272,63.076157],speed:0},
  {trainNumber:187,departureDate:"2022-03-20",timestamp:"2022-03-20T21:52:47.000Z",coordinates:[23.773866,61.490447],speed:44},
  {trainNumber:265,departureDate:"2022-03-20",timestamp:"2022-03-20T21:53:29.000Z",coordinates:[23.097219,62.025014],speed:117},
  {trainNumber:266,departureDate:"2022-03-20",timestamp:"2022-03-20T21:53:33.000Z",coordinates:[22.789159,63.594924],speed:0}
];

/**
 * The backend server uses query headers
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/**
 * Mysql connection details, for the user database
 * @type {Connection}
 */
const conn = mysql.createConnection({
  host: '192.168.1.104',
  port: '3306',
  user: 'root',
  password: 'ReivinDB',
  database: 'application',
});

/**
 * Establishing SQL connection
 * @type {any}
 */
const query = util.promisify(conn.query).bind(conn); // is bind needed?
conn.connect(function(err) {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

/**
 * Endpoint for the app to send user registration
 * User data is received as a JSON object and the password
 * is hashed with bcrypt library
 * After the creation sends a result code was the creation successfull or not
 */
app.post('/api/register', function(req, res) {
  const jsonObj = req.body;
  let sqlquery = 'INSERT INTO users (USERNAME, EMAIL, NAME, PASSWORD) VALUES (?, ?, ?, ?)';
  (async () => {
    try {
      hashedPw = await bcrypt.hash(jsonObj.password, saltRounds);
      await query(sqlquery, [jsonObj.username, jsonObj.email, jsonObj.name, hashedPw]);
      res.status(200).send('POST succesful ' + req.body);
    } catch (e) {
      console.log(e);
      res.status(400).send('POST was not succesful ' + e);
    }
  })();
});

/**
 * API endpoint for the app to send login request, with credentials as the request body
 */
app.post('/api/login', function(req, res) {
  /**
   * variable to simplify request body for use
   * @type {ReqBody}
   */
  const q = req.body;
  /**
   * variable to contain username
   */
  const username = q.username;
  /**
   * Variable to contain password from the query
   */
  const password = q.password;

  /**
   * SQL query string
   * @type {string}
   */
  const sql = 'SELECT USERNAME, EMAIL, PASSWORD, NAME'
      + ' FROM users'
      + ' WHERE USERNAME = ?';
  /**
   * Initiating SQL query
   * @type {any}
   */
  const query = util.promisify(conn.query).bind(conn);
  /**
   * Async function to contain the query and authentication process.
   * If user data is being received, the password received from the app is hashed and compared
   * to the one received from the SQL query, if they are a match, result status is sent back to the app,
   * with user access token that is created and the account info that the app stores to localStorage.
   */
  (async () => {
    try {
      const rows = await query(sql, [username]);
      if (rows.length > 0) {
        console.log("user "+rows[0].USERNAME);
        hashedPw = rows[0].PASSWORD;
        bcrypt.compare(password, hashedPw, function(err, result) {
          if (result === true) {
            accessToken = jwt.sign({username: rows[0].USERNAME, email: rows[0].EMAIL}, secrets.jwtSecret,
                {expiresIn: '1h'}); // expires in one hour
            res.status(202).json({accessToken: accessToken, username: rows[0].USERNAME, email: rows[0].EMAIL, name: rows[0].NAME});
          } else {
            res.sendStatus(401);

        }
        });
      } else {
        /**
         * Result status if no account is found
         */
        res.status(201).json({message:"No user account"});
      }

    } catch (err) {
      console.log('Database error!' + err);
    } finally {
    }
  })();

});

/**
 * API endpoint for the app to receive the train locations, from the stored trainList list variable.
 */
app.get('/api/trainlocations', function(req, res) {
  const param = url.parse(req.url, true).query;
  const token = jwt.decode(param.token);
  res.send(trainList);
});

/**
 * API endpoint for the train location data that is pushed to the application.
 * The data is the reformatted into a new JSON object and pushed into a trainList list for further use.
 */
app.put(`/trains/${id}/location`, function(req, res) {
  console.log('API train locations called with train id: '+id);
  const q = req.body;
  const trainID = id;
  const name = q.name;
  const destination = q.destination;
  const speed = q.speed;
  const gpsLoc = q.coordinates;

  trainList.push({
    'trainNumber': trainID,
    'name': name,
    'destiantion': destination,
    'speed': speed,
    'location': gpsLoc
    });
  });

/**
 * The backend server init
 * @type {http.Server}
 */
const server = app.listen(8123, 'localhost', function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});