const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

dotenv.config()

const {
    User,
    connect
} = require("./database")

connect()
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static('views/pages'))
app
    .get('/', (req, res) => {
        res.render('pages', { title: 'Hey', message: 'Hello there!'})
    })
    .get('/signup', (req, res) => {
        res.render('pages/signup')
    })
    .get('/login', (req, res) => {
        res.render('pages/login')
    })
    .post('/signup', async (req, res) => {
        const email = req.body.email;
        const plainPassword = req.body.password;
        const username = req.body.username;
        bcrypt.hash(plainPassword, 10, async (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('nope');
            }
            const user = new User({
                email, username, password: hashedPassword
            })
            await user.save()
            res.status(200).send('yoooo')
        });
    })
    .post('/login', async (req, res) => {
        try {
            const email = req.body.email
            const plainPassword = req.body.password
            const user = await User.findOne({ email })
            if (!user) {
                return res.json({ message: 'who dis?'})
            }
            const correctPassword = await bcrypt.compare(plainPassword, user.password)
            if (correctPassword) {

                const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });

                res.cookie('jwt', token, { httpOnly: true });

                res.json({ message: 'Login successful' });
            } else {
                res.json({ message: 'Get outta here' });
            }

        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .use((req, res) => {
        res.status(404).sendFile(__dirname + '/views/pages/404.html');
    })
    .listen(port)