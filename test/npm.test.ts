import express from '../src/config/app';

const endpoint = '/api/npm/';
const testImageName1 = 'pawelpaszki/vuln-demo-1-node';
const emptyImageName = '';
import {chai} from './common';
let token = '';

describe('# NPM', () => {

  before((done) => {
    chai.request(express)
      .post('/api/login')
      .send({username: 'testusername', password: 'password'})
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe('/POST run npm tests', () => {
    it('it should complete npm tests execution', (done) => {
      chai.request(express)
        .post(endpoint + 'tests')
        .set({'x-access-token': token})
        .send({imageName: testImageName1})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.not.be.empty;
          done();
        });
    });
  });

  describe('/POST run npm tests', () => {
    it('it should return error on empty image name provided', (done) => {
      chai.request(express)
        .post(endpoint + 'tests')
        .set({'x-access-token': token})
        .send({imageName: emptyImageName})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe('/POST run ncu check', () => {
    it('it should check for components updates', (done) => {
      chai.request(express)
        .post(endpoint + 'checkUpdates')
        .set({'x-access-token': token})
        .send({imageName: testImageName1})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.not.be.empty;
          done();
        });
    });
  });

  describe('/POST run ncu check', () => {
    it('it should return error on empty image name provided', (done) => {
      chai.request(express)
        .post(endpoint + 'checkUpdates')
        .set({'x-access-token': token})
        .send({imageName: emptyImageName})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe('/POST update npm components', () => {
    it('it should update components successfully', (done) => {
      chai.request(express)
        .post(endpoint + 'update')
        .set({'x-access-token': token})
        .send({imageName: testImageName1})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.not.be.empty;
          done();
        });
    });
  });

  describe('/POST update npm components', () => {
    it('it should return error on empty image name provided', (done) => {
      chai.request(express)
        .post(endpoint + 'update')
        .set({'x-access-token': token})
        .send({imageName: emptyImageName})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

});