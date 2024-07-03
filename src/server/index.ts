import { ClientManager } from './clientManager';
import { Server } from './server';
import { config } from 'dotenv';

config();

const port: number = parseInt(process.env.PORT || '4000', 10);

const clientManager = new ClientManager();
const server = new Server(port, clientManager);
server.start();
