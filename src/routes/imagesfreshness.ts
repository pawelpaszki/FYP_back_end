import ImageFreshnessController from "../controllers/imageFreshnessController";
import * as express from 'express';

const imageFreshness = express.Router();

imageFreshness.get("/:id", ImageFreshnessController.getOne);
imageFreshness.put("/:id", ImageFreshnessController.addVulnerabilityCheck);
imageFreshness.delete("/:id", ImageFreshnessController.delete);
imageFreshness.post("/", ImageFreshnessController.create);
imageFreshness.get("/", ImageFreshnessController.getAll);

export default imageFreshness;