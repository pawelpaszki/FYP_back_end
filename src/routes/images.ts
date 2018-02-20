import * as express from 'express';
import ImageController from '../controllers/imageController';

const images = express.Router();

images.post('/search', ImageController.search);
images.post('/pull', ImageController.pull);
images.delete('/:imageId', ImageController.remove);

export default images;
