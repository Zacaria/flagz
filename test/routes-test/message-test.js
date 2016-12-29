process.env.NODE_ENV = 'test';

import User from '~/src/models/user';
import * as userService from '~/src/services/user';
import * as routePaths from '~/src/constants/routes';

import chai from'chai';
import chaiHttp from 'chai-http';
import server from '~/src/app';
const should = chai.should();

chai.use(chaiHttp);


describe('Message', () => {
    const user = new User({
        name: 'admin',
        password: 'admin'
    });

    //filled in before hook
    let tokenAuth;

    before((done) => { //Before each test we empty the database
        User.remove({})
            .then(() => user.save())
            .then(() => userService.authenticate({
                name: 'admin',
                password: 'admin'
            }))
            .then(({token}) => {
                tokenAuth = token;
            })
            .then(() => done());
    });

    after((done) => { //After each test we empty the database
        User.remove({})
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
});