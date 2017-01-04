import Message from '../models/message';
import {EARTH_KM} from '../constants';

export const find = () =>
    new Promise((resolve, reject) => {
        Message.find({})
            .then(messages => {
                resolve({messages});
            })
            .catch(err => {
                reject({info: err})
            });
    });

export const findMe = ({user}) =>
    new Promise((resolve, reject) => {
        Message.find({
                author: user
            })
            .then((messages) => {
                resolve({messages});
            }, (err) => {
                reject({info: err})
            });
    });

export const findInRange = ({user, center, range}) =>
    new Promise((resolve, reject) => {
        Message.find({
                $or: [
                    {
                        restricted: false
                    },
                    {
                        $or: [{
                            author: user
                        }, {
                            visibility: user
                        }]
                    }],
                location: {
                    $geoWithin: {
                        $centerSphere: [center, range / EARTH_KM]
                    }
                }
            })
            .then((messages) => {
                resolve({
                    messages
                });
            }, (err) => {
                reject({
                    info: err
                });
            });
    });

export const addMessage = ({author, text, orientation, location, restricted}) =>
    new Promise((resolve, reject) => {
        const message = Message({
            author,
            text,
            location: location.split(',').map(Number),
            orientation,
            restricted
        });

        message
            .save()
            .then((message) => {
                resolve({
                    created: message
                });
            }, (err) => {
                reject({
                    info: err
                });
            });

    });
