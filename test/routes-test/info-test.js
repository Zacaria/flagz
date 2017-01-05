process.env.NODE_ENV = 'test';

import * as routePaths from '~/src/constants/routes';

import chai from'chai';
import chaiHttp from 'chai-http';
import server from '~/src/app';
const should = chai.should();

chai.use(chaiHttp);

describe('Info', () => {
    describe('/GET root', () => {
        it('should GET info root message', (done) => {
            chai.request(server)
                .get(routePaths.ROUTE_INFO)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('info').eql('infos root');
                    done();
                });
        });
    });
});