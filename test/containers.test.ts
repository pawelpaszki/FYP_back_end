import {request, chai} from './common';

describe("# Container", () => {
  // TODO - pull image before starting those tests
  describe('test create container', () => {
    it('should create container upon providing existing image\'s name', () => {
      let existingImageName = 'pawelpaszki/vuln-demo-2-node';
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
});