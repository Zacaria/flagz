import Message from '../models/message';

export const find = () =>
    new Promise((resolve, reject) => {
        Message.find({})
            .then(messages => {
                resolve({messages});
            })
            .catch(err => {
                reject({
                    info: err
                })
            });
    });
