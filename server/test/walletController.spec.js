import chai, {
    expect
} from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import config from '../config/index';
import App from '../../app';

chai.use(chaiHttp);

describe('Wallet controller', () => {
    before((done) => {
        mongoose.connect(config.DB_TEST, () => {
            mongoose.connection.db.dropDatabase(function () {
                done();
            });
        });
    });

    describe('Create wallet for user', () => {
        const userObject = {
            userPhoneNumber: '07055555555'
        };
        it('should create a user with complete phone digit', (done) => {
            chai.request(App)
                .post('/api/createwallet')
                .set({
                    'content-type': 'application/json',
                })
                .send(JSON.stringify(userObject))
                .end((err, res) => {
                    expect(res.status).to.equal(201);
                    expect(res.body.message).to.equal('Wallet created successfully');
                    done();
                });
        });
});
});
