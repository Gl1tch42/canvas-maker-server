import express from 'express';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
	res.status(204).send();
});

export default app;
