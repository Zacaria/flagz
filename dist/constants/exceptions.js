'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Those messages are the one in res.json.message
 */

var PARAMS_ERROR = exports.PARAMS_ERROR = 'Not enough parameters check the doc !';
var USER_NOT_FOUND = exports.USER_NOT_FOUND = 'user not found';
var BAD_PW = exports.BAD_PW = 'Wrong password';
var BAD_TOKEN = exports.BAD_TOKEN = 'Wrong token, authentify at /signin';
var OP_NOT_FOUND = exports.OP_NOT_FOUND = 'Unrecognized operation [insert | delete]';
var MIN_PW_LENGTH = exports.MIN_PW_LENGTH = 'Minimum password length is 3';