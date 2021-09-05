import fs from 'fs';
export class GlobalValue {
    public static author_url: string;
    public static api_game_url : string;
    public static port: number = 8081;
    public static debug: boolean = false;
    public static m_status = {
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
    }

    public static c_status = {
        success: 1,
        error_system: -1, // lỗi hệ thống
        error_timeout: -2, //timeout
        error_login: -3,//login
        error_uid: -4,
        error_parseJson: -5,
        error_xhttp: -6, //error xhttp
        error_noGame: -7, // ko có game trong hệ thống 
        error_noMethod: -8,
        error_ws: -9,
        error_wsNoExist: -10
    }

    public static getConfig(cb: any) {
        try {
            fs.readFile('./src/config.json', 'utf8', (err, data: string) => {
                if (err)
                    throw err;
                this.author_url = JSON.parse(data).author_url;
                this.api_game_url = JSON.parse(data).api_game_url;
                this.port = JSON.parse(data).port
                this.debug = JSON.parse(data).debug
                cb(this.author_url);
            })
        } catch (error ) {
            console.log(error);
        }
    }
    public static getAllConfig() {
        try {
            fs.readFile('./src/config.json', 'utf8', async (err, data: string) => {
                if (err)
                    throw err;
                this.author_url = JSON.parse(data).author_url;
                this.api_game_url = JSON.parse(data).api_game_url;
                this.port = JSON.parse(data).port
                this.debug = JSON.parse(data).debug
                console.log("load all config")
            })
        } catch (error) {
            console.log("error log:" + error);
        }
        
    }

    
}

export class MessageResponse {
    static createNotificationMessage(data: any): string {
        return JSON.stringify({
            m: GlobalValue.m_status.notification,
            d: data
        })
    }

    static createMessage(api_name: string, data?: any): string {
        return JSON.stringify({
            m: api_name,
            d: data == null || data.length == 0 ? null : data
        })
        
    }



    static createMessageJoinLeave(st: boolean, name: string, code: number, desc: string) {
        return JSON.stringify({
            m: st ? GlobalValue.m_status.login : GlobalValue.m_status.logout,
            d: {
                c: code,
                    d: desc
            }
        })
    }
}

