var Stack = require('./stack.js'),
    Card = require('./card.js');

global.gajus = global.gajus || {};

global.gajus.Swing = {
    Stack: Stack,
    Card: Card
};

module.exports = {
    Stack: Stack,
    Card: Card
};