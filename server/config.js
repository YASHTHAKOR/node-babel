let result = require('dotenv').config();
let env = {
    default: {
        port: 3000
    },
    production: {
        port:8080
    }

};

module.exports =  env[process.env.environment]|| env['default'];