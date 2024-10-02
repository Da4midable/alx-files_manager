import { ObjectId } from 'mongodb';
import dbClient from '../utils/db.js';
import sha1 from 'sha1';
import redisClient from '../utils/redis.js';
import Bull from 'bull';

// Create a Bull queue for processing welcome email jobs
const userQueue = new Bull('userQueue');

class UsersController {
  // POST /users => Creates a new user and adds a job to the email queue
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);
    const newUser = { email, password: hashedPassword };

    // Insert the new user into the database
    const result = await dbClient.db.collection('users').insertOne(newUser);

    // Add the new user to the userQueue for sending the welcome email
    userQueue.add({ userId: result.insertedId });

    // Return the response with the created user details
    return res.status(201).json({
      id: result.insertedId,
      email: newUser.email,
    });
  }

  // GET /users/me => Retrieves the authenticated user profile
  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
