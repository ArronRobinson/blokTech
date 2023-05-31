const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: { type: String, required: true },




    hobby: { type: String, required: true },
 
 
 
 
    age: { type: Number, required: true },
})

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
    .post('/signup', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email, password)
        res.status(200).send('yoooo')
    })
    .use((req, res) => {
        res.status(404).sendFile(__dirname + '/views/pages/404.html');
    })
    .listen(port)