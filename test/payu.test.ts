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

describe('generate user with data', () => {

    beforeAll((done) => {
        admin.auth().createUser({
            email: "c.alejo@pappcorn.com",
            password: "123456",
            uid: "camiloTest"
        }).then(() => done()).catch(err => console.log(err))
    })

    it('all parameters ok', (done) => {
        request(app)
            .post('/payu/addAccount')
            .send({
                uid: 'camiloTest',
                merchant: {
                    apiKey: 'string',
                    apiLogin: 'string'
                },
                accountId: 123456,
                merchantId: 123456
            })
            .expect(200)
            .end((err, res) => {
                expect(res.status).toBe(200)
                expect(res.body.complete).toEqual(true)
                done()
            })
    })

    afterAll((done) => {
        admin.auth().deleteUser("camiloTest").then(() => {
            done()
        })
    })
})


describe('validate token data', () => {

    beforeAll((done) => {
        admin.auth().createUser({
            email: "c.alejo@pappcorn.com",
            password: "123456",
            uid: "camiloTest"
        }).then(() => done()).catch(err => console.log(err))
    })

    it('send null  data', (done) => {
        request(app)
            .post('/payu/generateToken')
            .send({
                uid: 'camiloTest',
            })
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).toEqual('information is required')
                done()
            })

    })
    it('send null payerId', (done) => {
        request(app)
            .post('/payu/generateToken')
            .send({
                uid: 'camiloTest',
                data: {
                    name: 'Camilo Alejo',
                    identificationNumber: '1018464736',
                    paymentMethod: 'mastercard',
                    number: '4111111111111111',
                    expirationDate: '2018/12',
                }
            })
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).toEqual('invalid payerId')
                done()
            })
    })

    it('send null name', (done) => {
        request(app)
            .post('/payu/generateToken')
            .send({
                uid: 'camiloTest',
                data: {
                    payerId: 'camiloTest',
                    identificationNumber: '1018464736',
                    paymentMethod: 'mastercard',
                    number: '4111111111111111',
                    expirationDate: '2018/12',
                }
            })
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).toEqual('invalid name')
                done()
            })
    })

    it('send null identificationNumber', (done) => {
        request(app)
            .post('/payu/generateToken')
            .send({
                uid: 'camiloTest',
                data: {
                    payerId: 'camiloTest',
                    name: 'Camilo Alejo',
                    paymentMethod: 'mastercard',
                    number: '4111111111111111',
                    expirationDate: '2018/12',
                }
            })
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).toEqual('invalid identificationNumber')
                done()
            })

    })

    it('send null paymentMethod', (done) => {
        request(app)
            .post('/payu/generateToken')
            .send({
                uid: 'camiloTest',
                data: {
                    payerId: 'camiloTest',
                    name: 'Camilo Alejo',
                    identificationNumber: '1018464736',
                    number: '4111111111111111',
                    expirationDate: '2018/12',
                }
            })
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).toEqual('invalid paymentMethod')
                done()
            })
    })

    it('send null number', (done) => {
        request(app)
            .post('/payu/generateToken')
            .send({
                uid: 'camiloTest',
                data: {
                    payerId: 'camiloTest',
                    name: 'Camilo Alejo',
                    identificationNumber: '1018464736',
                    paymentMethod: 'mastercard',
                    expirationDate: '2018/12',
                }
            })
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).toEqual('invalid number')
                done()
            })
    })

    it('send null expirationDate', (done) => {
        request(app)
            .post('/payu/generateToken')
            .send({
                uid: 'camiloTest',
                data: {
                    payerId: 'camiloTest',
                    name: 'Camilo Alejo',
                    identificationNumber: '1018464736',
                    paymentMethod: 'mastercard',
                    number: '4111111111111111',
                }
            })
            .expect(400)
            .end((err, res) => {
                expect(res.status).toBe(400)
                expect(res.body.error).toEqual('invalid expirationDate')
                done()
            })
    })

    afterAll((done) => {
        admin.auth().deleteUser("camiloTest").then(() => {
            done()
        })
    })

})

// Por hacer
// validatePayNoData
