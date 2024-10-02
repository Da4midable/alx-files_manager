import request from 'supertest';
import app from '../app';

describe('POST /users', () => {
  it('should create a new user', (done) => {
    request(app)
      .post('/users')
      .send({ email: 'test@test.com', password: '123456' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email', 'test@test.com');
        done();
      });
  });

  it('should return 400 for missing email', (done) => {
    request(app)
      .post('/users')
      .send({ password: '123456' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('Missing email');
        done();
      });
  });
});
