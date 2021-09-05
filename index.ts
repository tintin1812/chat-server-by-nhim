import { server } from "./src/server";
import { GlobalValue } from "./src/global";

GlobalValue.getAllConfig();
server.getInstance();
process.on('SIGINT', () => {
    server.getInstance().stopServerEvent();
})