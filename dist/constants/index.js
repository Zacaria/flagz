'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
//Secret is used creating and verifing web tokens
//Randomize ?
var SECRET = exports.SECRET = 'secretPassToChangeAndToIgnore';
var EARTH_KM = exports.EARTH_KM = 6378.1;

/**
 * This constants refer to the patch operations
 * @type {string}
 */

var INSERT = exports.INSERT = 'insert';
var DELETE = exports.DELETE = 'delete';