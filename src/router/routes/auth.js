'use strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import {PARAMS_ERROR, SECRET} from '../../constants';

const router = express.Router();

/**
 * @api {post} /signup Sign up
 * @apiDescription Create an account
 * @apiName Signup
 * @apiGroup User
 *
 * @apiParam name The user name
 * @apiParam password The password : bcrypt hashed
 */
router.post('/signup', (req, res) => {
    const user = new User({
        name    : req.body.name,
        password: req.body.password
    });

    user.save((err, user) => {
        if (err) {
            res.json({
                success: false,
                message: err.errmsg
            });
            return;
        }

        res.json({success: true, id: user._id});
    });
});

/**
 * @api {post} /signin Sign in
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

    if(!name || !password) {
        res.json({
            success: false,
            message: PARAMS_ERROR
        })
    }

    User.findOne({
        name
    }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'user not found'
            });
            return;
        }

        user.comparePassword(password, (err, isMatch) => {
            if(err) throw err;
            if(!isMatch) {
                req.json({
                    success: false,
                    message: 'wrong pw'
                });
                return;
            }

            const token = jwt.sign(user, config.secret, {
                expiresIn: '10h'
            });

            res.json({
                success: true,
                message: 'Enjoy your token',
                token
            });
        });
    });
});

router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(403).send({
        success: false,
        message: 'No token'
    });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.json({
            success: false,
            message: 'wrong token, authentify at /signin'
        });

        req.user = decoded._doc;
        next();
    })
});

export default router;