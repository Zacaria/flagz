'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _constants = require('../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var router = _express2.default.Router();


/**
 * @api {get} /users show users
 * @apiDescription Shows all users
 * @apiName Users
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/', function (req, res) {
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
router.get('/:id', function (req, res) {
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
router.patch('/friends', function (req, res) {
    _user2.default.findOne({
        _id: req.user
    }).then(function (user) {
        var _req$body = req.body,
            operation = _req$body.op,
            friend = _req$body.id;

        var indexOfFriend = user.friends.indexOf(friend);
        if (operation === _constants.INSERT) {
            if (indexOfFriend == -1) user.friends = [].concat(_toConsumableArray(user.friends), [friend]);
        } else if (operation === _constants.DELETE) {
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

exports.default = router;