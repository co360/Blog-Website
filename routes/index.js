var express = require('express');
var router = express.Router();

// Create connection to MySQL Database

var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
//   password : 's3kreee7',
  database : 'test'
});

connection.connect()

/* GET home page. */
router.get('/', function(req, res, next) {
  // Retreive current blog posts listings
  connection.query('SELECT * FROM blog_posts', function (err, rows, fields){
    if (err) throw err;
  
    console.log(rows[1].Content)
  })

  res.render('index', { title: 'Pug' });
});

module.exports = router;
