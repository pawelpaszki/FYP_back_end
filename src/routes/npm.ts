import * as express from 'express';
import NpmController from '../controllers/npmController';

const npm = express.Router();

npm.post('/tests', NpmController.runTests);
npm.post('/checkUpdates', NpmController.checkForUpdates);
npm.post('/update', NpmController.updateComponents);

export default npm;
