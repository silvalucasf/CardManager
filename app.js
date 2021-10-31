const cards = require('./cardsMapper.js')
console.log(cards.getAllCards());

const express = require('express');

const app = express();

app.get('/cards', (req, res) => {
    res.send('OK');
});

app.listen(3000);