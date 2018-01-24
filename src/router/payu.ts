// ----------------------------------------------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------------------------------------------
import { Router } from 'express'
import { loginUser, IRespond } from '../config'
import { PayU } from '../models/pasarelas/payu.models'
import { User } from '../models/user.models'

// ----------------------------------------------------------------------------------------------------------------
// Attributes
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------
// Routers
// ----------------------------------------------------------------------------------------------------------------
const payu: Router = Router()
payu.use(loginUser)

payu.post('/addAccount', (req, res, next) => {
	const { uid } = req.body
	delete req.body.uid
	const data: PayU.IAccount = req.body
	const err = PayU.validateAccount(data)
	if (err === '') {
		User.addPayuAccount(uid, data)
			.then(() => {
				const resp: IRespond = {
					complete: true,
					error: null,
					data: null
				}
				res.status(200).json(resp)
			})
			.catch((err) => next(err))
	} else next(err)
})

export default payu
