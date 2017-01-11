'use strict';
import express from 'express';
import {PARAMS_ERROR} from '../../constants/exceptions';
import * as userService from '../../services/user';
import {BAD_TOKEN} from '../../constants/exceptions';

const router = express.Router();

/**
 * @api {post} /api/signup Sign up
 * @apiDescription Create an account
 * @apiName Signup
 * @apiGroup User
 *
 * @apiParam name The user name
 * @apiParam password The password : bcrypt hashed, min length : 3
 */
router.post('/signup', (req, res) => {
    const {name, password} = req.body;
    if (!name || !password || !name.trim() || !password.trim()) {
        return res.json({
            success: false,
            exception: PARAMS_ERROR
        });
    }
    userService.createUser({name, password})
        .then(({id}) => res.json({
            success: true,
            id
        }))
        .catch(({exception}) => res.json({
            success: false,
            exception
        }));

});

/**
 * @api {post} /api/signin Sign in
 * @apiDescription Log in
 * @apiName Login
 * @apiGroup User
 *
 * @apiParam name The user name
 * @apiParam password The password
 *
 * @apiSuccess (200) {String} token to use for further authentication, expires in 10 hours
 */
router.post('/signin', (req, res) => {
    const {name, password} = req.body;
    if (!name|| !password || !name.trim() || !password.trim()) {
        return res.json({
            success: false,
            exception: PARAMS_ERROR
        });
    }
    userService.authenticate({name, password})
        .then(({token, info}) => res.json({
            success: true,
            info,
            token
        }))
        .catch(({exception}) => res.json({
            success: false,
            exception
        }));
});

router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(403).json({
        success: false,
        exception: BAD_TOKEN
    });

    userService.validateToken({token})
        .then((decoded) => {
            req.user = decoded._doc;
            next();
        })
        .catch(({exception}) => res.status(403).json({
            success: false,
            exception
        }));
});

export default router;