import * as express from 'express';
import ImageController from '../controllers/imageController';

const images = express.Router();

images.post('/search', ImageController.search);

export default images;
