import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import ImageFreshness from "./controllers/imageFreshnessController";

class App {
    public express;

    constructor() {
        this.express = express();
        this.middleware();
        this.connectToDB();
        this.mountRoutes();
    }

    private connectToDB(): void {
        let uri = 'mongodb://localhost/images';
        mongoose.connect(uri, (err) => {
            if (err) {
                console.log(err.message);
                console.log(err);
            }
            else {
                console.log('Connected to MongoDB');
            }
        });
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Server running!'
            });
        });
        this.express.get("/api/imagefreshness/:id", ImageFreshness.getOne);
        this.express.put("/api/imagefreshness/:id", ImageFreshness.addVulnerabilityCheck);
        this.express.delete("/api/imagefreshness/:id", ImageFreshness.delete);
        this.express.post("/api/imagefreshness", ImageFreshness.create);
        this.express.get("/api/imagefreshness", ImageFreshness.getAll);
        this.express.use('/', router);
    }
}

export default new App().express;