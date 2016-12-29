'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
});

UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    _bcryptNodejs2.default.hash(user.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }

        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (toTest, next) {
    var user = this;
    _bcryptNodejs2.default.compare(toTest, user.password, function (err, isMatch) {
        if (err) return next(err);
        next(null, isMatch);
    });
};

UserSchema.methods.getUser = function () {
    var user = this;
    return {
        id: user._id,
        name: user.name,
        friends: user.friends
    };
};

var User = _mongoose2.default.model('User', UserSchema);

exports.default = User;