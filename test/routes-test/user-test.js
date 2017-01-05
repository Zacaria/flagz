process.env.NODE_ENV = 'test';

import User from '~/src/models/user';
import * as routePaths from '~/src/constants/routes';

import chai from'chai';
import chaiHttp from 'chai-http';
import server from '~/src/app';

import * as userService from '~/src/services/user';

const should = chai.should();

chai.use(chaiHttp);

describe('User', () => {

    const user1 = {
        name    : 'user1',
        password: 'user1'
    };

    const user2 = {
        name    : 'user2',
        password: 'user2'
    };

    const user3 = {
        name    : 'user3',
        password: 'user3'
    };

    const fakeId = '56d2f571d7e245e0120bcc38';

    // filled during tests for further using
    let dbUsers;
    let authToken = '';

    before((done) => { //Before each test we empty the database
        User.remove({})
            .then(() => userService.createUser(user1))
            .then(() => userService.createUser(user2))
            .then(() => userService.createUser(user3))
            .then(() => userService.authenticate(user1))
            .then(({token}) =>  new Promise(resolve => {
                authToken = token;
                resolve();
            }))
            .then(() => done())
            .catch(e => {
                console.log('error', e);
                done();
            });
    });

    after((done) => { //After each test we empty the database
        User.remove({}).then(() => done());
    });

    describe('/GET /api/users', () => {
        it('should get users list', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_USERS)
                .set('x-access-token', authToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    res.body.users.length.should.be.eql(3);
                    dbUsers = res.body.users;
                    done();
                });
        });
    });

    describe('/GET /api/users/:id', () => {
        it('should get one user using correct id', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_USERS + '/' + dbUsers[0]._id)
                .set('x-access-token', authToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('name').eql('user1');
                    res.body.user.should.have.property('id').eql(dbUsers[0]._id);
                    res.body.user.should.have.property('friends').eql([]);
                    done();
                });
        });

        it('should get no user using invalid id', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_USERS + '/invalid')
                .set('x-access-token', authToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('exception');
                    res.body.exception.should.be.a('object');
                    done();
                });
        });

        it('should get no user using incorrect id', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_USERS + '/' + fakeId)
                .set('x-access-token', authToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('exception');
                    res.body.exception.should.be.a('string');
                    done();
                });
        });
    });

    describe('/PATCH /friends', () => {
        it('should add a friend', (done) => {
            chai.request(server)
                .patch(routePaths.ROUTE_USERS_FRIENDS)
                .set('x-access-token', authToken)
                .send({
                    op: 'insert',
                    id: dbUsers[1]._id
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('name').eql('user1');
                    res.body.user.should.have.property('id').eql(dbUsers[0]._id);
                    res.body.user.should.have.property('friends');
                    res.body.user.friends.length.should.be.eql(1);
                    done();
                });
        });

        it('should not add friend twice', (done) => {
            chai.request(server)
                .patch(routePaths.ROUTE_USERS_FRIENDS)
                .set('x-access-token', authToken)
                .send({
                    op: 'insert',
                    id: dbUsers[1]._id
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('name').eql('user1');
                    res.body.user.should.have.property('id').eql(dbUsers[0]._id);
                    res.body.user.should.have.property('friends');
                    res.body.user.friends.length.should.be.eql(1);
                    done();
                });
        });

        it('should delete a friend', (done) => {
            chai.request(server)
                .patch(routePaths.ROUTE_USERS_FRIENDS)
                .set('x-access-token', authToken)
                .send({
                    op: 'delete',
                    id: dbUsers[1]._id
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('name').eql('user1');
                    res.body.user.should.have.property('id').eql(dbUsers[0]._id);
                    res.body.user.should.have.property('friends');
                    res.body.user.friends.length.should.be.eql(0);
                    done();
                });
        });

        it('should fail on unrecognized op', (done) => {
            chai.request(server)
                .patch(routePaths.ROUTE_USERS_FRIENDS)
                .set('x-access-token', authToken)
                .send({
                    op: 'something',
                    id: dbUsers[1]._id
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('exception');
                    done();
                });
        });

        it('should fail on unknown user', (done) => {
            chai.request(server)
                .patch(routePaths.ROUTE_USERS_FRIENDS)
                .set('x-access-token', authToken)
                .send({
                    op: 'insert',
                    id: fakeId
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('exception');
                    done();
                });
        });
    });
});