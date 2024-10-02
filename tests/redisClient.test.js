import redisClient from '../utils/redis';
import { expect } from 'chai';

describe('redisClient', () => {
  it('should correctly connect to Redis', () => {
    expect(redisClient.isAlive()).to.be.true;
  });

  it('should return the correct value for a key', async () => {
    await redisClient.set('test_key', 'test_value', 10);
    const value = await redisClient.get('test_key');
    expect(value).to.equal('test_value');
  });

  it('should handle key expiration', async () => {
    await redisClient.set('expire_key', 'expire_value', 1);
    const value = await redisClient.get('expire_key');
    expect(value).to.equal('expire_value');

    await new Promise(resolve => setTimeout(resolve, 1100)); // Wait for key to expire
    const expiredValue = await redisClient.get('expire_key');
    expect(expiredValue).to.be.null;
  });
});
