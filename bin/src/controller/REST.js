"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class REST {
    constructor(app) {
        this.app = app;
        var bodyParser = require('body-parser');
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.router();
    }
    router() {
        let router = express_1.default.Router();
        this.app.use('/', router);
    }
}
exports.REST = REST;
//# sourceMappingURL=REST.js.map