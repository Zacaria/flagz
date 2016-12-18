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

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _constant = require('../../config/constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
 * @api {post} /signup Sign up
 * @apiDescription Create an account
 * @apiName Signup
 * @apiGroup User
 *
 * @apiParam name The user name
 * @apiParam password The password : bcrypt hashed
 */
router.post('/signup', function (req, res) {
    var user = new _user2.default({
        name: req.body.name,
        password: req.body.password
    });

    user.save(function (err, user) {
        if (err) {
            res.json({
                success: false,
                message: err.errmsg
            });
            return;
        }

        res.json({ success: true, id: user._id });
    });
});

/**
 * @api {post} /signin Sign in
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
    var _req$body = req.body,
        name = _req$body.name,
        password = _req$body.password;


    if (!name || !password) {
        res.json({
            success: false,
            message: _constant.PARAMS_ERROR
        });
    }

    _user2.default.findOne({
        name: name
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'user not found'
            });
            return;
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) throw err;
            if (!isMatch) {
                req.json({
                    success: false,
                    message: 'wrong pw'
                });
                return;
            }

            var token = _jsonwebtoken2.default.sign(user, _config2.default.secret, {
                expiresIn: '10h'
            });

            res.json({
                success: true,
                message: 'Enjoy your token',
                token: token
            });
        });
    });
});

router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(403).send({
        success: false,
        message: 'No token'
    });

    _jsonwebtoken2.default.verify(token, _config2.default.secret, function (err, decoded) {
        if (err) return res.json({
            success: false,
            message: 'wrong token, authentify at /signin'
        });

        req.user = decoded._doc;
        next();
    });
});

exports.default = router;