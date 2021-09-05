"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Session_1 = require("../model/Session");
const util_1 = require("util");
const global_1 = require("../global");
const WebsocketHandler_1 = require("./WebsocketHandler");
class WebSocketManger {
    constructor(ws) {
        this.list_session = [];
        this.main_ws = ws;
        this.handler = new WebsocketHandler_1.WebsocketHandler();
        this.registerMainWSListener();
    }
    getListSession() {
        return this.list_session;
    }
    create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    registerMainWSListener() {
        try {
            this.main_ws.on('connection', (ws) => {
                if (!global_1.GlobalValue.debug)
                    ws.binaryType = 'arraybuffer';
                var session = new Session_1.Session();
                session.ws = ws;
                this.list_session.push(session);
                session.ws.on('message', (data) => {
                    this.onMessage(data, session);
                });
                session.ws.on('close', async (code, message) => {
                    this.removeSession(session);
                });
                session.ws.on('error', async (err) => {
                    this.removeSession(session);
                    console.log(`Websocket registerMainWSListener error: `);
                });
            });
        }
        catch (error) {
            console.log(`registerMainWSListener: `);
        }
    }
    onMessage(buffer, session) {
        if (session != null) {
            try {
                var data = buffer;
                if (!global_1.GlobalValue.debug)
                    data = new util_1.TextDecoder().decode(buffer);
                var json = JSON.parse(data.toString());
                this.handler.OnMessage(session, json);
            }
            catch (error) {
                console.log(`onMessage: `);
                let respone = global_1.MessageResponse.createMessage(global_1.GlobalValue.m_status.require, "Lỗi hệ thống");
                this.sendMessage(session.ws, respone);
            }
        }
        else {
            console.log(`onMessage: null session`);
        }
    }
    removeSession(session) {
        try {
            let index = this.list_session.indexOf(session);
            this.list_session.splice(index, 1);
            session.destroy();
        }
        catch (error) {
            console.log(`RemoveSeasion: `);
        }
    }
    sendToAll(mess) {
        try {
            this.list_session.forEach(session => {
                if (session.ws != null && session.ws != undefined)
                    this.sendMessage(session.ws, mess);
            });
        }
        catch (error) {
            console.log(`SendAll: `);
        }
    }
    sendMessage(ws, mess) {
        try {
            let unit = mess;
            if (!global_1.GlobalValue.debug)
                unit = new util_1.TextEncoder().encode(mess);
            // console.log("sendMessage: " + unit);
            ws.send(unit);
        }
        catch (error) {
        }
    }
    stop() {
        this.list_session.forEach(async (session) => {
            if (session)
                await session.destroy();
        });
    }
}
exports.WebSocketManger = WebSocketManger;
//# sourceMappingURL=WebsocketManager.js.map