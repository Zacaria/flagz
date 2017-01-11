'use strict';

import mongoose from 'mongoose';
import {USER_NOT_FOUND} from '../constants/exceptions';
import User from './user';
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author     : {
        type    : Schema.Types.ObjectId,
        ref     : 'User',
        required: true
    },
    text       : {
        type    : String,
        required: true
    },
    date       : {
        type   : Date,
        default: Date.now
    },
    location   : {
        type : [Number],
        index: '2dshpere'
    },
    orientation: {
        x: Number,
        y: Number,
        z: Number
    },
    restricted : {
        type   : Boolean,
        default: true
    },
    visibility : {
        type: [{
            type    : Schema.Types.ObjectId,
            ref     : 'User',
            required: true
        }]
    }
});

MessageSchema.pre('save', function (next) {
    let message = this;
    if (message.restricted) {
        User.findOne({_id: message.author})
            .then((user) => {
                message._doc.visibility = user.friends;
                next();
            }, err => {
                next({
                    success: false,
                    exception: USER_NOT_FOUND,
                    err    : err.errmsg
                });
            })
    } else {
        next();
    }
});

MessageSchema.methods.isVisible = function (id) {
    return this.restricted || [this.author, ...this.visibility].includes(id);
};

const Message = mongoose.model('Message', MessageSchema);

export default Message;