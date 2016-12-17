'use strict';

import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name    : {
        type    : String,
        required: true,
        unique  : true
    },
    password: {
        type    : String,
        required: true
    },
    admin   : Boolean
});

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) {
            console.log(err);
            return next(err);
        }

        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (toTest, next) {
    const user = this;
    bcrypt.compare(toTest, user.password, (err, isMatch) => {
        if (err) return next(err);
        next(null, isMatch);
    });
};

const User = mongoose.model('User', UserSchema);

export default User;