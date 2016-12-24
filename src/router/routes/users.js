'use strict';
import express from 'express';
const router = express.Router();
import User from '../../models/user';
import {INSERT, DELETE, PARAMS_ERROR} from '../../constants';

/**
 * @api {get} /users show users
 * @apiDescription Shows all users
 * @apiName Users
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;
        res.json(users);
    });
});

/**
 * @api {get} /users/:id show user
 * @apiDescription Shows one user
 * @apiName User
 * @apiGroup User
 * @apiPermission Authentified
 */
router.get('/:id', (req, res) => {
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
 * @api {patch} /users/friends update friend list
 * @apiDescription Add or remove a friend
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
    User.findOne({
            _id: req.user
        })
        .then((user) => {
            const {op: operation, id: friend} = req.body;
            const indexOfFriend = user.friends.indexOf(friend);
            if (operation === INSERT) {
                if (indexOfFriend == -1)
                    user.friends = [...user.friends, friend];
            } else if (operation === DELETE) {
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

export default router;
