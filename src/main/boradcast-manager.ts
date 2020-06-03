import getPort from 'get-port';
import WebSocket from 'ws';

export class BoardcastManager {
    private static mInstance: Promise<BoardcastManager>;
    private mPort = 0;
    private mWebSocket: WebSocket.Server;

    static async getInstance() {
        if (!this.mInstance) {
            this.mInstance = (async () => {
                const port = await getPort();
                const instance = new BoardcastManager(port);
                return instance;
            })();
        }
        return this.mInstance;
    }

    constructor(port: number) {
        this.mPort = port;
        this.mWebSocket = new WebSocket.Server({
            port,
        });

        this.mWebSocket.on('connection', ws => {
            ws.on('message', message => {
                // 对于心跳检测，仅返回消息给来检测的client；其他消息广播出去给其他所有client
                if (message === 'ping') {
                    console.log('receive ping, current client number: ', this.mWebSocket.clients.size);
                    this.mWebSocket.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN && client === ws) {
                            client.send(message);
                        }
                    });
                } else {
                    this.mWebSocket.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN && client !== ws) {
                            client.send(message);
                        }
                    });
                }
            });
        });
    }

    getPort() {
        return this.mPort;
    }
}
