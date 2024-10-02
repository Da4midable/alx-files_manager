import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import logger from './middleware/logger.js'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.use(' ')


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
