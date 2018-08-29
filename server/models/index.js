import fs from 'fs';

let models = {};


fs.readdirSync(__dirname)
    .filter((file) =>  {
        return  (file !== "index.js");
    })
    .forEach((file) =>  {
        let name = file.replace('.js', '');
        models[name] = require('./' + file);
    });

module.exports = models;