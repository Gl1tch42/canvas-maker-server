import request from 'supertest';
import app from '../src/app';
import faker from 'faker';

describe('Checks if API is up:', () => {

	it('Responds 204 when request GET to api/.', done => {
		request(app)
			.get('/api')
			.expect(204, done);
	});

	it('Responds 404 when request GET to wrong route.', done => {
		request(app)
			.get(`/api/${ faker.random.word() }`)
			.expect(404, done);
	});
});
