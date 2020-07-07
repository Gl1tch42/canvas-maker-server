import express from 'express';
import xss from 'xss-clean';

import routes from './routes';

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(xss());

app.use('/api', routes);


export default app;
