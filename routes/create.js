var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();

// Create connection to MySQL Database

var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB
});

connection.connect()

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