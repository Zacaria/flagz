'use strict';

import crypto from 'crypto';

export const genSalt = (length) =>
    crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);

export const sha512 = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt,
        passwordHash: value
    };
};


