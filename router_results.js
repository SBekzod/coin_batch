const express = require('express');
const router = express.Router();
const MySql = require('./models/mysql2');
const db = new  MySql();

router.get('/', (req, res) => { 
    res.end('connection succeed on batching server');
});

router.get('/api/t-shoots/btc-eth/:quantity', (req, res) => {
    let quantity = req.params['quantity'] ? req.params['quantity'] : 100 ;
    db.getAllShoots('first_pairs', quantity).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

router.get('/api/t-shoots/btc-bnb/:quantity', (req, res) => {
    let quantity = req.params['quantity'] ? req.params['quantity'] : 100 ;
    db.getAllShoots('second_pairs', quantity).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

router.get('/api/t-shoots/eth-bnb/:quantity', (req, res) => {
    let quantity = req.params['quantity'] ? req.params['quantity'] : 100 ;
    db.getAllShoots('third_pairs', quantity).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});


router.get('/api/t-rounds/btc-eth/:quantity', (req, res) => {
    let quantity = req.params['quantity'] ? req.params['quantity'] : 100 ;
    db.getAllTotalWins('first_pairs', quantity).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

router.get('/api/t-rounds/btc-eth/:quantity', (req, res) => {
    let quantity = req.params['quantity'] ? req.params['quantity'] : 100 ;
    db.getAllTotalWins('second_pairs', quantity).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

router.get('/api/t-rounds/btc-eth/:quantity', (req, res) => {
    let quantity = req.params['quantity'] ? req.params['quantity'] : 100 ;
    db.getAllTotalWins('third_pairs', quantity).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});




module.exports = router;