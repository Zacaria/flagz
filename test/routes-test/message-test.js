process.env.NODE_ENV = 'test';

import User from '~/src/models/user';
import Message from '~/src/models/message';
import * as userService from '~/src/services/user';
import * as messageService from '~/src/services/message';
import * as routePaths from '~/src/constants/routes';

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
        location   : '48.7861405,2.3274749'
    };

    //filled in before hook
    let tokenAuthUser;
    let tokenAuthFriend;
    let currentUser;

    before((done) => { //Before each test we empty the database
        User.remove({})
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
                        res.body.messages[0].should.have.property('location').eql([48.7861405, 2.3274749]);
                        res.body.messages[0].should.have.property('date');
                        res.body.messages[1].should.have.property('author').eql(currentUser._id.toString());
                        res.body.messages[1].should.have.property('text').eql(privateMessage.text);
                        res.body.messages[1].should.have.property('visibility').eql(friendsList);
                        res.body.messages[1].should.have.property('restricted').eql(privateMessage.restricted);
                        res.body.messages[1].should.have.property('orientation').eql(privateMessage.orientation);
                        res.body.messages[1].should.have.property('location').eql([48.7861405, 2.3274749]);
                        res.body.messages[1].should.have.property('date');
                        done();
                    });
            });
        });
    });

    describe('/POST messages', () => {
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
                    res.body.created.should.have.property('location').eql([48.7861405, 2.3274749]);
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
                    res.body.created.should.have.property('location').eql([48.7861405, 2.3274749]);
                    res.body.created.should.have.property('date');
                    done();
                });
        });
    })
});