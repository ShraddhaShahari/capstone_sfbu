require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

console.log('Starting server...');

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('GET / request received');
  res.sendFile(__dirname + '/index.html');
});

https.createServer(options, app).listen(4000, () => {
  console.log('Server is running on https://localhost:4000');
});
