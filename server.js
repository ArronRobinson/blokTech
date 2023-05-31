const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config()
const {
    User,
    connect
} = require("./database")

connect()
app.set('view engine', 'pug')

const user = {
    firstName: 'tim',
    lastName: 'cook',
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static('views/pages'))
app
    .get('/', (req, res) => {
        res.render('pages', { title: 'Hey', message: 'Hello there!' })
      })
    .get('/signup', (req, res) => {
        res.render('pages/signup', { title: 'Hey', message: 'Hello there!' })
      })
    .post('/signup', async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const user = new User({
            email, password
        })
        await user.save()
        console.log(email, password)
        res.status(200).send('yoooo')
    })
    .use((req, res) => {
        res.status(404).sendFile(__dirname + '/views/pages/404.html');
    })
    .listen(port)