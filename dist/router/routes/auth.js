'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _constants = require('../../constants');

var _user3 = require('../../services/user');

var userService = _interopRequireWildcard(_user3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
 * @api {post} /api/signup Sign up
 * @apiDescription Create an account
 * @apiName Signup
 * @apiGroup User
 *
 * @apiParam name The user name
 * @apiParam password The password : bcrypt hashed
 */
router.post('/signup', function (req, res) {
    var _req$body = req.body,
        name = _req$body.name,
        password = _req$body.password;

    userService.createUser({ name: name, password: password }).then(function (_ref) {
        var id = _ref.id;
        return res.json({
            success: true,
            id: id
        });
    }).catch(function (_ref2) {
        var message = _ref2.message;
        return res.json({
            success: false,
            message: message
        });
    });
});

/**
 * @api {post} /api/signin Sign in
 * @apiDescription Log in
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam name The user name
 * @apiParam password The password
 *
 * @apiSuccess (200) {String} token to use for further authentication, expires in 10 hours
 */
router.post('/signin', function (req, res) {
    var _req$body2 = req.body,
        name = _req$body2.name,
        password = _req$body2.password;

    if (!name || !password) {
        return res.json({
            success: false,
            message: _constants.PARAMS_ERROR
        });
    }
    userService.authenticate({ name: name, password: password }).then(function (_ref3) {
        var token = _ref3.token,
            message = _ref3.message;
        return res.json({
            success: true,
            message: message,
            token: token
        });
    }).catch(function (_ref4) {
        var message = _ref4.message;
        return res.json({
            success: false,
            message: message
        });
    });
});

router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(403).json({
        success: false,
        message: 'No token'
    });

    userService.validateToken({ token: token }).then(function (decoded) {
        req.user = decoded._doc;
        next();
    }).catch(function (_ref5) {
        var message = _ref5.message;
        return res.status(403).json({
            success: false,
            message: message
        });
    });
});

exports.default = router;