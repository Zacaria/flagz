import jwt from 'jsonwebtoken';
import User from '../models/user';
import {PARAMS_ERROR, SECRET} from '../constants';

export const authenticate = ({name, password}) =>
    new Promise((resolve, reject) => {
        if (!name || !password) {
            return reject({
                message: PARAMS_ERROR
            });
        }

        User.findOne({name})
            .then(user => {
                if (!user) return reject({
                    message: 'user not found'
                });

                user.comparePassword(password, (err, isMatch) => {
                    if (err) return reject({
                        message: err
                    });
                    if (!isMatch) return reject({
                        message: 'wrong password'
                    });

                    const token = jwt.sign(user, SECRET, {
                        expiresIn: '10h'
                    });
                    return resolve({
                        message: 'Enjoy your token',
                        token
                    });
                });
            })
            .catch(err => {
                reject({
                    message: err
                });
            });
    });

export const validateToken = ({token}) =>
    new Promise((resolve, reject) => {

        if (!token) return reject({
            message: 'No token'
        });

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) return reject({
                message: 'wrong token, authentify at /signin'
            });
            resolve(decoded);
        })
    });