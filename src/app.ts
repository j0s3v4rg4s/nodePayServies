// -----------------------------------------------------------------
// Imports library
// -----------------------------------------------------------------
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as path from 'path'
import * as admin from 'firebase-admin'

// -----------------------------------------------------------------
// Import router
// -----------------------------------------------------------------
import { default as index } from './router/index'

// -----------------------------------------------------------------
// Attributes
// -----------------------------------------------------------------
const app: express.Express = express()
const serviceAccount = require('./assets/admin.json')

// -----------------------------------------------------------------
// Use express
// -----------------------------------------------------------------

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://payu-af50f.firebaseio.com'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(index)

export default app
