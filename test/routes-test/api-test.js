process.env.NODE_ENV = 'test';

import User from '../../src/models/user';
import Message from '../../src/models/message';
import * as userService from '../../src/services/user';

import chai from'chai';
import chaiHttp from 'chai-http';
import server from '../../src/app';
const should = chai.should();

chai.use(chaiHttp);


describe('Api', () => {
    const user = new User({
        name: 'admin',
        password: 'admin'
    });

    before((done) => { //Before each test we empty the database
        User.remove({})
            .then(() => user.save())
            .then(() => done());
    });

    after((done) => { //Before each test we empty the database
        User.remove({})
            .then(() => done());
    });

    it('should not be able to GET the root api without token', (done) => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message');
                done();
            });
    });

    it('should not be able to GET the root api with bad token', (done) => {
        chai.request(server)
            .get('/api?token=0')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(false);
                res.body.should.have.property('message');
                done();
            });
    });

    it('should able to GET the root api with valid token', (done) => {
        userService.authenticate({
                name: 'admin',
                password: 'admin'
            })
        .then(({token}) => {
            chai.request(server)
                .get('/api?token=' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message');
                    done();
                });
        });

    });
});