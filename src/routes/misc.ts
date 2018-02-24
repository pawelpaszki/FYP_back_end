import * as express from 'express';
import MiscController from '../controllers/miscController';

const misc = express.Router();

misc.delete('/src/:imageName', MiscController.removeSrcCode);
misc.post('/dockerLogin', MiscController.dockerLogin);
misc.post('/checkOS', MiscController.checkOS);

export default misc;
