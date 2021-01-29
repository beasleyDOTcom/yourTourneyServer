'use strict';
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Circular = require('./assets/circularlyLinkedList.js');
const Deck = require('./assets/deckOfCards.js');

function shufflePlayers(players){
    const getIndex = () => Math.floor(Math.random()*players.length)
    const swap = (arr, a, b) => {
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
        return arr;
    }
    for(let i = 0; i < players.length; i++){
        swap(players, i, getIndex())
    }
    return players;
}


io.on('connection', (socket) => {
    console.log('a user has connected: ', socket.id);

    socket.emit('connected', socket.id);

    socket.on('new-game', async (payload) => {
        const participants = new Circular();
        const deck = new Deck();
        let players = await shufflePlayers(payload.participants)
        players.forEach(person => {
            participants.addPlayer(person)
            console.log(person)
        }) // need to manage decks of cards
        payload.cards.forEach(card => deck.add(card))
        console.log(deck)
        await deck.shuffle();
        console.log(deck)
    })



    socket.on('disconnect', () => {
        console.log(socket.id, ' just disconnected')
    })
})

http.listen(3000, () => {
    console.log('listening on: ', 3000)
})