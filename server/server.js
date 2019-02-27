const express = require('express');
const app = express();
const PORT = 8080;

const url = `https://next.json-generator.com/api/json/get/EkzBIUWNL`;
const routes = require('./api/routes')(app, url);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});