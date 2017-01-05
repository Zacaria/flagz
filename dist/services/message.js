'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addMessage = exports.findInRange = exports.findMe = exports.find = undefined;

var _message = require('../models/message');

var _message2 = _interopRequireDefault(_message);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var find = exports.find = function find() {
    return new Promise(function (resolve, reject) {
        _message2.default.find({}).then(function (messages) {
            resolve({ messages: messages });
        }).catch(function (err) {
            reject({ info: err });
        });
    });
};

var findMe = exports.findMe = function findMe(_ref) {
    var user = _ref.user;
    return new Promise(function (resolve, reject) {
        _message2.default.find({
            author: user
        }).then(function (messages) {
            resolve({ messages: messages });
        }, function (err) {
            reject({ info: err });
        });
    });
};

var findInRange = exports.findInRange = function findInRange(_ref2) {
    var user = _ref2.user,
        center = _ref2.center,
        range = _ref2.range;
    return new Promise(function (resolve, reject) {
        _message2.default.find({
            $or: [{
                restricted: false
            }, {
                $or: [{
                    author: user
                }, {
                    visibility: user
                }]
            }],
            location: {
                $geoWithin: {
                    $centerSphere: [center, range / _constants.EARTH_KM]
                }
            }
        }).then(function (messages) {
            resolve({
                messages: messages
            });
        }, function (err) {
            reject({
                info: err
            });
        });
    });
};

var addMessage = exports.addMessage = function addMessage(_ref3) {
    var author = _ref3.author,
        text = _ref3.text,
        orientation = _ref3.orientation,
        location = _ref3.location,
        restricted = _ref3.restricted;
    return new Promise(function (resolve, reject) {
        var message = (0, _message2.default)({
            author: author,
            text: text,
            location: location.split(',').map(Number),
            orientation: orientation,
            restricted: restricted
        });

        message.save().then(function (message) {
            resolve({
                created: message
            });
        }, function (err) {
            reject({
                info: err
            });
        });
    });
};