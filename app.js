const express = require('express');
const router = require('./router_results');

const app = express();
app.use(router);


module.exports = app;




