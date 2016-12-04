'use strict';
import express from 'express';
import jwt from 'jsonwebtoken';

import User from '../../models/user';

import config from '../../config';

const router = express.Router();

router.post('/signup', (req, res) => {
    const user = new User({
        name    : req.body.name,
        password: req.body.password,
        admin   : false
    });

    user.save((err, user) => {
        if (err) {
            res.json({
                success: false,
                message: err.errmsg
            });
            return;
        }


        console.log('created', user);
        res.json({success: true});
    });
});

router.post('/signin', (req, res) => {
    User.findOne({
        name: req.body.name
    }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'user not found'
            });
            return;
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
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
                token  : token
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

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.json({
            success: false,
            message: 'wrong token, authentify at /signin'
        });

        req.decoded = decoded;
        next();
    })
});

export default router;