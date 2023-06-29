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
    Movie,
    connect
} = require("./database");

connect();
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Middleware om gebruikersauthenticatie af te handelen
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

// Functie om films op te halen van de watchlist van een gebruiker
async function getWatchlistMovies(userId) {
    try {
        // Verbinding maken met de MongoDB
        // Zoek de gebruiker op basis van het ID en haal de filmgegevens op voor de watchlist
        const user = await User.findById(userId).populate('watchlist');

        if (!user) {
            throw new Error('User not found');
        }

        // Geef de films in de watchlist van de gebruiker terug
        return user.watchlist;
    } catch (error) {
        console.error('Error retrieving watchlist movies:', error);
        throw error;
    }
}

// Routes
app
    .get('/', async (req, res) => {
        try {
            const movies = await Movie.find();
            res.render('pages/index', { title: 'home', user: req.user, movies });
        } catch (error) {
            console.error('Error fetching movies:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .get('/signup', (req, res) => {
        res.render('pages/signup');
    })
    .get('/logout', (req, res) => {
        res.clearCookie('jwt');
        res.redirect('/');
    })
    .get('/addmovie', (req, res) => {
        res.render('pages/addmovie');
    })
    .get('/list', async (req, res) => {
        const watchlistMovies = await getWatchlistMovies(req.user.id);
        res.render('pages/list', { watchlistMovies });
    })
    .post('/signup', async (req, res) => {
        // Gebruikersregistratie afhandelen
        const email = req.body.email;
        const plainPassword = req.body.password;
        const username = req.body.username;

        try {
            const existingUser = await User.findOne({
                $or: [{ email: email }, { username: username }]
            });

            if (existingUser) {
                return res.json({ message: 'User already exists' });
            }

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

                const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.cookie('jwt', token, { httpOnly: true });
                res.redirect('/');
            });
        } catch (error) {
            console.error('Error signing up:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .post('/addmovie', async (req, res) => {
        const title = req.body.title;
        const director = req.body.director;
        const releaseYear = req.body.releaseYear;
        const rating = req.body.rating;
        const userId = req.user.id;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const movie = new Movie({
                title,
                director,
                releaseYear,
                rating,
                username: user.username
            });

            await movie.save();
            res.redirect('/');
        } catch (error) {
            console.error('Error adding movie:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .post('/login', async (req, res) => {
        // Gebruikersaanmelding afhandelen
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
    .post('/list', async (req, res) => {
        const movieId = req.body.movieId;
        const userId = req.user.id;

        console.log({
            movieId, userId
        });

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }

            user.watchlist.push(movie);
            // user.watchlist = [ ...user.watchlist, movie]
            await user.save();

            res.sendStatus(200); // Stuur een successtatuscode
        } catch (error) {
            console.error('Error adding movie to watchlist:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .use((req, res) => {
        // 404-pagina
        res.status(404).render('pages/404');
    })
    .listen(port);