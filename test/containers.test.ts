import {request} from './common';
import * as Docker from 'dockerode';

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

describe("# Container", () => {

  const testedImagesName = 'pawelpaszki/vuln-demo-10-node';
  const notTobeExtractedImagesName = 'pawelpaszki/vuln-demo-2-node';

  const testContainer = {
    Image: testedImagesName,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: false,
    StdinOnce: false
  };
  // TODO - pull image before starting those tests
  describe('test create container', () => {
    it('should create container upon providing existing image\'s name', () => {
      let existingImageName = testedImagesName;
      return request.post('/api/containers/create')
        .send({name: existingImageName})
        .expect(res => {
          res.body.message.should.equal("Container created successfully");
        })
        .expect(201);
    });
  });

  describe('test create container with invalid image\'s name', () => {
    it('should return 500 error due to non-existent image', () => {
      let nonExistentImageName = 'pawelpaszki/non-existent-image';
      return request.post('/api/containers/create')
        .send({name: nonExistentImageName})
        .expect(res => {
          res.body.message.should.equal("Unable to create container");
          res.body.error.should.not.be.empty;
        })
        .expect(500);
    });
  });

  describe('test start existing container', () => {
    it('should start container successfully', () => {
      docker.createContainer(testContainer, function(err, container) {
        if(!err) {
          const containerId = container.id;
          return request.post('/api/containers/start')
            .send({containerId: containerId})
            .expect(res => {
              res.body.message.should.equal("Container started successfully");
            })
            .expect(200);
        }
      });
    });
  });

  describe('test start container with non-existent container\'s id', () => {
    it('should return 404 error due to non-existent container', () => {
      let nonExistentContainerId = '12345678abcd';
      return request.post('/api/containers/start')
        .send({name: nonExistentContainerId})
        .expect(res => {
          res.body.message.should.equal("Unable to start container");
          res.body.error.should.not.be.empty;
        })
        .expect(404);
    });
  });

  describe('test extract source code of a container', () => {
    it('should extract container\' source code successfully', () => {
      docker.createContainer(testContainer, function(err, container) {
        if(!err) {
          const containerId = container.id;
          return request.post('/api/containers/extract')
            .send({containerId: containerId, imageName: testedImagesName})
            .expect(res => {
              res.body.message.should.equal("Container source code extracted successfully");
            })
            .expect(200);
        }
      });
    });
  });

  describe('test extract source code with invalid container\'s id', () => {
    it('should result in 404 error thrown', () => {
      let nonExistentId = '12345678abcd';
      return request.post('/api/containers/extract')
        .send({containerId: nonExistentId, imageName: notTobeExtractedImagesName})
        .expect(res => {
          res.body.message.should.equal("Unable to extract source code");
        })
        .expect(404);
    });
  });

});