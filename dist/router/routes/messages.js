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

var _message3 = require('../../services/message');

var messageService = _interopRequireWildcard(_message3);

var _exceptions = require('../../constants/exceptions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


/**
 * @api {get} /api/messages Show all
 * @apiDescription Shows all messages
 * @apiName Message
 * @apiGroup Message
 * @apiPermission Authentified
 */
//TODO : paginate !
router.get('/', function (req, res) {
    messageService.find().then(function (_ref) {
        var messages = _ref.messages;
        return res.json({
            success: true,
            messages: messages
        });
    }).catch(function (_ref2) {
        var exception = _ref2.exception;
        return res.json({
            success: false,
            exception: exception
        });
    });
});

/**
 * @api {post} /api/messages Create
 * @apiDescription create a message
 * @apiName Message creation
 * @apiGroup Message
 * @apiPermission Authentified
 *
 * @apiParam {String} message text
 * @apiParam {String} location position of the message. ex : @48.7861405,2.3274749
 * @apiParam {String} orientation of the phone
 * @apiParamExample {json} orientation not yet fully thinked
 *      {
 *          x: 2,
 *          y: 3,
 *          z: 4
 *      }
 * @apiParam {String} [restricted=false] true|false if true, the message is visible only by the author's friends
 */
router.post('/', function (req, res) {
    var _req$body = req.body,
        text = _req$body.text,
        orientation = _req$body.orientation,
        restricted = _req$body.restricted,
        location = _req$body.location;


    if (!location || !text || !location.trim() || !text.trim()) {
        return res.json({
            success: false,
            exception: _exceptions.PARAMS_ERROR
        });
    }

    messageService.addMessage({
        author: req.user,
        text: text,
        location: location,
        orientation: orientation,
        restricted: restricted
    }).then(function (_ref3) {
        var created = _ref3.created;
        return res.json({
            success: true,
            created: created
        });
    }).catch(function (_ref4) {
        var exception = _ref4.exception;
        return res.json({
            success: false,
            exception: exception
        });
    });
});

/**
 * @api {get} /api/messages/me Show my messages
 * @apiDescription Shows all messages of connected user
 * @apiName Message user
 * @apiGroup Message
 * @apiPermission Authentified
 */
router.get('/me', function (req, res) {
    var user = req.user;

    messageService.findMe({ user: user }).then(function (_ref5) {
        var messages = _ref5.messages;
        return res.json({
            success: true,
            messages: messages
        });
    }).catch(function (_ref6) {
        var exception = _ref6.exception;
        return res.json({
            success: false,
            exception: exception
        });
    });
});

/**
 * @api {get} /api/messages/@:center&r=:r Aggregate within sphere
 * @apiDescription Shows all messages within a circular range
 * @apiName Message search
 * @apiGroup Message
 * @apiPermission Authentified
 *
 * @apiParam {String} center position of the center the circular range. ex : @48.7861405,2.3274749
 * @apiParam {Number} [r=200] range of the circular range in meters
 */
router.get(['/@:center&r=:r', '/@:center'], function (req, res) {
    // Transforms '48.7861405,2.3274749' into [48.7861405, 2.3274749]
    var center = req.params.center.split(',').map(Number);
    var range = req.params.r || 200;
    if (!center || !Array.isArray(center) || center.length != 2) {
        return res.json({
            success: false,
            exception: _exceptions.PARAMS_ERROR
        });
    }

    messageService.findInRange({
        user: req.user,
        center: center,
        range: range
    }).then(function (_ref7) {
        var messages = _ref7.messages;
        return res.json({
            success: true,
            messages: messages
        });
    }).catch(function (_ref8) {
        var exception = _ref8.exception;
        return res.json({
            success: false,
            exception: exception
        });
    });
});

exports.default = router;