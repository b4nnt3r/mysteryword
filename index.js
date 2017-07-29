const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');


const app = express();
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: '2C44-4D44-WppQ385',
  resave: false,
  saveUninitialized: true
}));
app.use(expressValidator())
app.use(express.static('public'));

app.get('/', function(request, response) {
  response.render('game');
});

var word = words[Math.floor(Math.random() * 235886)];
console.log(word);





app.listen(3000, function() {
  console.log('Word game playing on port 3000');
});
