import * as express from 'express';
import ContainerController from '../controllers/containerController';

const containers = express.Router();

containers.post('/create', ContainerController.create);
containers.post('/start', ContainerController.start);
// containers.post('/stop', containerController.stop);
// containers.delete('/remove', containerController.remove);
// containers.get('/', containerController.list);
containers.post('/extract', ContainerController.extract);

export default containers;
