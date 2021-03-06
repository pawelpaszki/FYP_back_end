import express from '../src/config/app';
import {chai} from './common';
const endpoint: string = '/api/';
const username: string = 'username';
const password: string = 'password';
let token: string = '';

describe('# User', () => {

  before((done) => {
    chai.request(express)
      .post('/api/login')
      .send({username: 'testusername', password: 'password'})
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe('/DELETE all users', () => {
    it('should not throw an error when db is empty', function(done) {
      chai.request(express)
        .delete(endpoint + 'users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('All users deleted successfully');
          done();
        });
    });
  });

  describe('/POST logout', () => {
    it('should logout and return a null token', function(done) {
      chai.request(express)
        .get(endpoint + 'logout')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token').eql(null);
          done();
        });
    });
  });

  describe('/POST register', () => {
    it('should register a user', function(done) {
      chai.request(express)
        .post(endpoint + 'register')
        .send({username: username, password: password})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token').not.eql(null);
          done();
        });
    });
  });

  describe('/POST register', () => {
    it('should not register a user with same username again', function(done) {
      chai.request(express)
        .post(endpoint + 'register')
        .send({username: username, password: password})
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('token').eql(null);
          done();
        });
    });
  });

  describe('/POST register', () => {
    it('should not register a user without credentials', function(done) {
      chai.request(express)
        .post(endpoint + 'register')
        .send({})
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('token').eql(null);
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('should login a user', function(done) {
      chai.request(express)
        .post(endpoint + 'login')
        .send({username: username, password: password})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token').not.eql(null);
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('should not login a user without credentials', function(done) {
      chai.request(express)
        .post(endpoint + 'login')
        .send({})
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('should not login a user with invalid username', function(done) {
      chai.request(express)
        .post(endpoint + 'login')
        .send({username: 'non-existent-username', password: password})
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').not.eql(null);
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('should not login a user with incorrect password', function(done) {
      chai.request(express)
        .post(endpoint + 'login')
        .send({username: username, password: 'incorrect-password'})
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('token').eql(null);
          done();
        });
    });
  });

  describe('/PUT update', () => {
    it('should update user\'s password', function(done) {
      chai.request(express)
        .put(endpoint + 'update')
        .set({'x-access-token': token})
        .send({username: username, password: password, newPassword: 'newPassword'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token').not.eql(null);
          done();
        });
    });
  });

  describe('/PUT update', () => {
    it('should not update non-existent user\'s password', function(done) {
      chai.request(express)
        .put(endpoint + 'update')
        .set({'x-access-token': token})
        .send({username: 'invalidUsername', password: password, newPassword: 'newPassword'})
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Unable to find: invalidUsername');
          done();
        });
    });
  });

  describe('/DELETE all users', () => {
    it('should delete all users', function(done) {
      chai.request(express)
        .delete(endpoint + 'users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('All users deleted successfully');
          done();
        });
    });
  });

  describe('/POST docker login', () => {
    it('should return an error due to the incorrect credentials', function(done) {
      this.timeout(10000);
      chai.request(express)
        .post(endpoint + 'dockerLogin')
        .set({'x-access-token': token})
        .send({username: 'abc', password: '456'})
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.be.empty;
          done();
        });
    });
  });

  describe('/GET logs', () => {
    it('should return the logs', function(done) {
      chai.request(express)
        .get(endpoint + 'logs')
        .set({'x-access-token': token})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('logs');
          done();
        });
    });
  });
});