import express from '../src/config/app';
import {chai} from './common';
const endpoint: string = '/api/';
const username: string = 'username';
const password: string = 'password';

describe('# User', () => {
  describe('/DELETE all users', () => {
    it('it should delete all users', function(done) {
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
    it('it should logout and return a null token', function(done) {
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
    it('it should register a user', function(done) {
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
    it('it should not register a user with same username again', function(done) {
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
    it('it should not register a user without credentials', function(done) {
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
    it('it should login a user', function(done) {
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
    it('it should not login a user without credentials', function(done) {
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
    it('it should not login a user with invalid username', function(done) {
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
    it('it should not login a user with incorrect password', function(done) {
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
});