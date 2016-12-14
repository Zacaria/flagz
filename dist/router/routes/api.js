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

var _constant = require('../../config/constant');

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
        message: 'api root'
    });
});

/**
 * @api {get} /users
 * @apiDescription Shows all users
 * @apiName Health
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/users', function (req, res) {
    _user2.default.find({}, function (err, users) {
        if (err) throw err;
        res.json(users);
    });
});

/**
 * @api {get} /messages Show all
 * @apiDescription Shows all messages
 * @apiName Message
 * @apiGroup Message
 * @apiPermission Authentified
 */
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

/**
 * @api {get} /messages/@:center&r=:r Aggregate within sphere
 * @apiDescription Shows all messages within a circular range
 * @apiName Message search
 * @apiGroup Message
 * @apiPermission Authentified
 *
 * @apiParam {String} center position of the center the circular range. ex : @48.7861405,2.3274749
 * @apiParam {Number} r range of the circular range
 */
router.get('/messages/@:center&r=:r', function (req, res) {
    var center = req.params.center.split(',').map(Number);
    var range = req.params.r;

    _message2.default.find({
        location: {
            $geoWithin: {
                $centerSphere: [center, range / _constant.EARTH_KM]
            }
        }
    }).then(function (messages) {
        res.json({
            messages: messages,
            success: true
        });
    }, function (err) {
        res.json({
            err: err.errmsg,
            success: false
        });
    });
});

/**
 * @api {post} /message Create
 * @apiDescription create a message
 * @apiName Message creation
 * @apiGroup Message
 * @apiPermission Authentified
 *
 * @apiParam {String} center position of the center the circular range. ex : @48.7861405,2.3274749
 * @apiParam {Number} r range of the circular range
 */
router.post('/message', function (req, res) {
    var message = (0, _message2.default)({
        author: req.body.author,
        text: req.body.text,
        location: req.body.location.split(',').map(Number),
        orientation: req.body.orientation
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