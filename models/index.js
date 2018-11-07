const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const models = {};
const mongoose = require('mongoose');
const CONFIG = require('../config/config');
const consola = require('consola')

if(CONFIG.db_host != ''){
    let files = fs
      .readdirSync(__dirname)
      .filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
      .forEach((file) => {
        var filename = file.split('.')[0];
        var model_name = filename.charAt(0).toUpperCase() + filename.slice(1);
        models[model_name] = require('./'+file);
    });

    mongoose.Promise = global.Promise; //set mongo up to use promises
    const mongo_location = 'mongodb://'+CONFIG.db_host+':'+CONFIG.db_port+'/'+CONFIG.db_name;

    mongoose.connect(mongo_location, { useNewUrlParser: true }).catch((err)=>{
        consola.fatal('*** Can`t Not Connect to Mongo Server:', mongo_location)
    })

    let db = mongoose.connection;
    module.exports = db;
    db.once('open', ()=>{
        consola.success('Connected to mongo at '+mongo_location);
    })
    db.on('error', (error)=>{
        consola.fatal("error", error);
    })
    // End of Mongoose Setup
}else{
    consola.error("No Mongo Credentials Given");
}

module.exports = models;
