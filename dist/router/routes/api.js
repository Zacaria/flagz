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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
 * @api {get} /users show users
 * @apiDescription Shows all users
 * @apiName Users
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
 * @api {get} /users/:id show user
 * @apiDescription Shows one user
 * @apiName User
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/users/:id', function (req, res) {
    _user2.default.findOne({
        _id: { $eq: req.params.id }
    }).then(function (user) {
        res.json(user.getUser());
    }, function (err) {
        res.json({
            success: false,
            err: err.errmsg
        });
    });
});

/**
 * @api {patch} /users/friends update friend list
 * @apiDescription Add or remove a friend
 * @apiName UserPatch update friend
 * @apiGroup User
 * @apiPermission Authentified
 *
 * @apiParam user to modify
 * @apiParamExample {json} user to operate:
 *   {
 *      "op": "insert | delete"
 *      "id": "userId"
 *   }
 */
router.patch('/users/friends', function (req, res) {
    _user2.default.findOne({
        _id: req.user
    }).then(function (user) {
        var _req$body = req.body,
            operation = _req$body.op,
            friend = _req$body.id;

        var indexOfFriend = user.friends.indexOf(friend);
        if (operation === _constant.INSERT) {
            if (indexOfFriend == -1) user.friends = [].concat(_toConsumableArray(user.friends), [friend]);
        } else if (operation) {
            user.friends.splice(indexOfFriend, 1);
        }
        user.save().then(function (user) {
            res.json({
                success: true,
                user: user
            });
        });
    }, function (err) {
        res.json({
            success: false,
            err: err.errmsg
        });
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
 * @api {get} /messages/:id Show by id
 * @apiDescription Shows all messages of one user
 * @apiName Message user
 * @apiGroup Message
 * @apiPermission Authentified
 */
router.get('/messages/:id', function (req, res) {
    _message2.default.find({
        author: {
            $eq: req.params.id
        }
    }).then(function (messages) {
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
 * @api {post} /messages Create
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
router.post('/messages', function (req, res) {
    var _req$body2 = req.body,
        text = _req$body2.text,
        orientation = _req$body2.orientation,
        restricted = _req$body2.restricted,
        location = _req$body2.location;


    if (!location || !text) {
        res.json({
            success: false,
            message: _constant.PARAMS_ERROR
        });
    }

    var message = (0, _message2.default)({
        author: req.user,
        text: text,
        location: location.split(',').map(Number),
        orientation: orientation,
        restricted: restricted
    });

    message.save().then(function (message) {
        console.log(message);
        res.json({
            success: true,
            created: message
        });
    }, function (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.errmsg
        });
    });
});

exports.default = router;