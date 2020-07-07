/* eslint-disable no-undef */

import request from 'supertest';
import app from '../../src/app';

describe('Check api responses:', () => {

	it('Responds 204 to /', done => {
		request(app)
			.get('/')
			.expect(204, done);
	});

	it('Responds 404 to everything else', done => {
		request(app)
			.get('/foo/bar')
			.expect(404, done);
	});
});
