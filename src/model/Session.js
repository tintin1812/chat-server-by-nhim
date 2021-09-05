"use strict";
exports.__esModule = true;
var util_1 = require("util");
var global_1 = require("../global");
var Session = /** @class */ (function () {
    function Session() {
        this.uid = 0;
        this.username = "";
        this.nick_name = "";
        this.token = "";
    }
    Session.prototype.destroy = function () {
        try {
            if (this.ws) {
                this.ws.removeAllListeners();
                this.ws.close();
            }
        }
        catch (error) {
            console.log("Session " + error.stack);
        }
    };
    Session.prototype.send = function (str) {
        try {
            if (this.ws.readyState == this.ws.OPEN) {
                var unit = str;
                if (!global_1.GlobalValue.debug)
                    unit = new util_1.TextEncoder().encode(str);
                this.ws.send(unit);
            }
        }
        catch (error) {
            console.log("Session " + error.stack);
        }
    };
    return Session;
}());
exports.Session = Session;
