"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class GlobalValue {
    static getConfig(cb) {
        try {
            fs_1.default.readFile('./src/config.json', 'utf8', (err, data) => {
                if (err)
                    throw err;
                this.author_url = JSON.parse(data).author_url;
                this.api_game_url = JSON.parse(data).api_game_url;
                this.port = JSON.parse(data).port;
                this.debug = JSON.parse(data).debug;
                cb(this.author_url);
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    static getAllConfig() {
        try {
            fs_1.default.readFile('./src/config.json', 'utf8', async (err, data) => {
                if (err)
                    throw err;
                this.author_url = JSON.parse(data).author_url;
                this.api_game_url = JSON.parse(data).api_game_url;
                this.port = JSON.parse(data).port;
                this.debug = JSON.parse(data).debug;
                console.log("load all config");
            });
        }
        catch (error) {
            console.log("error log:" + error);
        }
    }
}
GlobalValue.port = 8081;
GlobalValue.debug = false;
GlobalValue.m_status = {
    notification: 'notification',
    error: 'error',
    register: 'register',
    login: 'login',
    logout: 'logout',
    post: 'post',
    game_api: 'game_api',
    get: 'get',
    require: 'require',
    send_mess: 'send_mess'
};
GlobalValue.c_status = {
    success: 1,
    error_system: -1,
    error_timeout: -2,
    error_login: -3,
    error_uid: -4,
    error_parseJson: -5,
    error_xhttp: -6,
    error_noGame: -7,
    error_noMethod: -8,
    error_ws: -9,
    error_wsNoExist: -10
};
exports.GlobalValue = GlobalValue;
class MessageResponse {
    static createNotificationMessage(data) {
        return JSON.stringify({
            m: GlobalValue.m_status.notification,
            d: data
        });
    }
    static createMessage(api_name, data) {
        return JSON.stringify({
            m: api_name,
            d: data == null || data.length == 0 ? null : data
        });
    }
    static createMessageJoinLeave(st, name, code, desc) {
        return JSON.stringify({
            m: st ? GlobalValue.m_status.login : GlobalValue.m_status.logout,
            d: {
                c: code,
                d: desc
            }
        });
    }
}
exports.MessageResponse = MessageResponse;
//# sourceMappingURL=global.js.map