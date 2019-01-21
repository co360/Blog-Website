var express = require('express');
// var bodyParser = require('body-parser')
var router = express.Router();

// Create connection to MySQL Database
var mysql = require('mysql')

// Fill this in with your MySQL connection info
var db_config = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB
}

var mysql = require('mysql')
var connection = mysql.createConnection(db_config);

connection.connect();

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

/* GET home page. */
router.get('/', function(req, res, next) {
  // Retreive current blog posts listings. Ordered by descending so that the newest posts are displayed first

  connection.query('SELECT * FROM blog_posts ORDER BY ID DESC', function (err, rows, fields){
    if (err) throw err;
    // noPosts is determined here
    if(rows[0] === undefined) {
      res.render('index', { title: 'MySQL Blog', noPosts: true, posts: rows })
    } else {
      res.render('index', { title: 'MySQL Blog', posts: rows });
    }
  })
});

// This is responsible for deleting the corresponding blog post
router.delete('/', function(req, res, body) {
  console.log(req.query.postid)
  connection.query(`DELETE FROM blog_posts WHERE ID='${req.query.postid}'`, function (err, rows, fields){
    if (err) {
      throw err;
    } else {
      // Success :)
      res.send(200)
    }
    
  })
})

module.exports = router;
