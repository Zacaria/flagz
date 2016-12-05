'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _sysInfo = require('../../config/sys-info');

var _message = require('../../models/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
    res.json({
        message: 'infos root'
    });
});

router.get('/gen', function (req, res) {
    res.json((0, _sysInfo.gen)());
});

router.get('/poll', function (req, res) {
    res.json((0, _sysInfo.poll)());
});

exports.default = router;