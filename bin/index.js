"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./src/server");
const global_1 = require("./src/global");
global_1.GlobalValue.getAllConfig();
server_1.server.getInstance();
process.on('SIGINT', () => {
    server_1.server.getInstance().stopServerEvent();
});
//# sourceMappingURL=index.js.map