'use strict';
import express from 'express';
const router = express.Router();
import User from '../../models/user';
import * as userService from '../../services/user';
import {INSERT, DELETE} from '../../constants';
import {OP_NOT_FOUND} from '../../constants/exceptions';

/**
 * @api {get} /api/users show users
 * @apiDescription Shows all users
 * @apiName Users
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/', (req, res) => {
    userService.find()
        .then(({users}) => res.json({
            success: true,
            users
        }))
        .catch(({exception}) => res.json({
            success: false,
            exception
        }));
});

/**
 * @api {get} /api/users/:id show user
 * @apiDescription Shows one user
 * @apiName User
 * @apiGroup User
 * @apiPermission Authentified
 * @apiParam user to modify
 */
router.get('/:id', (req, res) => {
    userService.findOne({id: req.params.id})
        .then(({user}) => {
            res.json({
                success: true,
                user
            });
        })
        .catch(({exception}) => {
            res.json({
                success: false,
                exception
            })
        });
});

/**
 * @api {patch} /api/users/friends update friend list
 * @apiDescription Add or remove a friend to the current user
 * @apiName UserPatch update friend
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
router.patch('/friends', (req, res) => {
    const {op: operation, id: friendId} = req.body;
    if (operation !== INSERT && operation !== DELETE) {
        return res.json({
            success: false,
            exception: OP_NOT_FOUND
        });
    }

    userService.findOne({id: friendId})
        .then(friend => userService.findOne({id: req.user}, false))
        .then(({user}) => userService.patchFriends({user, operation, friendId}))
        .then(({user}) => {
            res.json({
                success: true,
                user
            });
        })
        .catch(({exception}) => {
            res.json({
                success: false,
                exception
            })
        });
});

export default router;
