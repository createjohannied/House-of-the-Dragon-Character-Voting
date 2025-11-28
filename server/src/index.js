import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import charactersRouter from './routes/api.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'House of the Dragon Character Voting API',
    endpoints: {
      'GET /api/characters': 'Get all characters',
      'POST /api/characters': 'Create a new character',
      'PUT /api/characters/:id/vote': 'Vote for a character',
      'DELETE /api/characters/:id': 'Delete a character'
    }
  });
});

app.use('/api', charactersRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
