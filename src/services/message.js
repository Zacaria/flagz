import Message from '../models/message';

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
                author:  user
            })
            .then((messages) => {
                resolve({messages});
            }, (err) => {
                reject({info: err})
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
