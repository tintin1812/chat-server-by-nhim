import * as WebSocketServer from 'ws';
import { TextEncoder } from 'util';
import { GlobalValue } from '../global';

export class Session {
    public ws!: WebSocketServer;
    public uid: number = 0;
    public username: string = "";
    public nick_name: string = "";
    public token: string = "";
    destroy() {
        try {
            if(this.ws) {
                this.ws.removeAllListeners();
                this.ws.close();
            }
        } catch (error) {
            console.log(`Session ${error.stack}`);
        }
    }
    send(str: any) {  
        try {
            if (this.ws.readyState == this.ws.OPEN) {
                let unit = str;
                if (!GlobalValue.debug)
                    unit = new TextEncoder().encode(str);
                this.ws.send(unit);
            }
        } catch (error) {
            console.log(`Session ${error.stack}`);
        }
    }

}

