const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

dotenv.config();

const {
    User,
    connect
} = require("./database");

connect();
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware to handle user authentication
app.use((req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return next();
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'no' });
        }

        req.user = decoded;
        next();
    });
});

// Routes
app
    .get('/', (req, res) => {
        res.render('pages', { title: 'home', user: req.user });
        console.log(req.user)
    })
    .get('/signup', (req, res) => {
        res.render('pages/signup');
    })
    .get('/login', (req, res) => {
        res.render('pages/login');
    })
    .get('/logout', (req, res) => {
        res.clearCookie('jwt');
        res.redirect('/');
    })
    .post('/signup', async (req, res) => {
        // Handle user signup
        const email = req.body.email;
        const plainPassword = req.body.password;
        const username = req.body.username;

        bcrypt.hash(plainPassword, 10, async (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('nope');
            }
            const user = new User({
                email,
                username,
                password: hashedPassword
            });
            await user.save();
            res.redirect('/');
        });
    })
    .post('/login', async (req, res) => {
        // Handle user login
        try {
            const usernameOrEmail = req.body.username;
            const plainPassword = req.body.password;
            const user = await User.findOne({
                  $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] 
            });
            if (!user) {
                return res.json({ message: 'who dis?' });
            }
            const correctPassword = await bcrypt.compare(plainPassword, user.password);
            if (correctPassword) {
                const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.cookie('jwt', token, { httpOnly: true });
                res.redirect('/');
            } else {
                res.json({ message: 'Get outta here' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .use((req, res) => {
        // 404 page
        res.status(404).sendFile(__dirname + '/views/pages/404.pug');
    })
    .listen(port);