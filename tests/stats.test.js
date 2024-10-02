import request from 'supertest';
import app from '../app';

describe('GET /stats', () => {
  it('should return status code 200', (done) => {
    request(app)
      .get('/stats')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should return stats for users and files', (done) => {
    request(app)
      .get('/stats')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('users');
        expect(res.body).to.have.property('files');
        done();
      });
  });
});
