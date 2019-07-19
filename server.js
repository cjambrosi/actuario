'use strict';

const express = require('express');
let port = process.env.PORT || 8088;
let app = express();

app.use(express.static(__dirname + '/'));

app.listen(port);