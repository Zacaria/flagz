'use strict';

import mongoose from 'mongoose';
import config from 'config';
//const config = require('./db');

const init = () => {
    
    // default to a 'localhost' configuration:
    let connection_string = config.DBHost;
    // if OPENSHIFT env variables are present, use the available connection info:
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
        connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }
    mongoose.connect(connection_string);
    mongoose.Promise = global.Promise;
};

export default init;
