process.env.NODE_ENV = 'test';

import User from '~/src/models/user';
import Message from '~/src/models/message';
import * as userService from '~/src/services/user';
import * as messageService from '~/src/services/message';
import * as routePaths from '~/src/constants/routes';
import * as infos from '~/src/constants/infos';

import chai from'chai';
import chaiHttp from 'chai-http';
import server from '~/src/app';
const should = chai.should();

chai.use(chaiHttp);


describe('Message', () => {
    const user = new User({
        name    : 'admin',
        password: 'admin',
        friends : []
    });

    const friend = new User({
        name    : 'friend',
        password: 'friend',
        friends : []
    });

    const unrelated = new User({
        name    : 'unrelated',
        password: 'unrelated',
        friends : []
    });

    const publicMessage = {
        text       : 'coucou',
        orientation: {
            x: 2, y: 3, z: 7
        },
        restricted : false,
        location   : '48.7861405,2.3274749'
    };

    const privateMessage = {
        text       : 'coucou',
        orientation: {
            x: 2, y: 3, z: 7
        },
        restricted : true,
        location   : '48.7861405,2.3274748'
    };

    const invalidEmptyFieldsMessage = {
        text       : 'coucou',
        orientation: {
            x: 2, y: 3, z: 7
        },
        restricted : true,
        location   : ''
    };

    const invalidNoFieldsMessage = {
        text       : 'coucou',
        orientation: {
            x: 2, y: 3, z: 7
        },
        restricted : true,
        location   : ''
    };

    //filled in before hook
    let tokenAuthUser;
    let tokenAuthFriend;
    let tokenAuthUnrelated;
    let currentUser;

    before((done) => { //Before each test we empty the database
        User.remove({})
            .then(() => unrelated.save())
            .then(() => friend.save())
            .then(dbFriend => user.addFriend(dbFriend))
            .then(() => user.save())
            .then((u) => currentUser = u)
            .then(() => userService.authenticate({
                name    : 'admin',
                password: 'admin'
            }))
            .then(({token}) => {
                tokenAuthUser = token;
            })
            .then(() => userService.authenticate({
                name    : 'friend',
                password: 'friend'
            }))
            .then(({token}) => {
                tokenAuthFriend = token;
            })
            .then(() => userService.authenticate({
                name    : 'unrelated',
                password: 'unrelated'
            }))
            .then(({token}) => {
                tokenAuthUnrelated = token;
            })
            .then(() => done())
    });

    after((done) => { //After each test we empty the database
        User.remove({})
            .then(() => Message.remove({}))
            .then(() => done());
    });

    describe('/GET messages', () => {
        it('should not GET messages without api token', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_MESSAGES)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('info').eql('No token');
                    done();
                });
        });

        it('should not GET messages with bad token', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_MESSAGES + '?token=0')
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('info');
                    done();
                });
        });

        it('should GET messages', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_MESSAGES)
                .set('x-access-token', tokenAuthUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('messages');
                    res.body.messages.should.be.a('array');
                    done();
                });
        });
    });

    describe('/GET messages/me', () => {
        it('should get an empty array of messages', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_MESSAGES_ME)
                .set('x-access-token', tokenAuthUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('messages');
                    res.body.messages.should.be.a('array').eql([]);
                    done();
                });
        });

        //TODO : add Test when there are messages

        describe('when there are messages', () => {
            before(done => {
                messageService
                    .addMessage({
                        ...publicMessage,
                        author: currentUser._id.toString()
                    })
                    .then(() => messageService.addMessage({
                        ...privateMessage,
                        author: currentUser._id.toString()
                    }))
                    .then(() => done())
                    .catch(e => console.log('error', e));
            });

            after(done => {
                Message.remove({})
                    .then(() => done());
            });

            it('should return the two messages of current user', (done) => {
                const friendsList = currentUser.friends.map((f) => f._id.toString());
                chai.request(server)
                    .get(routePaths.ROUTE_MESSAGES_ME)
                    .set('x-access-token', tokenAuthUser)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('messages');
                        res.body.messages.should.be.a('array');
                        res.body.messages.length.should.be.eql(2);
                        res.body.messages[0].should.have.property('author').eql(currentUser._id.toString());
                        res.body.messages[0].should.have.property('text').eql(publicMessage.text);
                        res.body.messages[0].should.have.property('visibility').eql([]);
                        res.body.messages[0].should.have.property('restricted').eql(publicMessage.restricted);
                        res.body.messages[0].should.have.property('orientation').eql(publicMessage.orientation);
                        res.body.messages[0].should.have.property('location').eql(publicMessage.location.split(',').map(Number));
                        res.body.messages[0].should.have.property('date');
                        res.body.messages[1].should.have.property('author').eql(currentUser._id.toString());
                        res.body.messages[1].should.have.property('text').eql(privateMessage.text);
                        res.body.messages[1].should.have.property('visibility').eql(friendsList);
                        res.body.messages[1].should.have.property('restricted').eql(privateMessage.restricted);
                        res.body.messages[1].should.have.property('orientation').eql(privateMessage.orientation);
                        res.body.messages[1].should.have.property('location').eql(privateMessage.location.split(',').map(Number));
                        res.body.messages[1].should.have.property('date');
                        done();
                    });
            });
        });
    });

    describe('/POST messages', () => {

        describe('with invalid params', () => {
            it('should not add message with insufficient params', (done) => {
                chai.request(server)
                    .post(routePaths.ROUTE_MESSAGES)
                    .set('x-access-token', tokenAuthUser)
                    .send(invalidNoFieldsMessage)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('info').eql(infos.PARAMS_ERROR);
                        done();
                    });
            });

            it('should not add message with empty fields params', (done) => {
                chai.request(server)
                    .post(routePaths.ROUTE_MESSAGES)
                    .set('x-access-token', tokenAuthUser)
                    .send(invalidEmptyFieldsMessage)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('info').eql(infos.PARAMS_ERROR);
                        done();
                    });
            });
        });


        describe('with valid params', () => {
            it('should add a public message', (done) => {
                chai.request(server)
                    .post(routePaths.ROUTE_MESSAGES)
                    .set('x-access-token', tokenAuthUser)
                    .send(publicMessage)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('created');
                        res.body.created.should.be.a('object');
                        res.body.created.should.have.property('author').eql(currentUser._id.toString());
                        res.body.created.should.have.property('text').eql(publicMessage.text);
                        res.body.created.should.have.property('visibility').eql([]);
                        res.body.created.should.have.property('restricted').eql(publicMessage.restricted);
                        res.body.created.should.have.property('orientation').eql(publicMessage.orientation);
                        res.body.created.should.have.property('location').eql(publicMessage.location.split(',').map(Number));
                        res.body.created.should.have.property('date');
                        done();
                    });
            });

            it('should add a private message', (done) => {
                const friendsList = currentUser.friends.map((f) => f._id.toString());
                chai.request(server)
                    .post(routePaths.ROUTE_MESSAGES)
                    .set('x-access-token', tokenAuthUser)
                    .send(privateMessage)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('created');
                        res.body.created.should.be.a('object');
                        res.body.created.should.have.property('author').eql(currentUser._id.toString());
                        res.body.created.should.have.property('text').eql(privateMessage.text);
                        res.body.created.should.have.property('visibility').eql(friendsList);
                        res.body.created.should.have.property('restricted').eql(privateMessage.restricted);
                        res.body.created.should.have.property('orientation').eql(privateMessage.orientation);
                        res.body.created.should.have.property('location').eql(privateMessage.location.split(',').map(Number));
                        res.body.created.should.have.property('date');
                        done();
                    });
            });
        });
    });

    describe('/GET messages/@:center&r=:r', () => {

        it('should have an optional range parameter', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_MESSAGES + '/@4,1')
                .set('x-access-token', tokenAuthUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('messages');
                    done();
                });
        });

        it('should return success false with invalid center parameter', () => {
            chai.request(server)
                .get(routePaths.ROUTE_MESSAGES + '/@4')
                .set('x-access-token', tokenAuthUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('info').eql(infos.PARAMS_ERROR);
                    done();
                });
        });

        describe('within the range', () => {
            it('should return the two messages with the friend token', (done) => {
                const friendsList = currentUser.friends.map((f) => f._id.toString());
                chai.request(server)
                    .get(routePaths.ROUTE_MESSAGES + '/@48.7861402,2.3274749&r=500')
                    .set('x-access-token', tokenAuthFriend)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('messages');
                        res.body.messages.should.be.a('array');
                        res.body.messages.length.should.be.eql(2);
                        res.body.messages[0].should.have.property('author').eql(currentUser._id.toString());
                        res.body.messages[0].should.have.property('text').eql(publicMessage.text);
                        res.body.messages[0].should.have.property('visibility').eql([]);
                        res.body.messages[0].should.have.property('restricted').eql(publicMessage.restricted);
                        res.body.messages[0].should.have.property('orientation').eql(publicMessage.orientation);
                        res.body.messages[0].should.have.property('location').eql(publicMessage.location.split(',').map(Number));
                        res.body.messages[0].should.have.property('date');
                        res.body.messages[1].should.have.property('author').eql(currentUser._id.toString());
                        res.body.messages[1].should.have.property('text').eql(privateMessage.text);
                        res.body.messages[1].should.have.property('visibility').eql(friendsList);
                        res.body.messages[1].should.have.property('restricted').eql(privateMessage.restricted);
                        res.body.messages[1].should.have.property('orientation').eql(privateMessage.orientation);
                        res.body.messages[1].should.have.property('location').eql(privateMessage.location.split(',').map(Number));
                        res.body.messages[1].should.have.property('date');
                        done();
                    });
            });

            it('should return only the public message with the unrelated token', (done) => {
                chai.request(server)
                    .get(routePaths.ROUTE_MESSAGES + '/@48.7861402,2.3274749&r=500')
                    .set('x-access-token', tokenAuthUnrelated)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('messages');
                        res.body.messages.should.be.a('array');
                        res.body.messages.length.should.be.eql(1);
                        res.body.messages[0].should.have.property('author').eql(currentUser._id.toString());
                        res.body.messages[0].should.have.property('text').eql(publicMessage.text);
                        res.body.messages[0].should.have.property('visibility').eql([]);
                        res.body.messages[0].should.have.property('restricted').eql(publicMessage.restricted);
                        res.body.messages[0].should.have.property('orientation').eql(publicMessage.orientation);
                        res.body.messages[0].should.have.property('location').eql(publicMessage.location.split(',').map(Number));
                        res.body.messages[0].should.have.property('date');
                        done();
                    });
            });
        });

        describe('outside the range', () => {

            it('should return an empty array', (done) => {
                chai.request(server)
                    .get(routePaths.ROUTE_MESSAGES + '/@4,1&r=50')
                    .set('x-access-token', tokenAuthUser)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('messages');
                        res.body.messages.should.be.a('array').eql([]);
                        done();
                    });
            });
        });
    });
});