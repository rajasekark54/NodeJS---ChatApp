interface ClientObject {
  client: object;
  name: string;
}

export interface Client {
  [key: string]: ClientObject;
}

export interface ClientNameIdMap {
  [key: string]: string;
}
