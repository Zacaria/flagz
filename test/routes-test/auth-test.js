process.env.NODE_ENV = 'test';

import User from '~/src/models/user';
import * as routePaths from '~/src/constants/routes';
import * as exceptions from '~/src/constants/exceptions';

import chai from'chai';
import chaiHttp from 'chai-http';
import server from '~/src/app';
const should = chai.should();

chai.use(chaiHttp);

describe('Auth', () => {
    before((done) => { //Before each test we empty the database
        User.remove({}).then(() => done());
    });

    after((done) => { //After each test we empty the database
        User.remove({}).then(() => done());
    });

    const user = {
        name: 'admin',
        password: 'admin'
    };

    describe('/POST signup', () => {
        it('should not create a user with unsufficient params', (done) => {
            chai.request(server)
                .post(routePaths.ROUTE_AUTH_SINGUP)
                .send({
                    name: 'admin'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('exception').eql(exceptions.PARAMS_ERROR);
                    done();
                });
        });

        it('should create a user', (done) => {
            chai.request(server)
                .post(routePaths.ROUTE_AUTH_SINGUP)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('id');
                    done();
                });
        });

        it('should not create a user existing name', (done) => {
            chai.request(server)
                .post(routePaths.ROUTE_AUTH_SINGUP)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('exception');
                    done();
                });
        });
    });

    describe('/POST signin', () => {

        describe('with bad params', () => {
            it('should fail on missing parameter', (done) => {
                chai.request(server)
                    .post(routePaths.ROUTE_AUTH_SIGNIN)
                    .send({
                        password: 'wrong'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('exception').eql(exceptions.PARAMS_ERROR);
                        done();
                    });
            });

            it('should fail on empty parameter', (done) => {
                chai.request(server)
                    .post(routePaths.ROUTE_AUTH_SIGNIN)
                    .send({
                        name: 'wrong',
                        password: ''
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('exception').eql(exceptions.PARAMS_ERROR);
                        done();
                    });
            });
        });

        describe('with good params', () => {
            it('should not authenticate with user not existing', (done) => {
                chai.request(server)
                    .post(routePaths.ROUTE_AUTH_SIGNIN)
                    .send({
                        name: 'noone',
                        password: 'wrong'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('exception');
                        done();
                    });
            });

            it('should not authenticate with wrong pw', (done) => {
                chai.request(server)
                    .post(routePaths.ROUTE_AUTH_SIGNIN)
                    .send({
                        name: 'admin',
                        password: 'wrong'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property('exception');
                        done();
                    });
            });

            it('should return a token', (done) => {
                chai.request(server)
                    .post(routePaths.ROUTE_AUTH_SIGNIN)
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('token');
                        done();
                    });
            });
        });
    });
});