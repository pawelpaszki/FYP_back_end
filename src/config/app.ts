import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import imageFreshness from '../routes/imagesfreshness';

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
        this.express.use('/api/imagefreshness', imageFreshness);

        this.express.use('/', (req, res) => {
            res.status(404).send({error: `path doesn't exist`});
        });
    }
}

export default new App().express;