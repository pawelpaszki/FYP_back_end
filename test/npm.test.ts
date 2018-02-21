import express from '../src/config/app';

const endpoint = '/api/npm/';
const testImageName1 = 'pawelpaszki/vuln-demo-10-node';
const emptyImageName = '';
import {chai} from './common';
import {ChildProcessHandler} from "../src/utilities/ChildProcessHandler";

describe('# NPM', () => {

  describe('/POST run npm tests', () => {
    it('it should complete npm tests execution', (done) => {
      chai.request(express)
        .post(endpoint + 'tests')
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
        .send({imageName: emptyImageName})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
  });

  describe('/DELETE remove extracted source code', () => {
    it('should remove existing directory', async () => {
      if (process.env.NODE_ENV === 'test') {
        await ChildProcessHandler.executeChildProcCommand(
          'mkdir imagesTestDir && cd imagesTestDir && mkdir testPAWELPASZKIvuln-demo-10-node', true);
      }
      chai.request(express)
        .delete(endpoint + 'src/pawelpaszki%2Fvuln-demo-10-node')
        .end((err, res) => {
          res.should.have.status(200);
        });
    });
  });

  describe('/DELETE remove extracted source code', () => {
    it('should not remove non-existent directory', (done) => {
      chai.request(express)
        .delete(endpoint + 'src/pawelpaszki%2Fnon-existentDir')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

});