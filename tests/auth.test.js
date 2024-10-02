import request from 'supertest';
import app from '../app';

describe('Authentication', () => {
  let authToken;

  before((done) => {
    // Simulate user login
    request(app)
      .get('/connect')
      .auth('test@test.com', '123456')  // Mocking a basic auth flow
      .end((err, res) => {
        if (err) return done(err);
        authToken = res.body.token;
        done();
      });
  });

  it('should get user details with /users/me', (done) => {
    request(app)
      .get('/users/me')
      .set('X-Token', authToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email', 'test@test.com');
        done();
      });
  });

  it('should disconnect the user', (done) => {
    request(app)
      .get('/disconnect')
      .set('X-Token', authToken)
      .expect(204)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
