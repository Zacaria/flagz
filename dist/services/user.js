'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateToken = exports.authenticate = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authenticate = exports.authenticate = function authenticate(_ref) {
    var name = _ref.name,
        password = _ref.password;
    return new Promise(function (resolve, reject) {
        if (!name || !password) {
            return reject({
                message: _constants.PARAMS_ERROR
            });
        }

        _user2.default.findOne({ name: name }).then(function (user) {
            if (!user) return reject({
                message: 'user not found'
            });

            user.comparePassword(password, function (err, isMatch) {
                if (err) return reject({
                    message: err
                });
                if (!isMatch) return reject({
                    message: 'wrong password'
                });

                var token = _jsonwebtoken2.default.sign(user, _constants.SECRET, {
                    expiresIn: '10h'
                });
                return resolve({
                    message: 'Enjoy your token',
                    token: token
                });
            });
        }).catch(function (err) {
            reject({
                message: err
            });
        });
    });
};

var validateToken = exports.validateToken = function validateToken(_ref2) {
    var token = _ref2.token;
    return new Promise(function (resolve, reject) {

        if (!token) return reject({
            message: 'No token'
        });

        _jsonwebtoken2.default.verify(token, _constants.SECRET, function (err, decoded) {
            if (err) return reject({
                message: 'wrong token, authentify at /signin'
            });
            resolve(decoded);
        });
    });
};