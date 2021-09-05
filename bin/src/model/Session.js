"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const global_1 = require("../global");
class Session {
    constructor() {
        this.uid = 0;
        this.username = "";
        this.nick_name = "";
        this.token = "";
    }
    destroy() {
        try {
            if (this.ws) {
                this.ws.removeAllListeners();
                this.ws.close();
            }
        }
        catch (error) {
            console.log(`Session ${error.stack}`);
        }
    }
    send(str) {
        try {
            if (this.ws.readyState == this.ws.OPEN) {
                let unit = str;
                if (!global_1.GlobalValue.debug)
                    unit = new util_1.TextEncoder().encode(str);
                this.ws.send(unit);
            }
        }
        catch (error) {
            console.log(`Session ${error.stack}`);
        }
    }
}
exports.Session = Session;
//# sourceMappingURL=Session.js.map