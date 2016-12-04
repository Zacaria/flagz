'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    'database': 'mongodb://localhost:27017/flagsDb',
    //Secret is used creating and verifing web tokens
    //Randomize ?
    'secret': 'secretPassToChangeAndToIgnore'
};
exports.default = config;