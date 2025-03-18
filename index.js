require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PaletteController = require('./controllers/PaletteController')
const paletteController = new PaletteController();

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json())
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    paletteController.generate(req, res);
})

app.get('/api/palettes', (req, res) =>{
    paletteController.index(req, res);
})

app.get('/api/palette/:id', async (req, res) =>{
    paletteController.show(req, res);
})

app.post('/api/palettes', async (req, res) =>{
    paletteController.create(req, res);
})

app.put('/api/palette/:id', async (req, res) =>{
    paletteController.update(req, res);
})

app.delete('/api/palette/:id', (req, res) =>{
    paletteController.delete(req, res);
})



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