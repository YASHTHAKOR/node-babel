let result = require('dotenv').config();
let env = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGOURL,
    jwtSecret: process.env.JWTSECRET
};

module.exports =  env;