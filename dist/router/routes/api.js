'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


/**
 * @api {get} / Api Root
 * @apiName Root
 * @apiGroup API
 * @apiPermission Authentified
 */
router.get('/', function (req, res) {
    res.json({
        success: true,
        message: 'api root'
    });
});

router.use('/users', _users2.default);
router.use('/messages', _messages2.default);

exports.default = router;