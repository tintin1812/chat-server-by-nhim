import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { WebSocketManger } from './controller/WebsocketManager';
import { REST } from './controller/REST';
import { GlobalValue } from './global';

export class server {
    private app!: express.Application;

    //initialize a simple http server
    private server!: http.Server;

    //initialize the WebSocket server instance
    private ws_init!: WebSocket.Server;
    private option: WebSocket.ServerOptions = {};
    private manager!: WebSocketManger;

    private static instance: server = new server();

    /**
     * getInstance
     */
    public static getInstance() {
        if (this.instance === undefined || this.instance === null)
            this.instance = new server();
        return this.instance;
    }

    private constructor() {
        GlobalValue.getConfig(() => {
            this.initApp();
            this.initServer();
            this.initWebSocket();
        });
    }

    private initApp() {
        this.app = express();
        var rest = new REST(this.app);
    }

    private initServer() {
        this.server = http.createServer(this.app);
        //start our server
        var init = this.server.listen(GlobalValue.port, () => {
            console.log(`Server started on port ${GlobalValue.port}`);
        });        
    }

    private initWebSocket() {
        this.option.server = this.server;
        this.ws_init = new WebSocket.Server(this.option);
        this.manager = new WebSocketManger(this.ws_init);
    }

    public stopServerEvent() {
        console.log("----------------------------------------destroy server------------------------------------------------- ")
        this.manager.stop();
        console.log("----------------------------------------done destroy server-------------------------------------------- ")
    }

    /**
     * getApp
     */
    public getApp(): express.Application {
        return this.app;
    }

    /**
     * getWebSocketManager
     */
    public getWebSocketManager(): WebSocketManger {
        return this.manager;
    }

}

