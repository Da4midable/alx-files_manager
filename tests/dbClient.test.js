import dbClient from '../utils/db';
import { expect } from 'chai';

describe('dbClient', () => {
  it('should correctly connect to the database', async () => {
    const isConnected = await dbClient.isAlive();
    expect(isConnected).to.be.true;
  });

  it('should return the correct number of users', async () => {
    const userCount = await dbClient.nbUsers();
    expect(userCount).to.be.a('number');
  });

  it('should return the correct number of files', async () => {
    const fileCount = await dbClient.nbFiles();
    expect(fileCount).to.be.a('number');
  });
});
