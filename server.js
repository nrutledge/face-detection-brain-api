const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const signup = require('./controllers/signup');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('Server running successfully') });

// Examples of dependency injection for db and bcrypt
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/signup', (req, res) => { signup.handleSignup(req, res, db, bcrypt) });

// Alternate method of dependency injection using currying (see controller files)
app.get('/profile/:id', profile.handleProfileGet(db));
app.put('/image', image.handleImage(db));

app.listen(process.env.PORT || 3000, ()=> {
	console.log(`app is running on port 3000 ${process.env.PORT}`)
});