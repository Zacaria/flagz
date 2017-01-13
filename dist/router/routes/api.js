'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _infos = require('../../constants/infos');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


router.use('/', _auth2.default);
/**
 * @api {get} / Api Root
 * @apiName Root
 * @apiGroup API
 * @apiPermission Authentified
 */
router.get('/', function (req, res) {
    res.json({
        success: true,
        info: _infos.API_ROOT
    });
});

router.use('/users', _users2.default);
router.use('/messages', _messages2.default);

exports.default = router;