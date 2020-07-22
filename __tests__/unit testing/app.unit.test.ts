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
			.get(`/api/${ faker.random.word() }`)
			.expect(404, done);
	});
});


describe('Checks POST request on api/signup route:', () => {

	it('Responds 400 to missing method on request body.', done => {

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
			.expect(400, {
				'errors': ['Method field is missing.']
			}, done);
	});


	it('Responds 400 to invalid method on request body.', done => {

		const requestBody = {
			'method': faker.random.word(),
			'name': faker.name.findName(),
			'nickname': faker.internet.userName(),
			'email': faker.internet.email(),
			'password': faker.internet.password()
		};

		request(app)
			.post('/api/signup')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(400, {
				'errors': ['Method field is invalid.']
			}, done);
	});


	describe('Check for signup using the local method.', () => {

		it('Responds 200 to correct request body.', done => {

			const requestBody = {
				'method': 'local',
				'name': faker.name.findName(),
				'nickname': faker.internet.userName(),
				'email': faker.internet.email(),
				'password': faker.internet.password()
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(/\{"token":\s*"(.)+\.(.)+\.(.)+"\}/u)
				.expect(200, done);
		});


		it('Responds 400 to incorrect email on request body.', done => {

			const requestBody = {
				'method': 'local',
				'name': faker.name.findName(),
				'nickname': faker.internet.userName(),
				'email': 'incorrectemail.format',
				'password': faker.internet.password()
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(400, {
					'errors': ['Email format is incorrect.']
				}, done);
		});


		it('Responds 400 to incorrect, too short, password on request body.', done => {

			const requestBody = {
				'method': 'local',
				'name': faker.name.findName(),
				'nickname': faker.internet.userName(),
				'email': faker.internet.email(),
				'password': 'abc'
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(400, {
					'errors': ['Password should be at least 7 characters long.']
				}, done);
		});


		it('Responds 400 to missing email on request body.', done => {

			const requestBody = {
				'method': 'local',
				'name': faker.name.findName(),
				'nickname': faker.internet.userName(),
				'password': faker.internet.password()
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(400, {
					'errors': ['Email field missing.']
				}, done);
		});


		it('Responds 400 to missing password on request body.', done => {

			const requestBody = {
				'method': 'local',
				'name': faker.name.findName(),
				'nickname': faker.internet.userName(),
				'email': faker.internet.email()
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(400, {
					'errors': ['Password field missing.']
				}, done);
		});


		it('Responds 400 to missing name on request body.', done => {

			const requestBody = {
				'method': 'local',
				'nickname': faker.internet.userName(),
				'email': faker.internet.email(),
				'password': faker.internet.password()
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(400, {
					'errors': ['Name field missing.']
				}, done);
		});


		it('Responds 400 to missing nickname on request body.', done => {

			const requestBody = {
				'method': 'local',
				'name': faker.name.findName(),
				'email': faker.internet.email(),
				'password': faker.internet.password()
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(400, {
					'errors': ['Nickname field missing.']
				}, done);
		});


		it('Responds 403 when requested to create user with existent nickname.', done => {
			const requestBody = {
				'method': 'local',
				'name': faker.name.findName(),
				'nickname': 'John Doe',
				'email': faker.internet.email(),
				'password': faker.internet.password()
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(403, {
					'errors': ['A user already exists with this nickname.']
				}, done);
		});


		it('Responds 403 when requested to create user with existent email.', done => {
			const requestBody = {
				'method': 'local',
				'name': faker.name.findName(),
				'nickname': faker.internet.userName(),
				'email': 'test@test.com',
				'password': 'password'
			};

			request(app)
				.post('/api/signup')
				.send(requestBody)
				.expect('Content-Type', /json/u)
				.expect(403, {
					'errors': ['A user already exists with this email.']
				}, done);
		});
	});
});


describe('Checks POST request on api/signin route:', () => {

	it('Responds 400 to missing method on request body.', done => {

		const requestBody = {
			'name': faker.name.findName(),
			'email': faker.internet.email(),
			'password': faker.internet.password()
		};

		request(app)
			.post('/api/signin')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(400, {
				'errors': ['Method field is missing.']
			}, done);
	});


	it('Responds 400 to invalid method on request body.', done => {

		const requestBody = {
			'method': faker.random.word(),
			'email': faker.internet.email(),
			'password': faker.internet.password()
		};

		request(app)
			.post('/api/signin')
			.send(requestBody)
			.expect('Content-Type', /json/u)
			.expect(400, {
				'errors': ['Method field is invalid.']
			}, done);
	});


	describe('Check for signin using the local method.', () => {

		it('Responds 200 to correct request body.', done => {

			const signinRequestBody = {
				'method': 'local',
				'email': 'test@test.com',
				'password': 'password'
			};

			request(app)
				.post('/api/signin')
				.send(signinRequestBody)
				.expect(/\{"token":\s*"(.)+\.(.)+\.(.)+"\}/u)
				.expect(200, done);
		});


		it('Responds 400 to missing email on request body.', done => {

			const signinRequestBody = {
				'method': 'local',
				'password': 'password'
			};

			request(app)
				.post('/api/signin')
				.send(signinRequestBody)
				.expect('Content-Type', /json/u)
				.expect(400, {
					'errors': ['Email field missing.']
				}, done);
		});


		it('Responds 400 to missing password on request body.', done => {

			const signinRequestBody = {
				'method': 'local',
				'email': 'test@test.com'
			};

			request(app)
				.post('/api/signin')
				.send(signinRequestBody)
				.expect('Content-Type', /json/u)
				.expect(400, {
					'errors': ['Password field missing.']
				}, done);
		});


		it('Responds 404 to unexisting email account on request body.', done => {

			const signinRequestBody = {
				'method': 'local',
				'email': faker.internet.email(),
				'password': faker.internet.password()
			};

			request(app)
				.post('/api/signin')
				.send(signinRequestBody)
				.expect('Content-Type', /json/u)
				.expect(404, {
					'errors': ['A user with this email does not exist.']
				}, done);
		});


		it('Responds 401 to wrong password on request body.', done => {

			const signinRequestBody = {
				'method': 'local',
				'email': 'test@test.com',
				'password': faker.internet.password()
			};

			request(app)
				.post('/api/signin')
				.send(signinRequestBody)
				.expect('Content-Type', /json/u)
				.expect(401, {
					'errors': ['Incorrect password.']
				}, done);
		});
	});
});
