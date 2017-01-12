'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _sysInfo = require('../../constants/sys-info');

var _infos = require('../../constants/infos');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
 * @api {get} / Infos root
 * @apiName Info
 * @apiGroup Info
 * @apiSampleRequest /
 */
router.get('/', function (req, res) {
    res.json({
        info: _infos.INFO_ROOT
    });
});

/**
 * @api {get} /gen Request Instance information
 * @apiName Generation
 * @apiGroup Info
 * @apiSampleRequest /
 */
router.get('/gen', function (req, res) {
    res.json((0, _sysInfo.gen)());
});

/**
 * @api {get} /poll Request Poll information
 * @apiName Poll
 * @apiGroup Info
 * @apiSampleRequest /
 */
router.get('/poll', function (req, res) {
    res.json((0, _sysInfo.poll)());
});

exports.default = router;