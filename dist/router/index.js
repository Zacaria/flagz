'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('./routes/api');

var _api2 = _interopRequireDefault(_api);

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _info = require('./routes/info');

var _info2 = _interopRequireDefault(_info);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _express2.default.Router();

app.get('/', function (req, res) {
    res.json({
        message: 'Welcome guys, doc incoming !'
    });
});

//Openshift required
app.get('/health', function (req, res) {
    res.writeHead(200);
    res.end();
});

app.use('/info', _info2.default);
app.use('/', _auth2.default);
app.use('/api', _api2.default);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Path not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

exports.default = app;