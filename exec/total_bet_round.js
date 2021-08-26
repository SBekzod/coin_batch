const moment = require('moment');
const TotalWinner = require('../models/total_winner');

console.log(` *** FINDING ROUND WINNER ${moment().format('YYYY-MM-DD hh:mm:ss')} *** `, )

const all_pairs = [
    {first_coin: 'btc', second_coin: 'eth', pairs_order: 'first_pairs'},
    {first_coin: 'btc', second_coin: 'bnb', pairs_order: 'second_pairs'},
    {first_coin: 'eth', second_coin: 'bnb', pairs_order: 'third_pairs'}
];

let cur_round = moment().hour() * 12 + Math.floor(moment().minutes() / 5) + 1;
const first_pairs = new TotalWinner(all_pairs[0], cur_round)
const second_pairs = new TotalWinner(all_pairs[1], cur_round);
const third_pairs = new TotalWinner(all_pairs[2], cur_round);

first_pairs.getShootsSetWinner().then(data => {
    if (data) console.log('btc/eth :: winner has been set');
}).catch(err => {
    console.log('Error getShootsSetWinner: ', err);
});

second_pairs.getShootsSetWinner().then(data => {
    if (data) console.log('btc/bnb :: winner has been set');
}).catch(err => {
    console.log('Error getShootsSetWinner: ', err);
});

third_pairs.getShootsSetWinner().then(data => {
    if (data) console.log('eth/bnb :: winner has been set');
}).catch(err => {
    console.log('Error getShootsSetWinner: ', err);
});

