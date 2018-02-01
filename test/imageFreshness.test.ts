import {request} from './common';

let imageFreshnessEntryId;
describe("# Image Freshness", () => {

  describe('test persisting vulnerability entry', () => {
    it('should successfully persist vulnerability entry', () => {
      let imageName = 'pawelpaszki/vuln-demo-10-node';
      request.put('/api/imagefreshness/')
        .send({name: imageName, startDate: new Date('01-jan-2018'), endDate: new Date('31-may-2018')})
        .expect(res => {
          res.body.message.should.equal("Vulnerability check persisted successfully");
          imageFreshnessEntryId = res.body._id;
        })
        .expect(201);
    });
  });

  describe('test persisting vulnerability entry twice at the same day', () => {
    it('should return error due to vulnerability check already performed', () => {
      let imageName = 'pawelpaszki/vuln-demo-10-node';
      request.put('/api/imagefreshness/')
        .send({name: imageName})
        .expect(res => {
          res.body.message.should.equal("Vulnerability check already persisted for today's date");
          imageFreshnessEntryId = res.body._id;
        })
        .expect(403);
    });
  });

  describe('test create image freshness entry', () => {
    it('should successfully create image freshness entry', () => {
      let nonExistentImageName = 'pawelpaszki/non-existent-image';
      request.post('/api/imagefreshness/')
        .send({name: nonExistentImageName})
        .expect(res => {
          res.body.message.should.equal("Image freshness entry saved successfully!");
          imageFreshnessEntryId = res.body._id;
        })
        .expect(201);
    });
  });

  describe('test get image freshness entry', () => {
    it('should return single image freshness entry', () => {
      request.get('/api/imagefreshness/' + imageFreshnessEntryId)
        .send()
        .expect(200);
    });
  });

  describe('test get image freshness entry with non-existent id', () => {
    it('should return single image freshness entry', () => {
      request.get('/api/imagefreshness/' + '12341234')
        .send()
        .expect(404);
    });
  });

  describe('test retrieve all freshness entries', () => {
    it('should successfully retrieve all freshness entries', () => {
      request.get('/api/imagefreshness/')
        .send()
        .expect(res => {
          res.body.to.be.an('array');
        })
        .expect(200);
    });
  });

  describe('test delete single freshness entry', () => {
    it('should successfully delete single entry', () => {
      request.del('/api/imagefreshness/' + imageFreshnessEntryId)
        .send()
        .expect(res => {
          res.body.message.should.equal('Image freshness entry deleted successfully!');
        })
        .expect(200);
    });
  });

  describe('test delete non-existent freshness entry', () => {
    it('should return error due to entry not found', () => {
      request.del('/api/imagefreshness/' + '12341234')
        .send()
        .expect(404);
    });
  });

  describe('test delete all freshness entries', () => {
    it('should successfully delete all freshness entries', () => {
      request.del('/api/imagefreshness/')
        .send()
        .expect(res => {
          res.body.message.should.equal('Image freshness entries deleted successfully!');
        })
        .expect(200);
    });
  });

});