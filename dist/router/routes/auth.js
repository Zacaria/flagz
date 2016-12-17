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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/signup', function (req, res) {
    var user = new _user2.default({
        name: req.body.name,
        password: req.body.password,
        admin: false
    });

    user.save(function (err, user) {
        if (err) {
            res.json({
                success: false,
                message: err.errmsg
            });
            return;
        }

        console.log('created', user);
        res.json({ success: true, id: user._id });
    });
});

router.post('/signin', function (req, res) {
    _user2.default.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'user not found'
            });
            return;
        }

        user.comparePassword(req.body.password, function (err, isMatch) {
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

        req.decoded = decoded;
        next();
    });
});

exports.default = router;