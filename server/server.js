require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');


//view engine setup
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})


app.use(express.json())
app.use(cors())
app.use(express.static('public'))

//require signup and login from userController.js
const { signup, login } = require('./userController')

//require modules from controller.js
const { getCards, createCards, deleteCard, updateCard, getOneCard, favoriteCard, getFavoriteCards } = require('./controller.js');
const { log } = require('console');



// DEV
// app.post('/api/seed', seed)

// AUTH endpoint
app.post('/api/login', login)
app.post('/api/signUp', signup)

// FLASHCARDS endpoints
app.get('/api/flashcards', getCards)
app.get('/api/flashcard/:id', getOneCard)
app.get('/api/favorites/', getFavoriteCards)
app.post('/api/flashcards', createCards)
app.delete('/api/flashcards/:id', deleteCard)
app.put('/api/flashcards/:id', updateCard)
app.put('/api/flashcard/:id', favoriteCard)


const port = 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

