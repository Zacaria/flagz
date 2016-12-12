'use strict';
import express from 'express';
const router = express.Router();
import User from '../../models/user';
import Message from '../../models/message';
import {EARTH_KM} from '../../config/constant';

router.get('/', (req, res) => {
    res.json({
        message: 'api root'
    });
});

router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;
        res.json(users);
    });
});

router.get('/messages', (req, res) => {
    Message.find({})
        .then((messages) => {
            res.json(messages);
        }, (err) => {
            res.json({
                success: false,
                err    : err.errmsg
            })
        });
});

router.get('/messages/@:center&r=:r', (req, res) => {
    const center = req.params.center.split(',').map(Number);
    const range = req.params.r;

    Message.find({
            location: {
                $geoWithin: {
                    $centerSphere: [center, range / EARTH_KM]
                }
            }
        })
        .then((messages) => {
            res.json({
                messages,
                success: true
            });
        }, (err) => {
            res.json({
                err: err.errmsg,
                success: false
            });
        });
});

router.post('/message', (req, res) => {
    const message = Message({
        author: req.body.author,
        text  : req.body.text,
        location: req.body.location.split(',').map(Number)
    });

    message
        .save()
        .then((message) => {
            console.log(message);
            res.json({success: true});
        }, (err) => {
            console.log(err);
            res.json({
                success: false,
                message: err.errmsg
            });
        });
});

export default router;