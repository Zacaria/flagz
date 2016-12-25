'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.websiteRoot = undefined;

var _gitRev = require('git-rev');

var _gitRev2 = _interopRequireDefault(_gitRev);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var websiteRoot = exports.websiteRoot = function websiteRoot(_ref) {
    var protocol = _ref.protocol,
        host = _ref.host;
    return new Promise(function (resolve) {
        _gitRev2.default.tag(function (tag) {
            resolve({
                message: 'Welcome guys, doc currently building !',
                version: tag,
                doc: 'http://flagz-chtatarz.rhcloud.com/doc',
                signup: protocol + '://' + host + '/api/signup',
                signin: protocol + '://' + host + '/api/signin',
                users: protocol + '://' + host + '/api/users',
                messages: protocol + '://' + host + '/api/messages'
            });
        });
    });
};