import express from '../src/config/app';
import * as Docker from 'dockerode';

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

const endpoint = '/api/containers/';
const testImageName1 = 'pawelpaszki/vuln-demo-10-node';
const nonExistentImageName = 'abc/def';
let startedContainerId;
import {chai} from './common';

describe("# Container", () => {

  const testContainer = {
    Image: testImageName1,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: false,
    StdinOnce: false
  };
  // TODO - pull image before starting those tests
  describe('/POST create container', () => {
    it('it should create new container', (done) => {
      chai.request(express)
        .post(endpoint + 'create')
        .send({name: testImageName1})
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('message').eql('Container created successfully');
          done();
        });
    });
  });

  describe('/POST create container', () => {
    it('it should not create new container with invalid name', (done) => {
      chai.request(express)
        .post(endpoint + 'create')
        .send({name: nonExistentImageName})
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.have.property('error').eql('Unable to create container');
          done();
        });
    });
  });

  describe('/POST start container', () => {
    it('it should start an existing container', (done) => {
      docker.createContainer(testContainer, function(err, container) {
        if (!err) {
          startedContainerId = container.id;
          chai.request(express)
            .post(endpoint + 'start')
            .send({containerId: startedContainerId})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('message').eql('Container started successfully');
              done();
            });
        }
      });
    });
  });

  describe('/POST start container', () => {
    it('it should not start a non-existing container', (done) => {
      chai.request(express)
        .post(endpoint + 'start')
        .send({containerId: '123412341234'})
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error').eql('Unable to start container');
          done();
        });
    });
  });

  describe('/POST extract source code of a non-existent container', () => {
    it('should not extract source code of a non-existent container', (done) => {
      chai.request(express)
        .post(endpoint + 'extract')
        .send({containerId: '123412341234'})
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/POST extract source code of a not running container', () => {
    it('should not extract source code of a non running container', (done) => {
      docker.createContainer(testContainer, function(err, container) {
        if (!err) {
          const containerId = container.id;
          chai.request(express)
            .post(endpoint + 'extract')
            .send({containerId: containerId})
            .end((err, res) => {
              res.should.have.status(403);
              done();
            });
        }
      });
    });
  });

  describe('/POST extract source code of a running container', () => {
    it('should extract the source code successfully', function(done) {
      this.timeout(30000);
      chai.request(express)
        .post(endpoint + 'extract')
        .send({containerId: startedContainerId, imageName: testImageName1})
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/POST extract source code of a running container', () => {
    it('should not extract the source code again', function(done) {
      this.timeout(30000);
      chai.request(express)
        .post(endpoint + 'extract')
        .send({containerId: startedContainerId, imageName: testImageName1})
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
  //
  // describe('test create container with invalid image\'s name', () => {
  //   it('should return 500 error due to non-existent image', () => {
  //     let nonExistentImageName = 'pawelpaszki/non-existent-image';
  //     return request.post('/api/containers/create')
  //       .send({name: nonExistentImageName})
  //       .expect(res => {
  //         res.body.message.should.equal("Unable to create container");
  //         res.body.error.should.not.be.empty;
  //       })
  //       .expect(500);
  //   });
  // });
  //
  // describe('test start existing container', () => {
  //   it('should start container successfully', () => {
  //     docker.createContainer(testContainer, function(err, container) {
  //       if(!err) {
  //         const containerId = container.id;
  //         return request.post('/api/containers/start')
  //           .send({containerId: containerId})
  //           .expect(res => {
  //             res.body.message.should.equal("Container started successfully");
  //           })
  //           .expect(200);
  //       }
  //     });
  //   });
  // });
  //
  // describe('test start container with non-existent container\'s id', () => {
  //   it('should return 404 error due to non-existent container', () => {
  //     let nonExistentContainerId = '12345678abcd';
  //     return request.post('/api/containers/start')
  //       .send({name: nonExistentContainerId})
  //       .expect(res => {
  //         res.body.message.should.equal("Unable to start container");
  //         res.body.error.should.not.be.empty;
  //       })
  //       .expect(404);
  //   });
  // });
  //
  // describe('test extract source code of a container', () => {
  //   it('should extract container\' source code successfully', () => {
  //     docker.createContainer(testContainer, function(err, container) {
  //       if(!err) {
  //         const containerId = container.id;
  //         return request.post('/api/containers/extract')
  //           .send({containerId: containerId, imageName: testedImagesName})
  //           .expect(res => {
  //             res.body.message.should.equal("Container source code extracted successfully");
  //           })
  //           .expect(200);
  //       }
  //     });
  //   });
  // });
  //
  // describe('test extract source code with invalid container\'s id', () => {
  //   it('should result in 404 error thrown', () => {
  //     let nonExistentId = '12345678abcd';
  //     return request.post('/api/containers/extract')
  //       .send({containerId: nonExistentId, imageName: notTobeExtractedImagesName})
  //       .expect(404);
  //   });
  // });

});