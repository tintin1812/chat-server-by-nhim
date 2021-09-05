import * as WebSocketServer from 'ws';
import { Session } from '../model/Session';
import { TextEncoder, TextDecoder } from 'util';
import { GlobalValue, MessageResponse } from '../global';
import { WebsocketHandler } from './WebsocketHandler';
export class WebSocketManger {
    private main_ws!: WebSocketServer.Server;
    private list_session: Array<Session> = [];
    private handler!: WebsocketHandler;
    constructor(ws: WebSocketServer.Server) {
        this.main_ws = ws;
        this.handler = new WebsocketHandler();
        this.registerMainWSListener();
    }

    public getListSession() {
        return this.list_session;
    }

    private create_UUID(): string {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    private registerMainWSListener(): void {
        try {
            this.main_ws.on('connection', (ws: WebSocketServer) => {
                if (!GlobalValue.debug)
                    ws.binaryType = 'arraybuffer';
                var session: Session = new Session();
                session.ws = ws;
                this.list_session.push(session);
                session.ws.on('message', (data: string) => {
                    this.onMessage(data, session);
                });

                session.ws.on('close', async (code: number, message: string) => {
                    this.removeSession(session);

                });

                session.ws.on('error', async (err: Error) => {
                    this.removeSession(session);
                    console.log(`Websocket registerMainWSListener error: `)
                });
            });
        } catch (error) {
            console.log(`registerMainWSListener: `);
        }

    }

    private onMessage(buffer: any, session: Session): void {
        if (session != null) {
            try {
                var data = buffer;
                if (!GlobalValue.debug)
                    data = new TextDecoder().decode(buffer);
                var json = JSON.parse(data.toString());
                this.handler.OnMessage(session, json);
            } catch (error) {
                console.log(`onMessage: `)
                let respone = MessageResponse.createMessage(GlobalValue.m_status.require, "Lỗi hệ thống");
                this.sendMessage(session.ws, respone)
            }
        } else {
            console.log(`onMessage: null session`);
        }
    }

    private removeSession(session: Session) {
        try {
            let index = this.list_session.indexOf(session);
            this.list_session.splice(index, 1);
            session.destroy();
        } catch (error) {
            console.log(`RemoveSeasion: `)
        }

    }

    public sendToAll(mess: any) {
        try {
            this.list_session.forEach(session => {
                if (session.ws != null && session.ws != undefined)
                    this.sendMessage(session.ws, mess);
            });
        } catch (error) {
            console.log(`SendAll: `)
        }

    }

    public sendMessage(ws: any, mess: any) {
        try {
            let unit = mess;
            if (!GlobalValue.debug)
                unit = new TextEncoder().encode(mess);
            // console.log("sendMessage: " + unit);
            ws.send(unit);
        } catch (error) {

        }

    }

    public stop() {
        this.list_session.forEach(async (session: any) => {
            if (session)
                await session.destroy();
        });
    }
}

