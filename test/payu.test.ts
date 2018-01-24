import * as request from 'supertest'
import { default as app } from '../src/app'
import * as admin from 'firebase-admin'

describe('validate params payU', () => {
	it('no send parameters', (done) => {
		request(app)
			.post('/payu/addAccount')
			.send({ uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1' })
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual('PayU account is required')
				done()
			})
	})

	it('send null accountId', (done) => {
		request(app)
			.post('/payu/addAccount')
			.send({
				uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1',
				merchant: {
					apiKey: 'string',
					apiLogin: ''
				},
				merchantId: 'number'
			})
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual('accountId is required')
				done()
			})
	})

	it('send string as accountId', (done) => {
		request(app)
			.post('/payu/addAccount')
			.send({
				uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1',
				merchant: {
					apiKey: 'string',
					apiLogin: 'string'
				},
				accountId: '123456',
				merchantId: 123456
			})
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual('accountId must be a number')
				
				done()
			})
	})

	it('send null merchantId', (done) => {
		request(app)
			.post('/payu/addAccount')
			.send({
				uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1',
				merchant: {
					apiKey: 'string',
					apiLogin: 'string'
				},
				accountId: 123456
			})
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual('merchantId is required')
				done()
			})
	})

	it('send string as merchantId', (done) => {
		request(app)
			.post('/payu/addAccount')
			.send({
				uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1',
				merchant: {
					apiKey: 'string',
					apiLogin: 'string'
				},
				accountId: 123456,
				merchantId: '123456'
			})
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual('merchantId must be a number')
				done()
			})
	})

	it('send null merchant', (done) => {
		request(app)
			.post('/payu/addAccount')
			.send({
				uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1',
				accountId: 123456,
				merchantId: 123456
			})
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual('merchant is required')
				done()
			})
	})

	it('send null merchant.apiKey', (done) => {
		request(app)
			.post('/payu/addAccount')
			.send({
				uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1',
				merchant: {
					apiLogin: 'string'
				},
				accountId: 123456,
				merchantId: 123456
			})
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual('apiKey is required')
				done()
			})
	})

	it('send null merchant.apiLogin', (done) => {
		request(app)
			.post('/payu/addAccount')
			.send({
				uid: 'MvtkPIyp7mf3dzIXc8jofyF4eJg1',
				merchant: {
					apiKey: 'string',
				},
				accountId: 123456,
				merchantId: 123456
			})
			.expect(400)
			.end((err, res) => {
				expect(res.status).toBe(400)
				expect(res.body.error).toEqual('apiLogin is required')
				done()
			})
	})


})

