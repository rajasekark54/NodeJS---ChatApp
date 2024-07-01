import { ClientManager } from './clientManager';
import { Server } from './server';

const port = 3000;
const clientManager = new ClientManager();
const server = new Server(port, clientManager);
server.start();
