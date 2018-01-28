import containerController from "../controllers/containerController";
import * as express from 'express';

const containers = express.Router();

containers.post("/create", containerController.create);
containers.post("/start", containerController.start);
containers.post("/stop", containerController.stop);
containers.delete("/remove", containerController.remove);
containers.get("/", containerController.list);
containers.post("/extract", containerController.extract);

export default containers;