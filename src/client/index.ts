import { Client } from './client';
import { config } from 'dotenv';

config();
new Client(3000);
