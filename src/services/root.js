import gitRev from 'git-rev';

export const websiteRoot = ({protocol, host}) =>
    new Promise((resolve) => {
        gitRev.tag(tag => {
            resolve({
                message : 'Welcome guys, doc currently building !',
                version : tag,
                doc     : 'http://flagz-chtatarz.rhcloud.com/doc',
                signup  : protocol + '://' + host + '/api/signup',
                signin  : protocol + '://' + host + '/api/signin',
                users   : protocol + '://' + host + '/api/users',
                messages: protocol + '://' + host + '/api/messages'
            });
        });
    });