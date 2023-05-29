const express = require('express')
const app = express()
const port = 3000


app.set('view engine', 'ejs')

const user = {
    firstName: 'tim',
    lastName: 'cook',
}


// app.use('/', express.static('views/pages'))
app
    .get('/', (req, res) => {
        res.render("pages/index", {
            user
        })
    })
    .use((req, res) => {
        res.status(404).sendFile(__dirname + '/views/pages/404.html');
    })
    .listen(port)