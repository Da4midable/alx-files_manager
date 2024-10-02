import Bull from 'bull';
import { promises as fs } from 'fs';
import path from 'path';
import imageThumbnail from 'image-thumbnail';
import dbClient from '../utils/db';
import { ObjectId } from 'mongodb';

// Create the queues
const fileQueue = new Bull('fileQueue', { redis: { host: '127.0.0.1', port: 6379 } });
const userQueue = new Bull('userQueue', { redis: { host: '127.0.0.1', port: 6379 } });

// Process fileQueue for generating thumbnails
fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }
  if (!userId) {
    throw new Error('Missing userId');
  }

  const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });
  if (!file) {
    throw new Error('File not found');
  }

  const sizes = [500, 250, 100];
  const localPath = file.localPath;

  try {
    for (const size of sizes) {
      const thumbnail = await imageThumbnail(localPath, { width: size });
      const thumbnailPath = `${localPath}_${size}`;
      await fs.writeFile(thumbnailPath, thumbnail);
    }
  } catch (error) {
    console.error('Error generating thumbnails:', error);
  }
});


userQueue.process(async (job) => {
  const { userId } = job.data;

  if (!userId) {
    throw new Error('Missing userId');
  }

  const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });
  if (!user) {
    throw new Error('User not found');
  }

  // Simulate sending a welcome email
  console.log(`Welcome ${user.email}!`);

});
