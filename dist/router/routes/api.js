'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _message = require('../../models/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


router.get('/', function (req, res) {
    res.json({
        message: 'api root'
    });
});

router.get('/users', function (req, res) {
    _user2.default.find({}, function (err, users) {
        if (err) throw err;
        res.json(users);
    });
});

router.get('/messages', function (req, res) {
    _message2.default.find({}).then(function (messages) {
        res.json(messages);
    }, function (err) {
        res.json({
            success: false,
            err: err.errmsg
        });
    });
});

router.get('/messages', function (req, res) {
    _message2.default.find({}).then(function (messages) {
        res.json(messages);
    }, function (err) {
        res.json({
            success: false,
            err: err.errmsg
        });
    });
});

router.post('/message', function (req, res) {
    var message = (0, _message2.default)({
        author: req.body.author,
        text: req.body.text
    });

    message.save().then(function (message) {
        console.log(message);
        res.json({ success: true });
    }, function (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.errmsg
        });
    });
});

exports.default = router;