const moment = require('moment');
const current_timestamp = moment().set('millisecond', 0).valueOf();
const current_time = moment();
const TotalBet = require('../models/total_pairs');

const all_pairs = [
    {first_coin: 'btc', second_coin: 'eth', pairs_order: 'first_pairs'},
    {first_coin: 'btc', second_coin: 'bnb', pairs_order: 'second_pairs'},
    {first_coin: 'eth', second_coin: 'bnb', pairs_order: 'third_pairs'}
];

if (current_time.minutes() % 5 == 0 && current_time.seconds() == 1) {
    console.log('*** GAME ROUNDS STARTED ***');
} else {
    console.log('STARTING GAME SHOOTS PRE', current_time.format('YYYY-MM-DD HH-mm-ss'));
    const first_pairs = new TotalBet(all_pairs[0])
    const second_pairs = new TotalBet(all_pairs[1]);
    const third_pairs = new TotalBet(all_pairs[2]);

    first_pairs.gettingTargetTickData(current_timestamp).then(data => {
        if (data.hasOwnProperty('round')) console.log(`btc/eth :: ${data.time} - ${data.round}`);
    }).catch(err => {
        console.log(`Error occurred with btc/eth pair at ${current_time}`);
    });

    second_pairs.gettingTargetTickData(current_timestamp).then(data => {
        if (data.hasOwnProperty('round')) console.log(`btc/bnb :: ${data.time} - ${data.round}`);
    }).catch(err => {
        console.log(`Error occurred with btc/bnb pair at ${current_time}`);
    });

    third_pairs.gettingTargetTickData(current_timestamp).then(data => {
        if (data.hasOwnProperty('round')) console.log(`eth/bnb :: ${data.time} - ${data.round}`);
    }).catch(err => {
        console.log(`Error occurred with eth/bnb pair at ${current_time.format('YYYY-MM-DD HH-mm-ss')}`);
    });

}

