import containerController from "../controllers/containerController";
import * as express from 'express';

const containers = express.Router();

containers.post("/create", containerController.create);
containers.post("/startd", containerController.start);
containers.post("/stop", containerController.stop);
containers.post("/remove", containerController.remove);
containers.get("/", containerController.list);

export default containers;