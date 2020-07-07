/* eslint-disable no-undef */

import request from 'supertest';
import app from '../../src/app';

describe('Check api responses:', () => {

	it('Responds 204 to api/', done => {
		request(app)
			.get('/api')
			.expect(204, done);
	});

	it('Responds 404 to everything else', done => {
		request(app)
			.get('/foo/bar')
			.expect(404, done);
	});

	it('Responds 200 to api/signup', done => {
		request(app)
			.get('/api/signup')
			.expect(200, done);
	});
});
