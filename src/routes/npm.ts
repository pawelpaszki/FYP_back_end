import * as express from 'express';
import NpmController from '../controllers/npmController';

const npm = express.Router();

npm.post('/tests', NpmController.runTests);
npm.delete('/src/:imageName', NpmController.removeSrcCode);

export default npm;
