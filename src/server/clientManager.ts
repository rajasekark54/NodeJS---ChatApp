import { Socket } from 'net';
import { Client, ClientNameIdMap } from './interface';
import { generateClientId } from '../utils/index';

export class ClientManager {
  private clients: Client;
  private clientNameIdMap: ClientNameIdMap;

  constructor() {
    this.clients = {};
    this.clientNameIdMap = {};
  }

  clientNewName() {
    const clientNameIds = Object.keys(this.clientNameIdMap);

    if (!clientNameIds.length) return `client-1`;
    const lastName = clientNameIds[clientNameIds.length - 1];
    const lastNameKey = lastName.replace('client-', '');
    return `client-${Number(lastNameKey) + 1}`;
  }

  add(client: Socket) {
    const clientId = generateClientId(client);
    const clientName = this.clientNewName();

    this.clients[clientId] = {
      client,
      name: clientName,
    };

    this.clientNameIdMap[clientName] = clientId;
    client.write(
      `User created successfully. User ID: ${clientId}, Username: ${clientName}.`
    );

    const message = `New user added to the chat: ${clientName}.`;
    this.send(client, message, 'all');
  }

  remove(client: Socket) {
    const clientId = generateClientId(client);
    const clientName = this.clients[clientId].name;
    delete this.clients[clientId];
    delete this.clientNameIdMap[clientName];
  }

  send(sender: Socket, message: string, recipient: string) {
    const recipients = recipient.split(',');
    const senderId = generateClientId(sender);

    if (recipients.includes('all'))
      return this.sendAllRecipient(senderId, message);
    this.sendRecipients(senderId, message, recipients);
  }

  sendAllRecipient(senderId: string, message: string) {
    const { client: sender, name } = this.clients[senderId];

    for (const item of Object.values(this.clients)) {
      const client: any = item.client;
      if (client === sender) continue;

      const data = {
        from: name,
        message,
      };

      client.write(JSON.stringify(data));
    }
  }

  sendRecipients(senderId: string, message: string, recipients: string[]) {
    const { client: sender, name } = this.clients[senderId];

    for (const name of recipients) {
      const clientId = this.clientNameIdMap[name];
      const client: any = this.clients[clientId].client;

      if (client === sender) continue;

      const data = {
        from: name,
        message,
      };

      client.write(JSON.stringify(data));
    }
  }
}
