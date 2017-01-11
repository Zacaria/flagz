'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('../../services/user');

var userService = _interopRequireWildcard(_user3);

var _constants = require('../../constants');

var _exceptions = require('~/src/constants/exceptions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


/**
 * @api {get} /api/users show users
 * @apiDescription Shows all users
 * @apiName Users
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/', function (req, res) {
    userService.find().then(function (_ref) {
        var users = _ref.users;
        return res.json({
            success: true,
            users: users
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
 * @api {get} /api/users/:id show user
 * @apiDescription Shows one user
 * @apiName User
 * @apiGroup User
 * @apiPermission Authentified
 * @apiParam user to modify
 */
router.get('/:id', function (req, res) {
    userService.findOne({ id: req.params.id }).then(function (_ref3) {
        var user = _ref3.user;

        res.json({
            success: true,
            user: user
        });
    }).catch(function (_ref4) {
        var exception = _ref4.exception;

        res.json({
            success: false,
            exception: exception
        });
    });
});

/**
 * @api {patch} /api/users/friends update friend list
 * @apiDescription Add or remove a friend to the current user
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
    var _req$body = req.body,
        operation = _req$body.op,
        friendId = _req$body.id;

    if (operation !== _constants.INSERT && operation !== _constants.DELETE) {
        return res.json({
            success: false,
            exception: _exceptions.OP_NOT_FOUND
        });
    }

    userService.findOne({ id: friendId }).then(function (friend) {
        return userService.findOne({ id: req.user }, false);
    }).then(function (_ref5) {
        var user = _ref5.user;
        return userService.patchFriends({ user: user, operation: operation, friendId: friendId });
    }).then(function (_ref6) {
        var user = _ref6.user;

        res.json({
            success: true,
            user: user
        });
    }).catch(function (_ref7) {
        var exception = _ref7.exception;

        res.json({
            success: false,
            exception: exception
        });
    });
});

exports.default = router;