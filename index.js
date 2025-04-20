require('dotenv').config();
const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
const PaletteController = require('./controllers/PaletteController')
const UserController = require('./controllers/UserController')
const LoginController = require('./controllers/LoginController')
const paletteController = new PaletteController();
const userController = new UserController()
const loginController = new LoginController()

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    cookie: { maxAge: 30 * 60 * 10000 }
}))
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next()
    } else {       
        req.session.returnTo = req.originalUrl
        res.redirect('/login')
    }
}
app.use(express.static('public'));
app.use(express.json())

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');


// Home
app.get('/', (req, res) => {
    paletteController.generate(req, res);
});


// Palette CRUD
app.get('/palettes', isAuthenticated, (req, res) =>{
    paletteController.index(req, res);
});

app.get('/palette/:id', isAuthenticated, (req, res) =>{
    paletteController.show(req, res);
});

app.post('/palettes', isAuthenticated, (req, res) =>{
    paletteController.create(req, res);
});

app.post('/palette/:id', isAuthenticated, (req, res) =>{
    paletteController.update(req, res);
});

app.delete('/palette/:id', isAuthenticated, (req, res) =>{
    paletteController.delete(req, res);
});


// Templates
app.get('/templates', (req, res) =>{
    res.render('templates', { page: 'templates', showSettings: req.session.user != undefined });
});


// Login 
app.get('/login', (req, res) => {
    loginController.loginPage(req, res)
});

app.post('/login', (req, res) => {
    loginController.requestLogin(req, res)
});

app.get('/logout', (req, res) => {
    loginController.logout(req, res)
});


// User CRUD
app.get('/signup', (req, res) => {
    res.render('signup', { page: 'login', message: "", showSettings: req.session.user != undefined})
});

app.get('/settings', isAuthenticated, (req, res) => {
    userController.show(req, res);
});

app.post('/settings', isAuthenticated, (req, res) => {
    userController.update(req, res);
});

app.post('/signup', (req, res) => {
    userController.create(req, res);
});

app.delete('/settings', isAuthenticated, (req, res) => {
    userController.delete(req, res);
});

// Color Guess
app.get('/color_guess', (req, res) => {
    res.render("colorGuess", { page: 'colorGuess', showSettings: req.session.user != undefined });
});


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(port, () =>{
        console.log(`Server is running on port ${port}`);
    });
    console.log("Connected to database!");
})
.catch(() => {
    console.log("Connection failed!");
})