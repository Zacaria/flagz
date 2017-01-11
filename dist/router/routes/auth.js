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

var _exceptions = require('../../constants/exceptions');

var _user3 = require('../../services/user');

var userService = _interopRequireWildcard(_user3);

var _exceptions2 = require('~/src/constants/exceptions');

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
 * @apiParam password The password : bcrypt hashed, min length : 3
 */
router.post('/signup', function (req, res) {
    var _req$body = req.body,
        name = _req$body.name,
        password = _req$body.password;

    if (!name || !password || !name.trim() || !password.trim()) {
        return res.json({
            success: false,
            exception: _exceptions.PARAMS_ERROR
        });
    }
    userService.createUser({ name: name, password: password }).then(function (_ref) {
        var id = _ref.id;
        return res.json({
            success: true,
            id: id
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

    if (!name || !password || !name.trim() || !password.trim()) {
        return res.json({
            success: false,
            exception: _exceptions.PARAMS_ERROR
        });
    }
    userService.authenticate({ name: name, password: password }).then(function (_ref3) {
        var token = _ref3.token,
            info = _ref3.info;
        return res.json({
            success: true,
            info: info,
            token: token
        });
    }).catch(function (_ref4) {
        var exception = _ref4.exception;
        return res.json({
            success: false,
            exception: exception
        });
    });
});

router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(403).json({
        success: false,
        exception: _exceptions2.BAD_TOKEN
    });

    userService.validateToken({ token: token }).then(function (decoded) {
        req.user = decoded._doc;
        next();
    }).catch(function (_ref5) {
        var exception = _ref5.exception;
        return res.status(403).json({
            success: false,
            exception: exception
        });
    });
});

exports.default = router;