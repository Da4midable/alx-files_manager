import request from 'supertest';
import app from '../app';  // Assuming app.js is your Express app

describe('GET /status', () => {
  it('should return status code 200', (done) => {
    request(app)
      .get('/status')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should return a status object', (done) => {
    request(app)
      .get('/status')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('redis');
        expect(res.body).to.have.property('db');
        done();
      });
  });
});
