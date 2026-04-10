import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/posts', postsRouter);

export default app;
