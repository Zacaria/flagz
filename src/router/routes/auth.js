'use strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import {PARAMS_ERROR, SECRET} from '../../constants';
import * as userService from '../../services/user';

const router = express.Router();

/**
 * @api {post} /api/signup Sign up
 * @apiDescription Create an account
 * @apiName Signup
 * @apiGroup User
 *
 * @apiParam name The user name
 * @apiParam password The password : bcrypt hashed
 */
router.post('/signup', (req, res) => {
    const {name, password} = req.body;
    userService.createUser({name, password})
        .then(({id}) => res.json({
            success: true,
            id
        }))
        .catch(({message}) => res.json({
            success: false,
            message
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
    if (!name || !password) {
        return res.json({
            success: false,
            message: PARAMS_ERROR
        });
    }
    userService.authenticate({name, password})
        .then(({token, message}) => res.json({
            success: true,
            message,
            token
        }))
        .catch(({message}) => res.json({
            success: false,
            message
        }));
});

router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) res.status(403).json({
        success: false,
        message: 'No token'
    });

    userService.validateToken({token})
        .then((decoded) => {
            req.user = decoded._doc;
            next();
        })
        .catch(({message}) => res.status(403).json({
            success: false,
            message
        }));
});

export default router;