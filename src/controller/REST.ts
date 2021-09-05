import express from 'express';
export class REST {
    app!: express.Application;
    constructor(app: express.Application) {
        this.app = app;
        var bodyParser = require('body-parser');
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.router();
    }

    private router() {
        let router = express.Router();
        this.app.use('/', router);
    }

}