import { Server as NetServer, Socket, createServer } from 'net';
import { ClientManager } from './clientManager';
import logger from '../utils/logger';
import { AESCipher } from '../crypto/aes-chiper';

export class Server {
  private port: number;
  private clientManager: ClientManager;
  private server: NetServer;
  private aesCipher: AESCipher;

  constructor(port: number, clientManager: ClientManager) {
    this.port = port;
    this.clientManager = clientManager;
    this.server = createServer(this.handleConnection.bind(this));
    this.aesCipher = new AESCipher();
  }

  private handleConnection(socket: Socket) {
    logger.info('server: new client connected');

    this.clientManager.add(socket);

    socket.on('data', (data) => this.handleData(socket, data));
    socket.on('end', () => this.handleEnd(socket));
    socket.on('error', (err) => this.handleError(err));
  }

  private handleData(socket: Socket, data: Buffer) {
    console.log(data.toString());
    console.log(this.aesCipher.decrypt(data.toString()));

    const dataProp = this.aesCipher.decrypt(data.toString()).split('|');
    const n = dataProp.length;
    const message = dataProp[n - 1];
    const recipient = n === 1 ? 'all' : dataProp[0];

    logger.info(`server: data received from client: ${message}`);
    socket.write(`message received: ${message}`);
    this.clientManager.send(socket, message, recipient);
  }

  private handleEnd(socket: Socket) {
    logger.info('server: client disconnected');
    this.clientManager.remove(socket);
  }

  private handleError(err: Error) {
    logger.info(`server: socket Error: ${err}`);
  }

  public start() {
    this.server.listen(this.port, () => {
      logger.info(`server listening on port ${this.port}`);
    });
  }
}
