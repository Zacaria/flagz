'use strict';

import mongoose from 'mongoose';
import config from '../config';

const init = () => {
    mongoose.connect(config.database);
    mongoose.Promise = global.Promise;
};

export default init;
