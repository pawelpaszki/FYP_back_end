import express from '../src/config/app';

const endpoint = '/api/misc/';
import {chai} from './common';
import * as child from "child_process";
import * as Docker from "dockerode";
const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});
const testImageName: string = 'pawelpaszki/vuln-demo-1-node';

describe('# Misc', () => {

  const testContainer = {
    Image: testImageName,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: false,
    StdinOnce: false
  };

  describe('/DELETE remove extracted source code', () => {
    it('should remove existing directory', function(done) {
      let dirExists = child.execSync(
        'cd imagesTestDir && find . -maxdepth 1 -name \"testPAWELPASZKIvuln-demo-1-node\"')
        .includes('testPAWELPASZKIvuln-demo-1-node');
      if(!dirExists) {
        child.execSync('cd imagesTestDir && mkdir testPAWELPASZKIvuln-demo-1-node');
      }
      chai.request(express)
        .delete(endpoint + 'src/pawelpaszki%2Fvuln-demo-1-node')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/DELETE remove extracted source code', () => {
    it('should not remove non-existent directory', function(done) {
      chai.request(express)
        .delete(endpoint + 'src/pawelpaszki%2Fnon-existentDir')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/POST docker login', () => {
    it('it should return an error due to the incorrect credentials', function(done) {
      this.timeout(10000);
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

  describe('/POST get OS version', () => {
    it('it should name of the OS with latest and current version number', function(done) {
      this.timeout(40000);
      docker.createContainer(testContainer, function(err, container) {
        if (!err) {
          const containerId = container.id;
          chai.request(express)
            .post('/api/containers/start')
            .send({containerId: containerId})
            .end(() => {
              chai.request(express)
                .post('/api/containers/extract')
                .send({containerId: containerId, imageName: testImageName})
                .end(() => {
                  chai.request(express)
                    .post(endpoint + 'checkOS')
                    .send({imageName: testImageName})
                    .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.have.property('name');
                      done();
                    });
                });
            });
        }
      });

    });
  });

  describe('/POST get OS version', () => {
    it('it should not get an OS version for an image without src extracted', function(done) {
      chai.request(express)
        .post(endpoint + 'checkOS')
        .send({imageName: 'pawelpaszki/non-existent'})
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

});