import express from 'express';
import mongoose from 'mongoose';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';

import config from './config';
import users from './api/users';

const app = express();
mongoose.connect(config.mongoUrl,  { useNewUrlParser: true } ,function(err) {
    if (err) return console.log('error while connecting to database ',err);
    console.log('connected to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use('/users',users);

let server  = app.listen(config.port,() => {
    console.log('server listening on port '+ server.address().port);
});