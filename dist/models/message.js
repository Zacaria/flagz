'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _exceptions = require('../constants/exceptions');

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Schema = _mongoose2.default.Schema;

var MessageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    location: {
        type: [Number],
        index: '2dshpere'
    },
    orientation: {
        x: Number,
        y: Number,
        z: Number
    },
    restricted: {
        type: Boolean,
        default: true
    },
    visibility: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }]
    }
});

MessageSchema.pre('save', function (next) {
    var message = this;
    if (message.restricted) {
        _user2.default.findOne({ _id: message.author }).then(function (user) {
            message._doc.visibility = user.friends;
            next();
        }, function (err) {
            next({
                success: false,
                exception: _exceptions.USER_NOT_FOUND,
                err: err.errmsg
            });
        });
    } else {
        next();
    }
});

MessageSchema.methods.isVisible = function (id) {
    return this.restricted || [this.author].concat(_toConsumableArray(this.visibility)).includes(id);
};

var Message = _mongoose2.default.model('Message', MessageSchema);

exports.default = Message;