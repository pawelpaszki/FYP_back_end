import * as express from 'express';
import ImageController from '../controllers/imageController';

const images = express.Router();

images.post('/search', ImageController.search);
images.post('/pull', ImageController.pull);
images.post('/build', ImageController.build);
images.delete('/:imageId', ImageController.remove);

export default images;
