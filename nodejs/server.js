const express = require('express');
const app = express();
const knex = require('knex');
const cors = require('cors');
const bp = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

app.use(cors());
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
})

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
    timeGetQuestions = new Date();
    console.log('-> Server got questions request: ' + typeOfTest, quantity);
    db
        .select('id', 'question', 'a', 'b', 'c', 'd', 'answer', 'topic')
        .from('questions_' + typeOfTest)
        .orderBy(orderCriteria, orderDirection)
        .limit(quantity).offset(0)
        .then(data => {
            console.log(`-> Questions was sent (ordered by ${orderCriteria} ${orderDirection}).`);
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
                        .select('firstname', 'lastname', 'username').from('userlist')
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
                            username: newuser.username
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
        date: (number.slice(0,4) === '1 of'? timeGetQuestions : new Date())
    }
    db('results_' + username)
        .returning('*')
        .insert(newAnswer)
        .then(data => {
            res.send({message: 'Got answer ' + number + ' from user: ' + username});
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
            console.log('-> Results were sent');
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

// app.use('/',express.static(__dirname+'/public'));

// app.post('/test', (req, res) => {
//     console.log('got data: ' + req.body.message);
//     res.send({ answer: `We got your message: ${req.body.message}` });
// })

// app.get('/test', (req, res) => {
//     console.log('got request');
//     res.send({ answer: 'ok' });
// })

//Here we select only the columns ‘first_name’ and ‘last_name’ from the actors table
// app.get('/', (req, res) => {
//     db
//         .select('customer_id', 'first_name', 'last_name').from('customer')
//         //.where({'country_id':98})
//         .orderBy('customer_id')
//         .limit(15).offset(0)
//         .then(data => {
//             console.log('got request')
//             res.send(data);
//         })
//         .catch(err => {
//             console.log(err.message)
//         });
// })

// app.get('/getAllCustomers', (req, res) => {
//     const { offset } = req.query;
//     db
//         .select('customer_id', 'first_name', 'last_name').from('customer')
//         //.where({'country_id':98})
//         .orderBy('customer_id')
//         .limit(15).offset(offset)
//         .then(data => {
//             console.log('got request')
//             res.send(data);
//         })
//         .catch(err => {
//             console.log(err.message)
//         });
// })


// app.get('/getCountCustomers', (req, res) => {
//     db
//         ('customer').count('customer_id')
//         .then(data => {
//             console.log('got request')
//             res.send(data);
//         })
//         .catch(err => {
//             console.log(err.message)
//         });
// })

// app.get('/search', (req, res) => {
//     const { q } = req.query;
//     db
//         .select('customer_id', 'first_name', 'last_name').from('customer')
//         .whereRaw('LOWER(first_name) LIKE ?', q.toLowerCase() + '%')
//         .orderBy('customer_id')
//         .then(data => {
//             console.log('got request')
//             res.send(data);
//         })
//         .catch(err => {
//             console.log(err.message)
//         });
// })

// db
// .select('customer_id', 'first_name', 'last_name').from('customer')
// //.where({'country_id':98})
// .then(data=>{
//     console.log(data);
// })
// .catch(err => {
//     console.log(err.message)
// });


// // To select all the columns, we do:
// app.get('/', (req, res) => {
//     db
//     .select().from('actors')
//     .then(actors =>
//             res.send(actors)
//     )
// })

// // select "id" from "actors" where "first_name" = 'Matt' and "last_name" = 'Damon'
// app.get('/', (req, res) => {
//     db('actors')
//     .where({ first_name: 'Matt', last_name: "Damon" })
//     .then(actors =>
//         res.send(actors)
//     )
// })

// // insert into "actors" ("first_name", "last_name", "age", "number_oscars") 
// // values ('Gal'), ('Gadot'), ('1985-04-30'), (0) 
// // returning "actor_id", "first_name", "last_name"
// app.get('/', (req, res) => {
//     db('actors')
//         .returning(['actor_id', 'first_name', 'last_name'])
//         .insert({ first_name: 'Gal', last_name: 'Gadot', age: '1985-04-30', number_oscars: 0 })
//         .then(actors =>
//             res.send(actors)
//         )
// })

// // update "actors" 
// // set "number_oscars" = 2 , "age" = '1985-04-29' 
// // where "first_name" = 'Gal' and "last_name" = "Gadot" 
// // returning "actor_id", "number_oscar"
// app.get('/', (req, res) => {
//     db('actors')
//         .where('first_name', 'Gal')
//         .andWhere('last_name', 'Gadot')
//         .update({
//             number_oscars: 2,
//             age: '1985-04-29'
//         },
//             ['actor_id', 'number_oscars'])
//         .then(actors =>
//             res.send(actors)
//         )
// })