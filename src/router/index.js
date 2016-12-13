'use strict';

import express from 'express';
import apiRoutes from './routes/api';
import authRoutes from './routes/auth';
import infoRoutes from './routes/info';
import User from '../models/user';
const app = express.Router();

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome, doc incoming !'
    });
});

//Openshift required
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