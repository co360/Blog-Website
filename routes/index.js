var express = require('express');
// var bodyParser = require('body-parser')
var router = express.Router();

// Create connection to MySQL Database
var mysql = require('mysql')

// Fill this in with your MySQL connection info
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB
});

connection.connect();
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
