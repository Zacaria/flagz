'use strict';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import router from './router';
import mongoInit from './config/database';

const app = express();

mongoInit();

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());

app.use('/doc', express.static(path.join(__dirname + '/../doc')));
app.use('/', router);

export default app;
