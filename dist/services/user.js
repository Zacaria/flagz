'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.patchFriends = exports.findOne = exports.find = exports.validateToken = exports.authenticate = exports.createUser = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _constants = require('../constants');

var _exceptions = require('../constants/exceptions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUser = exports.createUser = function createUser(_ref) {
    var name = _ref.name,
        password = _ref.password;
    return new Promise(function (resolve, reject) {
        if (password.length < 3) {
            return reject({
                exception: _exceptions.MIN_PW_LENGTH
            });
        }

        var user = new _user2.default({
            name: name,
            password: password
        });

        user.save(function (err, user) {
            if (err) {
                return reject({
                    exception: err.errmsg
                });
            }

            resolve({ id: user._id });
        });
    });
};

var authenticate = exports.authenticate = function authenticate(_ref2) {
    var name = _ref2.name,
        password = _ref2.password;
    return new Promise(function (resolve, reject) {
        _user2.default.findOne({ name: name }).then(function (user) {
            if (!user) return reject({
                exception: _exceptions.USER_NOT_FOUND
            });

            user.comparePassword(password, function (err, isMatch) {
                if (err) return reject({
                    exception: err
                });
                if (!isMatch) return reject({
                    exception: _exceptions.BAD_PW
                });

                var token = _jsonwebtoken2.default.sign(user, _constants.SECRET, {
                    expiresIn: '10h'
                });
                return resolve({
                    info: 'Enjoy your token',
                    token: token
                });
            });
        }).catch(function (err) {
            reject({
                exception: err
            });
        });
    });
};

var validateToken = exports.validateToken = function validateToken(_ref3) {
    var token = _ref3.token;
    return new Promise(function (resolve, reject) {
        _jsonwebtoken2.default.verify(token, _constants.SECRET, function (err, decoded) {
            if (err) return reject({
                exception: _exceptions.BAD_TOKEN
            });
            resolve(decoded);
        });
    });
};

var find = exports.find = function find() {
    return new Promise(function (resolve, reject) {
        _user2.default.find({}).then(function (users) {
            return resolve({ users: users });
        }).catch(function (err) {
            reject({ exception: err });
        });
    });
};

/**
 *
 * @param id
 * @param safe object is stripped from password and mongo prototype
 */
var findOne = exports.findOne = function findOne(_ref4) {
    var id = _ref4.id;
    var safe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    return new Promise(function (resolve, reject) {
        _user2.default.findOne({ _id: id }).then(function (user) {
            if (!user) return reject({ exception: _exceptions.USER_NOT_FOUND });
            if (!safe) return resolve({ user: user });
            return resolve({ user: user.getUser() });
        }).catch(function (err) {
            return reject({ exception: err });
        });
    });
};

var patchFriends = exports.patchFriends = function patchFriends(_ref5) {
    var user = _ref5.user,
        operation = _ref5.operation,
        friendId = _ref5.friendId;
    return new Promise(function (resolve) {
        if (operation === _constants.INSERT) {
            user.addFriend(friendId);
        } else if (operation === _constants.DELETE) {
            user.removeFriend(friendId);
        } else {
            return reject({
                exception: _exceptions.OP_NOT_FOUND
            });
        }
        user.save().then(function () {
            resolve({
                user: user.getUser()
            });
        });
    });
};