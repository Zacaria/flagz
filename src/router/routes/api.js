'use strict';
import express from 'express';
const router = express.Router();
import User from '../../models/user';
import Message from '../../models/message';
import {EARTH_KM} from '../../config/constant';

/**
 * @api {get} / Api Root
 * @apiName Root
 * @apiGroup API
 * @apiPermission Authentified
 */
router.get('/', (req, res) => {
    res.json({
        message: 'api root'
    });
});

/**
 * @api {get} /users
 * @apiDescription Shows all users
 * @apiName Health
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;
        res.json(users);
    });
});

/**
 * @api {get} /messages Show all
 * @apiDescription Shows all messages
 * @apiName Message
 * @apiGroup Message
 * @apiPermission Authentified
 */
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

/**
 * @api {get} /messages/:id Show by id
 * @apiDescription Shows all messages
 * @apiName Message
 * @apiGroup Message
 * @apiPermission Authentified
 */
router.get('/messages/:id', (req, res, next) => {
    if(req.params.id === 'toto') {
        console.log('choppé');
        next();
    }

    Message.find({
        author: {
            $eq: req.params.id
        }
    })
        .then((messages) => {
            res.json(messages);
        }, (err) => {
            res.json({
                success: false,
                err    : err.errmsg
            })
        });
});

/**
 * @api {get} /messages/@:center&r=:r Aggregate within sphere
 * @apiDescription Shows all messages within a circular range
 * @apiName Message search
 * @apiGroup Message
 * @apiPermission Authentified
 *
 * @apiParam {String} center position of the center the circular range. ex : @48.7861405,2.3274749
 * @apiParam {Number} r range of the circular range
 */
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

/**
 * @api {post} /message Create
 * @apiDescription create a message
 * @apiName Message creation
 * @apiGroup Message
 * @apiPermission Authentified
 *
 * @apiParam {String} center position of the center the circular range. ex : @48.7861405,2.3274749
 * @apiParam {Number} r range of the circular range
 */
router.post('/message', (req, res) => {
    const message = Message({
        author: req.body.author,
        text  : req.body.text,
        location: req.body.location.split(',').map(Number),
        orientation: req.body.orientation
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