'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MessageSchema =  new Schema({
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
    'public': {
        type: Boolean,
        default: true
    },
    visibility:{
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }]
    }
});

MessageSchema.methods.isVisible = (id) => {
    return this.public || [this.author, ...this.visibility].includes(id);
};

const Message = mongoose.model('Message', MessageSchema);

export default Message;