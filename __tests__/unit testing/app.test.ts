/* eslint-disable no-undef */

import request from 'supertest';
import app from '../../src/app';

describe('Check api responses:', () => {

	it('Responds 204 when request GET to api/', done => {
		request(app)
			.get('/api')
			.expect(204, done);
	});

	it('Responds 404 when request GET to wrong route', done => {
		request(app)
			.get('/wrong-random-path')
			.expect(404, done);
	});

	it('Responds 422 when request POST to api/signup with incorect request body', done => {
		request(app)
			.post('/api/signup')
			.expect(422, done);
	});
});
