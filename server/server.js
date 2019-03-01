const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 8080;

const url = `https://next.json-generator.com/api/json/get/EkzBIUWNL`;
const routes = require('./api/routes')(app, url);

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(express.static(path.join(__dirname, '../public/')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/product.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});