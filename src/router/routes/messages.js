'use strict';
import express from 'express';
const router = express.Router();
import User from '../../models/user';
import Message from '../../models/message';
import * as messageService from '../../services/message';
import {PARAMS_ERROR} from '../../constants/infos';

/**
 * @api {get} /api/messages Show all
 * @apiDescription Shows all messages
 * @apiName Message
 * @apiGroup Message
 * @apiPermission Authentified
 */
//TODO : paginate !
router.get('/', (req, res) => {
    messageService.find()
    .then(({messages}) => res.json({
        success: true,
        messages
    }))
    .catch(({info}) => res.json({
        success: false,
        info
    }));
});

/**
 * @api {post} /api/messages Create
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

    if (!location || !text || !location.trim() || !text.trim()) {
        res.json({
            success: false,
            info: PARAMS_ERROR
        })
    }

    messageService.addMessage({
            author: req.user,
            text,
            location,
            orientation,
            restricted
        })
        .then(({created}) => res.json({
            success: true,
            created
        }))
        .catch(({info}) => res.json({
            success: false,
            info
        }));
});

/**
 * @api {get} /api/messages/me Show my messages
 * @apiDescription Shows all messages of connected user
 * @apiName Message user
 * @apiGroup Message
 * @apiPermission Authentified
 */
router.get('/me', (req, res) => {
    const {user} = req;
    messageService.findMe({user})
    .then(({messages}) => res.json({
        success: true,
        messages
    }))
    .catch(({info}) => res.json({
        success: false,
        info
    }));
});

/**
 * @api {get} /api/messages/@:center&r=:r Aggregate within sphere
 * @apiDescription Shows all messages within a circular range
 * @apiName Message search
 * @apiGroup Message
 * @apiPermission Authentified
 *
 * @apiParam {String} center position of the center the circular range. ex : @48.7861405,2.3274749
 * @apiParam {Number} [r=200] range of the circular range in meters
 */
router.get(['/@:center&r=:r', '/@:center'], (req, res) => {
    // Transforms '48.7861405,2.3274749' into [48.7861405, 2.3274749]
    const center = req.params.center.split(',').map(Number);
    const range  = req.params.r || 200;
    if (!center || !Array.isArray(center) || center.length != 2) {
        return res.json({
            success: false,
            info: PARAMS_ERROR
        });
    }

    messageService.findInRange({
        user: req.user,
        center,
        range
    })
    .then(({messages}) => res.json({
        success: true,
        messages
    }))
    .catch(({info}) => res.json({
        success: false,
        info
    }));
});

export default router;
