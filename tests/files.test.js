import request from 'supertest';
import app from '../app';

describe('File Endpoints', () => {
  let authToken;

  before((done) => {
    // Simulate user login
    request(app)
      .get('/connect')
      .auth('test@test.com', '123456')
      .end((err, res) => {
        if (err) return done(err);
        authToken = res.body.token;
        done();
      });
  });

  it('should upload a file', (done) => {
    request(app)
      .post('/files')
      .set('X-Token', authToken)
      .send({
        name: 'test_file.txt',
        type: 'file',
        data: Buffer.from('Hello, World').toString('base64')
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'test_file.txt');
        done();
      });
  });

  it('should paginate files', (done) => {
    request(app)
      .get('/files')
      .set('X-Token', authToken)
      .query({ page: 1 })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

});
