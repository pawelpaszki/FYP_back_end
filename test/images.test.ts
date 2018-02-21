import express from '../src/config/app';
const endpoint = '/api/images/';
import {chai} from './common';
import {ChildProcessHandler} from "../src/utilities/ChildProcessHandler";

describe('# Image', () => {

  describe('/POST search for images', () => {
    it('it should return array with search results', (done) => {
      chai.request(express)
        .post(endpoint + 'search')
        .send({imageName: 'ubuntu'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('images');
          done();
        });
    });
  });

  describe('/POST pull docker image', () => {
    it('it should pull existing docker image', function(done) {
      this.timeout(30000);
      chai.request(express)
        .post(endpoint + 'pull')
        .send({imageName: 'alpine:3.6'})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.not.be.empty;
          done();
        });
    });
  });

  describe('/POST pull docker image', () => {
    it('it should not pull non-existent docker image', function(done) {
      this.timeout(30000);
      chai.request(express)
        .post(endpoint + 'pull')
        .send({imageName: 'non-existent-image'})
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.not.be.empty;
          done();
        });
    });
  });

  describe('/DELETE docker image', () => {
    it('it should delete local docker image', async () => {
      const imageId = await ChildProcessHandler.executeChildProcCommand('docker images --format "{{.ID}}" alpine', false);
      chai.request(express)
        .delete(endpoint + imageId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.not.be.empty;
        });
    });
  });

  describe('/DELETE docker image', () => {
    it('it should not delete non-existent docker image', async () => {
      chai.request(express)
        .delete(endpoint + '123412341234')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.not.be.empty;
        });
    });
  });

});