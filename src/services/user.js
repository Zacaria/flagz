import jwt from 'jsonwebtoken';
import User from '../models/user';
import {PARAMS_ERROR, SECRET, INSERT, DELETE} from '../constants';

export const createUser = ({name, password}) =>
    new Promise((resolve, reject) => {
        if (!name || !password) {
            return reject({
                info: PARAMS_ERROR
            });
        }

        const user = new User({
            name,
            password
        });

        user.save((err, user) => {
            if (err) {
                return reject({
                    info: err.errmsg
                });
            }

            resolve({id: user._id});
        });
    });


export const authenticate = ({name, password}) =>
    new Promise((resolve, reject) => {
        User.findOne({name})
            .then(user => {
                if (!user) return reject({
                    info: 'user not found'
                });

                user.comparePassword(password, (err, isMatch) => {
                    if (err) return reject({
                        info: err
                    });
                    if (!isMatch) return reject({
                        info: 'wrong password'
                    });

                    const token = jwt.sign(user, SECRET, {
                        expiresIn: '10h'
                    });
                    return resolve({
                        info: 'Enjoy your token',
                        token
                    });
                });
            })
            .catch(err => {
                reject({
                    info: err
                });
            });
    });

export const validateToken = ({token}) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) return reject({
                info: 'wrong token, authentify at /signin'
            });
            resolve(decoded);
        })
    });

export const find = () =>
    new Promise((resolve, reject) => {
        User.find({})
            .then((users) => resolve({users}))
            .catch(err => {
                reject({info: err});
            });
    });

/**
 *
 * @param id
 * @param safe object is stripped from password and mongo prototype
 */
export const findOne = ({id}, safe = true) =>
    new Promise((resolve, reject) => {
        User.findOne({_id: id})
            .then((user) => {
                if (!user) throw 'user not found';
                if (!safe) resolve({user});
                resolve({user: user.getUser()})
            })
            .catch((err) => reject({info: err}));
    });

export const patchFriends = ({user, operation, friendId}) =>
    new Promise((resolve) => {
        const indexOfFriend = user.friends.indexOf(friendId);

        if (operation === INSERT) {
            if (indexOfFriend == -1)
                user.friends = [...user.friends, friendId];
        } else if (operation === DELETE) {
            user.friends.splice(indexOfFriend, 1);
        }
        user.save()
            .then(() => {
                resolve({
                    user: user.getUser()
                });
            });
    });
