import * as request from 'supertest'
import { default as app } from '../src/app'
import * as admin from 'firebase-admin'

describe('Validate authentication of uid', () => {
	it('Create a user without token', (done) => {
		request(app)
			.post('/newUser')
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				done()
			})
	})

	it('Create a user with a invalid token', (done) => {
		request(app)
			.post('/newUser')
			.send({ uid: 'bla' })
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).not.toBeNull()
				done()
			})
	})

	it('Create user as valid token without email and password', (done) => {
		request(app)
			.post('/newUser')
			.send({ uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1' })
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toBe('email and password are required')
				done()
			})
	})
})

describe('create user', () => {
	it('Create a user', (done) => {
		request(app)
			.post('/newUser')
			.send({ uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1', email: 'p@p.com', password: '123456' })
			.expect(200)
			.end((err, res) => {
				expect(res.status).toBe(200)
				expect(res.body.data).not.toBeNull()
				done()
			})
	})

	it('Create a existent user', (done) => {
		request(app)
			.post('/newUser')
			.send({ uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1', email: 'p@p.com', password: '123456' })
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).not.toBeNull()
				done()
			})
	})

	afterAll((done) => {
		admin
			.auth()
			.getUserByEmail('p@p.com')
			.then((user) => {
				admin.auth().deleteUser(user.uid)
				done()
			})
			.catch(() => done())
	})
})

describe('create a user with a not admin user', () => {
	let uid: string
	beforeAll((done) => {
		admin.auth().createUser({
			email: "p@p.com",
			password: "123456",
			uid: "uid123456"
		}).then(()=> done()).catch(err=> console.log(err))
	})

	it("Invalid admin user", done=>{
		request(app)
			.post('/newUser')
			.send({ uid: "uid123456", email: 'p@p.com', password: '123456' })
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual("This operation is not permitted by this user")
				done()
			})
	})

	afterAll((done) => {
		admin.auth().deleteUser("uid123456")
	})
})
