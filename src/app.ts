import express from 'express';

const app = express();

app.use(express.json({ limit: '10kb' }));

export default app;
