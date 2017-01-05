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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
        default: []
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

UserSchema.methods.addFriend = function (friend) {
    var user = this;
    var indexOfFriend = user.friends.indexOf(friend);
    if (indexOfFriend == -1) {
        user.friends = [].concat(_toConsumableArray(user.friends), [friend]);
    }
    return user;
};

UserSchema.methods.removeFriend = function (friend) {
    var user = this;
    var indexOfFriend = user.friends.indexOf(friend);
    user.friends.splice(indexOfFriend, 1);
    return user;
};

var User = _mongoose2.default.model('User', UserSchema);

exports.default = User;