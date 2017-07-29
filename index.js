const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

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





app.listen(3000, function() {
  console.log('Word game playing on port 3000');
});
