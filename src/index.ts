import app from './app';

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
app.listen(port, () =>
	console.log(`Server listening at ${ port }`));
