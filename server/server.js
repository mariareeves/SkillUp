require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')


const { seed, getCards, createCards, deleteCard, updateCard } = require('./controller.js')

app.use(express.json())
app.use(cors())




// DEV
app.post('/api/seed', seed)

// FLASHCARDS
app.get('/api/flashcards', getCards)
app.post('/api/flashcards', createCards)
app.delete('/api/flashcards/:id', deleteCard)
app.put('/api/flashcards/:id', updateCard)


const port = 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})