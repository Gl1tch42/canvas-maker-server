/* eslint-disable no-undef */

import request from 'supertest';
import app from '../../src/app';

describe('Check express server', () => {

	it('Responds 200 to /', done => {
		request(app)
			.get('/')
			.expect(200, done);
	});
});
