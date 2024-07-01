import { createConnection, Socket } from 'net';
import { createInterface } from 'readline';
import logger from '../utils/logger';

export class Client {
  private port: number;
  private client: Socket;

  constructor(port: number) {
    this.port = port;
    this.client = createConnection({ port: this.port }, () => this.onConnect());
    this.init();
  }

  private init() {
    this.client.on('data', (data) => this.onData(data));
    this.client.on('end', () => this.onEnd());
    this.client.on('error', (err) => this.onError(err));
    this.setupReadLine();
  }

  private onConnect() {
    logger.info('client: connected to server');
  }

  private onData(data: Buffer) {
    const message = data.toString();

    if (message.startsWith('message received:')) {
      logger.info('client: server acknowledged receipt of the message');
    } else {
      logger.info(`client: data received from server: ${message}`);
    }
  }

  private onEnd() {
    logger.info('client: disconnected from server');
  }

  private onError(err: Error) {
    logger.info(`client: client error: ${err}`);
  }

  private setupReadLine = () => {
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> ',
    });

    readline.setPrompt(
      '\nEnter message format: <Recipient (all/specific client names)|Message>:\n'
    );
    readline.prompt();

    readline.on('line', (line) => {
      console.log(`typed message: ${line}`);

      this.client.write(line);
      readline.prompt();
    });

    readline.on('close', () => {
      this.client.end();
    });
  };
}
