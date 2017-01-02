process.env.NODE_ENV = 'test';

import User from '~/src/models/user';
import Message from '~/src/models/message';
import * as userService from '~/src/services/user';
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

    //filled in before hook
    let tokenAuth;

    //let currentUser;
    //let friend;

    before((done) => { //Before each test we empty the database
        User.remove({})
            .then(() => friend.save())
            .then(dbFriend => user.addFriend(dbFriend))
            .then(() => user.save())
            .then(() => userService.authenticate({
                name    : 'admin',
                password: 'admin'
            }))
            .then(({token}) => {
                tokenAuth = token;
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
                .set('x-access-token', tokenAuth)
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
        it('should get messages of the current user', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_MESSAGES_ME)
                .set('x-access-token', tokenAuth)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('messages');
                    res.body.messages.should.be.a('array');
                    done();
                });
        });

        //TODO : add Test when there are messages
    });

    describe('/POST messages', () => {
        const publicMessage = {
            text       : 'coucou',
            orientation: {
                x: 2, y: 3, z: 7
            },
            restricted : false,
            location   : '48.7861405,2.3274749'
        };

        it('should add a public message', (done) => {
            chai.request(server)
                .post(routePaths.ROUTE_MESSAGES)
                .set('x-access-token', tokenAuth)
                .send(publicMessage)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('created');
                    res.body.created.should.be.a('object');
                    res.body.created.should.have.property('author');
                    res.body.created.should.have.property('text').eql('coucou');
                    res.body.created.should.have.property('visibility').eql([]);
                    res.body.created.should.have.property('restricted').eql(false);
                    res.body.created.should.have.property('orientation').eql({
                        x: 2,
                        y: 3,
                        z: 7
                    });
                    res.body.created.should.have.property('location').eql([48.7861405, 2.3274749]);
                    res.body.created.should.have.property('date');
                    done();
                });
        });
    })
});