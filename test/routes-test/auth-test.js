process.env.NODE_ENV = 'test';

import User from '~/src/models/user';

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
        it('it should not create a user with unsufficient params', (done) => {
            chai.request(server)
                .post('/api/signup')
                .send({
                    name: 'admin'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('it should create a user', (done) => {
            chai.request(server)
                .post('/api/signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('id');
                    done();
                });
        });

        it('it should not create a user existing name', (done) => {
            chai.request(server)
                .post('/api/signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

    describe('/POST signin', () => {

        it('it should not authenticate with user not existing', (done) => {
            chai.request(server)
                .post('/api/signin')
                .send({
                    name: 'noone',
                    password: 'wrong'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('it should not authenticate with wrong pw', (done) => {
            chai.request(server)
                .post('/api/signin')
                .send({
                    name: 'admin',
                    password: 'wrong'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('it should return a token', (done) => {
            chai.request(server)
                .post('/api/signin')
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