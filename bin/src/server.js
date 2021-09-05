"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const WebsocketManager_1 = require("./controller/WebsocketManager");
const REST_1 = require("./controller/REST");
const global_1 = require("./global");
class server {
    constructor() {
        this.option = {};
        global_1.GlobalValue.getConfig(() => {
            this.initApp();
            this.initServer();
            this.initWebSocket();
        });
    }
    /**
     * getInstance
     */
    static getInstance() {
        if (this.instance === undefined || this.instance === null)
            this.instance = new server();
        return this.instance;
    }
    initApp() {
        this.app = express_1.default();
        var rest = new REST_1.REST(this.app);
    }
    initServer() {
        this.server = http.createServer(this.app);
        //start our server
        var init = this.server.listen(global_1.GlobalValue.port, () => {
            console.log(`Server started on port ${global_1.GlobalValue.port}`);
        });
    }
    initWebSocket() {
        this.option.server = this.server;
        this.ws_init = new WebSocket.Server(this.option);
        this.manager = new WebsocketManager_1.WebSocketManger(this.ws_init);
    }
    stopServerEvent() {
        console.log("----------------------------------------destroy server------------------------------------------------- ");
        this.manager.stop();
        console.log("----------------------------------------done destroy server-------------------------------------------- ");
    }
    /**
     * getApp
     */
    getApp() {
        return this.app;
    }
    /**
     * getWebSocketManager
     */
    getWebSocketManager() {
        return this.manager;
    }
}
server.instance = new server();
exports.server = server;
//# sourceMappingURL=server.js.map