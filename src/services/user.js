import jwt from 'jsonwebtoken';
import User from '../models/user';
import {SECRET, INSERT, DELETE} from '../constants';
import {OP_NOT_FOUND, MIN_PW_LENGTH, USER_NOT_FOUND, BAD_PW, BAD_TOKEN} from '../constants/exceptions';

export const createUser = ({name, password}) =>
    new Promise((resolve, reject) => {
        if (password.length < 3) {
            return reject({
                exception: MIN_PW_LENGTH
            });
        }

        const user = new User({
            name,
            password
        });

        user.save((err, user) => {
            if (err) {
                return reject({
                    exception: err.errmsg
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
                    exception: USER_NOT_FOUND
                });

                user.comparePassword(password, (err, isMatch) => {
                    if (err) return reject({
                        exception: err
                    });
                    if (!isMatch) return reject({
                        exception: BAD_PW
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
                    exception: err
                });
            });
    });

export const validateToken = ({token}) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) return reject({
                exception: BAD_TOKEN
            });
            resolve(decoded);
        })
    });

export const find = () =>
    new Promise((resolve, reject) => {
        User.find({})
            .then((users) => resolve({users}))
            .catch(err => {
                reject({exception: err});
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
                if (!user) return reject({exception: USER_NOT_FOUND});
                if (!safe) return resolve({user});
                return resolve({user: user.getUser()});
            })
            .catch((err) => reject({exception: err}));
    });

export const patchFriends = ({user, operation, friendId}) =>
    new Promise((resolve) => {
        if (operation === INSERT) {
            user.addFriend(friendId);
        } else if (operation === DELETE) {
            user.removeFriend(friendId);
        } else {
            return reject({
                exception: OP_NOT_FOUND
            })
        }
        user.save()
            .then(() => {
                resolve({
                    user: user.getUser()
                });
            });
    });
