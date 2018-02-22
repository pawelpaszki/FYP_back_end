import express from '../src/config/app';

const endpoint = '/api/misc/';
import {chai} from './common';
import {ChildProcessHandler} from "../src/utilities/ChildProcessHandler";

describe('# Misc', () => {

  describe('/DELETE remove extracted source code', () => {
    it('should remove existing directory', async () => {
        await ChildProcessHandler.executeChildProcCommand(
          'mkdir imagesTestDir && cd imagesTestDir && mkdir testPAWELPASZKIvuln-demo-10-node', true);
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

  describe('/POST docker login', () => {
    it('it should return an error due to the incorrect credentials', (done) => {
      chai.request(express)
        .post(endpoint + 'dockerLogin')
        .send({username: 'abc', password: '456'})
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.be.empty;
          done();
        });
    });
  });

});