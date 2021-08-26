console.log(` ★★★ GAME CRAWLER RESTART ${process.env.NODE_ENV === 'PRODUCTION' ? process.env.NODE_ENV : 'DEVELOPMENT'} ★★★ `);

const schedule = require('node-schedule');
const shell = require('shelljs');
const dotenv = require('dotenv');
dotenv.config({path: process.env.NODE_ENV === 'PRODUCTION' ? './.env.prod' : './.env.dev'});


// TOTAL SUMMARY BETTING GAME RESULTS PREPARATION
schedule.scheduleJob('01,31 * * * * *', () => {
    shell.exec('node exec/total_bets.js', {async: true});
});


schedule.scheduleJob('35 04,09,14,19,24,29,34,39,44,49,54,59 * * * *', () => {
    shell.exec('node exec/total_bet_round.js', {async: true});
});

// UNDER OVER BETTING GAME RESULTS PREPARATION
schedule.scheduleJob('01,31 * * * * *', () => {
    //TODO: FORMING THE UNDER OVER BETTING HERE

    // shell.exec('node exec/game_btc.js', {async: true});
    // shell.exec('node exec/game_eth.js', {async: true});
    // shell.exec('node exec/game_bnb.js', {async: true});
});


// EXPRESS SERVER CONNECTION
const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const port = process.env.PORT ? process.env.PORT : 7007;
server.listen(port, function(){
    console.log(`Server is listening to ${port}`);
});





