require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');
const { SERVER_PORT } = process.env

//view engine setup
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})


app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))


//require signup and login from userController.js
const { signup, login } = require('./userController')

//require modules from controller.js
const { seed, getCards, createCards, deleteCard, updateCard, getOneCard, favoriteCard, getFavoriteCards } = require('./controller.js');



// DEV
app.post('/api/seed', seed)

// AUTH endpoint
app.post('/api/login', login)
app.post('/api/signup', signup)

// FLASHCARDS endpoints
app.get('/api/flashcards', getCards)
app.get('/api/flashcard/:id', getOneCard)
app.get('/api/favorites/', getFavoriteCards)
app.post('/api/flashcards', createCards)
app.delete('/api/flashcards/:id', deleteCard)
app.put('/api/flashcards/:id', updateCard)
app.put('/api/flashcard/:id', favoriteCard)



app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))

