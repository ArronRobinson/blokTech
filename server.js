const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
dotenv.config()
const {
    User,
    connect
} = require("./database")

connect()
app.set('view engine', 'pug')

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
        const plainPassword = req.body.password;
        bcrypt.hash(plainPassword, 10, async (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('nope');
            }
            const user = new User({
                email, password: hashedPassword
            })
            await user.save()
            res.status(200).send('yoooo')
        });
    })
    .use((req, res) => {
        res.status(404).sendFile(__dirname + '/views/pages/404.html');
    })
    .listen(port)