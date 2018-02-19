import express from '../src/config/app';
const endpoint = '/api/images/';
import {chai} from './common';

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

});