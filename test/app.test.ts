import * as request from 'supertest'
import { default as app } from '../src/app'

describe('get test', () => {
	it('should return 200', (done) => {
		request(app)
			.get('/')
			.expect(200, done)
	})
})
