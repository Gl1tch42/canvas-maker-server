import request from 'supertest';
import app from '../../src/app';
import faker from 'faker';

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
			'name': faker.name.findName(),
			'nickname': faker.internet.userName(),
			'email': faker.internet.email(),
			'password': faker.internet.password()
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
			'name': faker.name.findName(),
			'nickname': faker.internet.userName(),
			'email': 'incorrectemail.com',
			'password': faker.internet.password()
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to incorrect too short password on request body.', done => {

		const requestBody = {
			'name': faker.name.findName(),
			'nickname': faker.internet.userName(),
			'email': faker.internet.email(),
			'password': 'abc'
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to missing email on request body.', done => {

		const requestBody = {
			'name': faker.name.findName(),
			'nickname': faker.internet.userName(),
			'password': faker.internet.password()
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to missing password on request body.', done => {

		const requestBody = {
			'name': faker.name.findName(),
			'nickname': faker.internet.userName(),
			'email': faker.internet.email()
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to missing name on request body.', done => {

		const requestBody = {
			'nickname': faker.internet.userName(),
			'email': faker.internet.email(),
			'password': faker.internet.password()
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});

	it('Responds 422 to missing nickname on request body.', done => {

		const requestBody = {
			'name': faker.name.findName(),
			'email': faker.internet.email(),
			'password': faker.internet.password()
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(422, done);
	});
});
