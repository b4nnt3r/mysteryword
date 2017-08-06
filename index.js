const express = require('express')
const app = express()
const fs = require('fs')
const expressSession = require('express-session')
const expressValidator = require('express-validator')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const win = 'You Win!'
const lose = 'Better luck next time!'
const words = fs
  .readFileSync('/usr/share/dict/words', 'utf-8')
  .toLowerCase()
  .split('\n')

app.engine('mustache', mustacheExpress())
app.set('views', 'views')
app.set('view engine', 'mustache')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(
  expressSession({
    secret: 'gopher city',
    resave: false,
    saveUninitialized: true
  })
)

app.get('/', function(req, res) {
  if (!req.session.guessesLeft || req.session.newGame) {
    let randomWord = words[Math.floor(Math.random() * words.length)]
    req.session.randomWord = randomWord
    req.session.dashes = '_'.repeat(randomWord.length)
    req.session.guessed = []
    req.session.guessesLeft = 8
    req.session.newGame = false
  }

  console.log(req.session)

  res.render('index', {
    dashes: req.session.dashes,
    guessed: req.session.guessed,
    guessesLeft: req.session.guessesLeft,
    win: win,
    lose: lose
  })
})

app.post('/guessLetter', function(req, res) {
  const inputLetters = req.body.inputLetters
  console.log(inputLetters)
  let guessesLeft = req.session.guessesLeft
  let guessed = req.session.guessed
  let dashes = req.session.dashes
  let randomWord = req.session.randomWord

  console.log(`Selected Word: ${randomWord}`)
  console.log(`From Session: ${req.session.randomWord}`)

  guessed.push(inputLetters)

  req.session.guessed = guessed
  console.log(`Guessed from Session: ${req.session.guessed}`)
  if (!randomWord.includes(inputLetters)) {
    guessesLeft -= 1
  }
  req.session.guessesLeft = guessesLeft

  dashes = ''
  for (var i = 0; i < randomWord.length; i++) {
    const letter = randomWord[i]
    if (guessed.includes(letter)) {
      dashes += letter
    } else {
      dashes += '_'
    }
  }
  req.session.dashes = dashes

  if (!dashes.includes('_')) {
    req.session.newGame = true
    res.render('playAgain', {
      message: win,
      randomWord: randomWord
    })
  } else if (guessesLeft === 0) {
    req.session.newGame = true
    res.render('playAgain', {
      message: lose,
      randomWord: randomWord
    })
  } else {
    res.redirect('/')
  }
})

app.listen(3000, function() {
  console.log('Mystery Word playing on port 3000')
})
