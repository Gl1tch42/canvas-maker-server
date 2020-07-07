import express from 'express';

import routes from './routes';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use('/api', routes);


export default app;
