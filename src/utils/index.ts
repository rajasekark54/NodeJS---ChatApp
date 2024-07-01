import { Socket } from 'net';
import * as crypto from 'crypto';

const generateClientId = (socket: Socket): string => {
  const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
  return crypto.createHash('md5').update(clientInfo).digest('hex');
};

export { generateClientId };
