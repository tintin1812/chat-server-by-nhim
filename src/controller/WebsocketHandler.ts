import { Session } from "../model/Session";
import { GlobalValue, MessageResponse } from '../global';
import { server } from "../server";
var fetch = require('node-fetch');
const CryptoJS = require("crypto-js");

export class WebsocketHandler {

    public constructor() {

    }

    public OnMessage(session: Session, json: any) {
        try {
            if (json.m == null) return;
            switch (json.m) {
                
                //// CHAT --------
                case GlobalValue.m_status.login:
                    this.LoginChat(session, json.d);
                    break;
                case GlobalValue.m_status.send_mess:
                    this.SendChatMessage(session, json.d);
                    break;
                default:
                    break;
            }
        } catch (error) {

        }

    }

    private SendMessage(ws: any, mess: any) {
        server.getInstance().getWebSocketManager().sendMessage(ws, mess)
    }
    private SendMessageToAll(mess: any) {
        server.getInstance().getWebSocketManager().sendToAll(mess)
    }

    private LoginChat(session: Session, client_json: any) {
        if (session.username != "") {
            let data_send = MessageResponse.createMessage(GlobalValue.m_status.login, "Bạn đã login rồi!");
            this.SendMessage(session.ws, data_send)
            return;
        }
        let data_send = MessageResponse.createMessage(GlobalValue.m_status.login, "Đăng nhập thành công!");
        session.nick_name = client_json.nick;
        this.SendMessage(session.ws, data_send);
    }
    private SendChatMessage(session: Session, client_json: any) {
        if (session.nick_name == "") {
            let data_send = MessageResponse.createMessage(GlobalValue.m_status.logout, "Bạn chưa login");
            this.SendMessage(session.ws, data_send)
            return;
        }
        let data_send = MessageResponse.createMessage(GlobalValue.m_status.send_mess, {
            nick: session.nick_name,
            mess: client_json.mess
        });
        this.SendMessageToAll(data_send);
    }

    private logout(session: Session) {
        try {
            session.uid = 0;
            session.nick_name = "";
            session.username = "";
            session.token = "";
            let data_send = MessageResponse.createMessage(GlobalValue.m_status.logout, "Logout A successfully!");
            this.SendMessage(session.ws, data_send)
        } catch (error) {
            let message = MessageResponse.createNotificationMessage({ api_name: "logout", description: "System Error!" });
            this.SendMessage(session.ws, message)
        }
    }
    
    getQueryString(params) {
        var esc = encodeURIComponent;
        return Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
    }
}