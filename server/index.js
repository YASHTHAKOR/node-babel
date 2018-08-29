import express from 'express';

import config from './config';

const app = express();

let server  = app.listen(config.port,() => {
    console.log('server listening on port '+ server.address().port);
});