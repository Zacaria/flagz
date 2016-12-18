'use strict';
import express from 'express';
const router = express.Router();
import User from '../../models/user';
import Message from '../../models/message';
import {EARTH_KM, INSERT, DELETE} from '../../config/constant';

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
 * @apiName Users
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
 * @api {get} /users/:id
 * @apiDescription Shows one user
 * @apiName User
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/users/:id', (req, res) => {
    User.findOne({
            _id: {$eq: req.params.id}
        })
        .then((user) => {
            res.json(user.getUser());
        }, (err) => {
            res.json({
                success: false,
                err    : err.errmsg
            })
        });
});

/**
 * @api {patch} /users/friends
 * @apiDescription Add or remove a friend
 * @apiName User
 * @apiGroup User
 * @apiPermission Authentified
 *
 * @apiParam user to modify
 * @apiParamExample {json} user to operate:
 *   {
 *      "op": "insert | delete"
 *      "id": "userId"
 *   }
 */
router.patch('/users/friends', (req, res) => {
    User.findOne({
            _id: req.user
        })
        .then((user) => {
            const {op: operation, id: friend} = req.body;
            const indexOfFriend = user.friends.indexOf(friend);
            if (operation === INSERT) {
                if (indexOfFriend == -1)
                    user.friends = [...user.friends, friend];
            } else if (operation) {
                user.friends.splice(indexOfFriend, 1);
            }
            user.save()
                .then((user) => {
                    res.json({
                        success: true,
                        user
                    });
                });
        }, (err) => {
            res.json({
                success: false,
                err    : err.errmsg
            })
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
 * @apiDescription Shows all messages of one user
 * @apiName Message user
 * @apiGroup Message
 * @apiPermission Authentified
 */
router.get('/messages/:id', (req, res) => {
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
    const range  = req.params.r;

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
 * @api {post} /messages Create
 * @apiDescription create a message
 * @apiName Message creation
 * @apiGroup Message
 * @apiPermission Authentified
 *
 * @apiParam {String} message text
 * @apiParam {String} location position of the message. ex : @48.7861405,2.3274749
 * @apiParam {String} orientation of the phone
 * @apiParamExample {json} orientation not yet fully thinked
 *      {
 *          x: 2,
 *          y: 3,
 *          z: 4
 *      }
 * @apiParam {String} [restricted=false] true|false if true, the message is visible only by the author's friends
 */
router.post('/messages', (req, res) => {
    const {text, orientation, restricted, location} = req.body;

    if (!location || !text) {
        res.json({
            success: false,
            message: 'not enough parameters check the doc !'
        })
    }

    const message = Message({
        author: req.user,
        text,
        location: location.split(',').map(Number),
        orientation,
        restricted
    });

    message
        .save()
        .then((message) => {
            console.log(message);
            res.json({
                success: true,
                created: message
            });
        }, (err) => {
            console.log(err);
            res.json({
                success: false,
                message: err.errmsg
            });
        });
});

export default router;