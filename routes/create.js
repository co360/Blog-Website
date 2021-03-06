var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();

// Create connection to MySQL Database
var db_config = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB
}

var mysql = require('mysql')
var connection = mysql.createConnection(db_config);

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect()

/* GET home page. */
router.get('/', function(req, res, next) {
  // Retreive current blog posts listings
  connection.query('SELECT * FROM blog_posts', function (err, rows, fields){
    if (err) throw err;
    res.render('create', { title: 'MySQL Blog', posts: rows });
  })
});

// Add a blog post
router.post('/', function(req, res, next) {
  connection.query(`INSERT INTO blog_posts (Title, Content) VALUES ('${req.body.title}','${req.body.content}')`, function (err, rows, fields){
    if (err) {
      throw err
    } else {
      res.redirect('/')
    }
    
  })
});


module.exports = router;