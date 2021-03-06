const config = require('./src/config/config');
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const app = express();
const knex = require('knex');
const cors = require('cors');
const bp = require('body-parser');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(config.SALTROUNDS);
const nodemailer = require('nodemailer');
const port = process.env.PORT || config.PORT;

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

app.listen(port, () => console.log('\x1b[36m%s\x1b[0m','-> Listening on port ' + port));

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
});
app.set("db", db);

//-------------------------------------------------------

var timeGetQuestions;

app.post('/getQuestions', (req, res) => {
  const { typeOfTest, quantity } = req.body;
  let orderCriteria = sortRandom(6);
  let orderDirection = sortRandom(2);
  let offsetRnd = sortRandom(1);
  timeGetQuestions = new Date();
  console.log('-> Server got questions request: ' + typeOfTest, quantity);
  db
    .select('id', 'question', 'a', 'b', 'c', 'd', 'answer', 'topic')
    .from('questions_' + typeOfTest)
    .orderBy(orderCriteria, orderDirection)
    .limit(quantity).offset(offsetRnd)
    .then(data => {
      console.log(`-> Questions was sent (ordered by ${orderCriteria} ${orderDirection} from ${offsetRnd}).`);
      res.send(data);
    })
    .catch(err => {
      console.log('-> ' + err.message)
      res.send({ reply: err.message });
    });
})

//-------------------------------------------------------

db.schema.hasTable('userlist').then(function (exists) {
  if (!exists) {
    return db.schema.createTable('userlist', function (table) {
      table.increments();
      table.string('username');
      table.string('password');
      table.string('firstname');
      table.string('lastname');
      table.string('email');
      table.string('date');
    });
  }
});

//-------------------------------------------------------

app.post('/login', function (req, res) {
  console.log('-> Login attempt: ' + req.body.username);
  db
    .select('password').from('userlist')
    .where('username', req.body.username)
    .then(data => {
      if (data.length > 0) {
        if (bcrypt.compareSync(req.body.password, data[0].password)) {
          db
            .select('firstname', 'lastname', 'username', 'email').from('userlist')
            .where('username', req.body.username)
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              console.log('-> ' + err.message)
            });
          console.log('-> Login ok: ' + req.body.username);
        }
        else {
          console.log('-> Password incorrect for user: ' + req.body.username);
          res.send([]);
        }
      }
      else {
        console.log('-> No user found: ' + req.body.username);
        res.send([]);
      }
    })
    .catch(err => {
      console.log(err.message)
    });

});

//-------------------------------------------------------

app.post('/register', function (req, res) {
  console.log('-> Register attempt: ' + req.body.username);
  db
    .select('username').from('userlist')
    .where('username', req.body.username)
    .then(data => {
      if (data.length == 0) {
        let hash = bcrypt.hashSync(req.body.password, salt)
        let newuser = {
          username: req.body.username,
          password: hash,
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          email: req.body.email,
          date: new Date()
        }
        db('userlist')
          .returning('*')
          .insert(newuser)
          .then(data => {
            console.log('-> User has been registered: ' + data[0].username);
            createRusultsTable(newuser.username);
            res.send({
              firstname: newuser.firstname,
              lastname: newuser.lastname,
              username: newuser.username,
              email: newuser.email,
            })
          })
          .catch(err => {
            console.log('-> ' + err.message)
          });
      }
      else {
        res.send([]);
        console.log('-> User already registered: ' + req.body.username);
      }
    })
    .catch(err => {
      console.log('-> ' + err.message)
    });
});

//-------------------------------------------------------

app.post('/sendAnswer', function (req, res) {
  let { username, number, question, userAnswer, correctAnswer } = req.body;
  console.log('-> Got answer ' + number + ' from user: ' + username);
  let newAnswer = {
    question: question,
    userAnswer: userAnswer,
    correctAnswer: correctAnswer,
    date: (number.slice(0, 4) === '1 of' ? timeGetQuestions : new Date())
  }
  db('results_' + username)
    .returning('*')
    .insert(newAnswer)
    .then(data => {
      res.send({ message: 'Got answer ' + number + ' from user: ' + username });
      console.log('-> Answer was added to results database of user: ' + username);
    })
    .catch(err => {
      console.log('-> ' + err.message)
    });

});

//-------------------------------------------------------

app.post('/getResult', function (req, res) {
  const { username, quantity } = req.body;
  console.log('-> Results request from user: ' + username);
  db
    .select('question', 'userAnswer', 'correctAnswer', 'date')
    .from('results_' + username)
    .orderBy('id', 'desc')
    .limit(quantity).offset(0)
    .then(data => {
      res.send(data);
      console.log('-> Results were sent back');
    })
    .catch(err => {
      console.log('-> ' + err.message)
    })
});

//-------------------------------------------------------

app.post('/getAllResult', function (req, res) {
    const { username } = req.body;
    console.log('-> All results request from user: ' + username);
    db
        .select('question', 'userAnswer', 'correctAnswer', 'date')
        .from('results_' + username)
        .orderBy('id', 'desc')
        .then(data => {
            res.send(data);
            console.log('-> All results were sent back');
        })
        .catch(err => {
            console.log('-> ' + err.message)
        })
});

//-------------------------------------------------------

function sortRandom(num) {
  if (num == 6) {
    let rnd = Math.floor(Math.random() * 6);
    let orderCriteria = '';
    switch (rnd) {
      case 0:
        orderCriteria = 'id'
        break;
      case 1:
        orderCriteria = 'question'
        break;
      case 2:
        orderCriteria = 'a'
        break;
      case 3:
        orderCriteria = 'b'
        break;
      case 4:
        orderCriteria = 'c'
        break;
      case 5:
        orderCriteria = 'd'
        break;
      default:
        break;
    }
    return orderCriteria;
  }
  if (num == 2) {
    let rnd2 = Math.floor(Math.random() * 2);
    let orderDirection = '';
    switch (rnd2) {
      case 0:
        orderDirection = 'asc'
        break;
      case 1:
        orderDirection = 'desc'
        break;
      default:
        break;
    }
    return orderDirection;
  }
  if (num == 1) {
    let offsetRnd = Math.floor(Math.random() * 150);
    return offsetRnd;
  }
}

//-------------------------------------------------------

function createRusultsTable(username) {

  db.schema.hasTable('results_' + username).then(function (exists) {
    if (!exists) {
      console.log('-> Results database for user ' + username + ' was created');
      return db.schema.createTable('results_' + username, function (table) {
        table.increments();
        table.string('question', 500);
        table.string('userAnswer');
        table.string('correctAnswer');
        table.string('date');
      });
    }
  });
}

//-------------------------------------------------------

let transporter = nodemailer.createTransport({
  host: config.MAILHOST,
  port: config.MAILPORT,
  secure: true,
  auth: {
      user: config.MAILUSER,
      pass: config.MAILPASS
  }
});

transporter.verify(function (error, success) {
  if (error) {
      console.log(error);
  } else {
      console.log("-> Mail server is ready to take messages!");
  }
});

app.post('/email', (req, res, next) => {

  let { firstname, lastname, email, time, correct, wrong, percent, status } = req.body;
  let text = `${firstname} ${lastname}, your test results: 
  Status: ${status}; Total questions: ${correct - (-wrong)}; Percentage: ${percent}%;
  Correct answers: ${correct}; Wrong answers: ${wrong}; Test duration: ${time};`;
  let html = `<p>${firstname} ${lastname}, your test results: </p>
  <p>Status: <strong>${status}</strong> <br> Total questions: ${correct - (-wrong)} <br> Percentage: ${percent}% <br>
  Correct answers: ${correct} <br> Wrong answers: ${wrong} <br> Test duration: ${time} <br>
  <a href='https://ppltest.herokuapp.com/'>ppltest.herokuapp.com</a>`;

  let mail = {
      from: `"PPL test" <${config.MAILUSER}>`,
      to: `${email}, <${config.MAILUSER}>`,
      subject: `${firstname}, your test results`,
      text: text,
      html: html
  };

  transporter.sendMail(mail, (err, data) => {
      if (err) {
          console.log("-> Fail to send results to " + email);
          res.json({
              status: 'fail'
          })
      } else {
          console.log("-> Results has been sent to " + email);
          res.json({
              status: 'success'
          })
      }
  })
})

//-------------------------------------------------------