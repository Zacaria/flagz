'use strict';

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const SALT_WORK_FACTOR = 10;
const Schema           = mongoose.Schema;

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

UserSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
});

UserSchema.methods.comparePassword = function(toTest, next) {
    const user = this;
    bcrypt.compare(toTest, user.password, (err, isMatch) => {
        if(err) return next(err);
        next(null, isMatch);
    });
};

const User = mongoose.model('User', UserSchema);

export default User;