'use strict';

import express from 'express';
import apiRoutes from './routes/api';
import authRoutes from './routes/auth';
import infoRoutes from './routes/info';
import User from '../models/user';
const app = express.Router();

/**
 * @api {get} / Flagz Root
 * @apiName Root
 * @apiDescription The rocking flagz api
 * @apiGroup API
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome guys, doc currently building !',
        doc: 'http://flagz-chtatarz.rhcloud.com/doc',
        version: process.env
    });
});

/**
 * @api {get} /health Request Instance health
 * @apiDescription Required by openshift to ensure the server is running
 * @apiName Health
 * @apiGroup Openshift
 */
app.get('/health', (req, res) => {
    res.writeHead(200);
    res.end();
});

app.use('/info', infoRoutes);
app.use('/', authRoutes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err  = new Error('Path not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error  : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error  : {}
    });
});

export default app;