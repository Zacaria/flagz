'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const message = mongoose.model('Message', new Schema({
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
    position: {
        n: Number,
        e: Number,
        h: Number
    },
    orientation: {
        x: Number,
        y: Number,
        z: Number
    }
}));

export default message;