process.env.NODE_ENV = 'test';

import chai from'chai';
import chaiHttp from 'chai-http';
import server from '../../src/app';
const should = chai.should();

chai.use(chaiHttp);

describe('Info', () => {
    describe('/GET root', () => {
        it('it should GET info root message', (done) => {
            chai.request(server)
                .get('/info')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('infos root');
                    done();
                });
        });
    });
});