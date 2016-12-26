'use strict';
import express from 'express';
const router = express.Router();
import User from '../../models/user';
import Message from '../../models/message';
import {EARTH_KM, PARAMS_ERROR} from '../../constants';

/**
 * @api {get} /messages Show all
 * @apiDescription Shows all messages
 * @apiName Message
 * @apiGroup Message
 * @apiPermission Authentified
 */
//TODO : paginate !
router.get('/', (req, res) => {
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
 * @api {get} /messages/me Show my messages
 * @apiDescription Shows all messages of connected user
 * @apiName Message user
 * @apiGroup Message
 * @apiPermission Authentified
 */
router.get('/me', (req, res) => {
    console.log('hey');
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
 * @apiParam {Number} [r=200] range of the circular range in meters
 */
router.get('/@:center&r=:r', (req, res) => {
    const center = req.params.center.split(',').map(Number);
    const range  = req.params.r || 200;
    console.log('hey');
    if (!center) {
        res.json({
            success: false,
            message: PARAMS_ERROR
        });
    }

    Message.find({
            $or     : [
                {
                    restricted: {
                        $eq: false
                    }
                },
                {
                    $or: [{
                        author: req.user
                    }, {
                        friends: req.user
                    }]
                }],
            location: {
                $geoWithin: {
                    $centerSphere: [center, range / EARTH_KM]
                }
            }
        })
        .
        then((messages) => {
            res.json({
                messages,
                success: true
            });
        }, (err) => {
            res.json({
                err    : err.message,
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
router.post('/', (req, res) => {
    const {text, orientation, restricted, location} = req.body;

    if (!location || !text) {
        res.json({
            success: false,
            message: PARAMS_ERROR
        })
    }

    const message = Message({
        author  : req.user,
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
