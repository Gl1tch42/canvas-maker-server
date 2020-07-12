import request from 'supertest';
import app from '../../src/app';

describe('Checks if API is up:', () => {

	it('Responds 204 when request GET to api/.', done => {
		request(app)
			.get('/api')
			.expect(204, done);
	});

	it('Responds 404 when request GET to wrong route.', done => {
		request(app)
			.get('/api/wrong-random-path')
			.expect(404, done);
	});
});

describe('Checks POST request on api/signup route:', () => {

	it('Responds 200 to correct request body.', done => {

		const requestBody = {
			'email': 'me@email.com',
			'password': 'asdflkjasdlfj',
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(200, done);
	});

	it('Responds 422 to empty request body.', done => {
		request(app)
			.post('/api/signup')
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to incorrect email on request body.', done => {

		const requestBody = {
			'email': 'meemail.com',
			'password': 'asdflkjasdlfj',
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to incorrect too short password on request body.', done => {

		const requestBody = {
			'email': 'meemail.com',
			'password': 'asdj',
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to missing email on request body.', done => {

		const requestBody = {
			'password': 'asdflkjasdlfj',
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to missing password on request body.', done => {

		const requestBody = {
			'email': 'meemail.com',
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});
});
