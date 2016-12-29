'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.find = undefined;

var _message = require('../models/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var find = exports.find = function find() {
    return new Promise(function (resolve, reject) {
        _message2.default.find({}).then(function (messages) {
            resolve({ messages: messages });
        }).catch(function (err) {
            reject({
                info: err
            });
        });
    });
};