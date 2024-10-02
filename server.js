import express from 'express';
import routes from './routes/index.js'; // Adjust the path as needed
import dbClient from './utils/db.js';   // Ensure the DB client is imported

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// (Optional) Middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body);
  next();
});

// Use routes only after database connection is ready
dbClient.connect().then(() => {
  console.log('Database connection established, starting the server...');

  // Use the routes
  app.use('/', routes);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to the database:', err);
});
