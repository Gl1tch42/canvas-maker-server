import request from 'supertest';
import app from '../../src/app';

describe('Checks POST request on api/signup route:', () => {

	it('Responds 403 when request to create already existent user.', done => {
		const requestBody = {
			'name': 'test',
			'nickname': 'test',
			'email': 'test@test.com',
			'password': 'testest'
		};

		request(app)
			.post('/api/signup')
			.send(requestBody);

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(403, done);
	});
});
