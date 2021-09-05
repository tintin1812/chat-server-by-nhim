"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const server_1 = require("../server");
var fetch = require('node-fetch');
const CryptoJS = require("crypto-js");
class WebsocketHandler {
    constructor() {
    }
    OnMessage(session, json) {
        try {
            if (json.m == null)
                return;
            switch (json.m) {
                //// CHAT --------
                case global_1.GlobalValue.m_status.login:
                    this.LoginChat(session, json.d);
                    break;
                case global_1.GlobalValue.m_status.send_mess:
                    this.SendChatMessage(session, json.d);
                    break;
                default:
                    break;
            }
        }
        catch (error) {
        }
    }
    SendMessage(ws, mess) {
        server_1.server.getInstance().getWebSocketManager().sendMessage(ws, mess);
    }
    SendMessageToAll(mess) {
        server_1.server.getInstance().getWebSocketManager().sendToAll(mess);
    }
    LoginChat(session, client_json) {
        if (session.username != "") {
            let data_send = global_1.MessageResponse.createMessage(global_1.GlobalValue.m_status.login, "Bạn đã login rồi!");
            this.SendMessage(session.ws, data_send);
            return;
        }
        let data_send = global_1.MessageResponse.createMessage(global_1.GlobalValue.m_status.login, "Đăng nhập thành công!");
        session.nick_name = client_json.nick;
        this.SendMessage(session.ws, data_send);
    }
    SendChatMessage(session, client_json) {
        if (session.nick_name == "") {
            let data_send = global_1.MessageResponse.createMessage(global_1.GlobalValue.m_status.logout, "Bạn chưa login");
            this.SendMessage(session.ws, data_send);
            return;
        }
        let data_send = global_1.MessageResponse.createMessage(global_1.GlobalValue.m_status.send_mess, {
            nick: session.nick_name,
            mess: client_json.mess
        });
        this.SendMessageToAll(data_send);
    }
    logout(session) {
        try {
            session.uid = 0;
            session.nick_name = "";
            session.username = "";
            session.token = "";
            let data_send = global_1.MessageResponse.createMessage(global_1.GlobalValue.m_status.logout, "Logout A successfully!");
            this.SendMessage(session.ws, data_send);
        }
        catch (error) {
            let message = global_1.MessageResponse.createNotificationMessage({ api_name: "logout", description: "System Error!" });
            this.SendMessage(session.ws, message);
        }
    }
    getQueryString(params) {
        var esc = encodeURIComponent;
        return Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
    }
}
exports.WebsocketHandler = WebsocketHandler;
//# sourceMappingURL=WebsocketHandler.js.map