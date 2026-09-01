import { MongoMemoryServer } from 'mongodb-memory-server';
import * as path from 'path';

export default async function initDB() {
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: path.join(__dirname, '../../data'),
      },
    });
    const uri = mongod.getUri();

    return uri;
  } catch (err) {
    console.log(err);
    throw new Error('Failed to connect to the database');
  }
}
