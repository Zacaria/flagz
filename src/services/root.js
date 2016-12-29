import pjson from '~/package.json';

export const websiteRoot = ({protocol, host}) => ({
    info : 'Welcome guys',
    version : pjson.version,
    doc     : protocol + '://' + host + '/doc',
    db      : protocol + '://' + host + '/rockmongo',
    signup  : protocol + '://' + host + '/api/signup',
    signin  : protocol + '://' + host + '/api/signin',
    users   : protocol + '://' + host + '/api/users',
    messages: protocol + '://' + host + '/api/messages'
});
