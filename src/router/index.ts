import { Router } from 'express'
import { User } from '../models/user.models'

const index: Router = Router()

index.get('/', (req, res, nex) => {
	res.send('Hola index 9')
})

index.post('/newUser', async (req, res) => {
	const data = req.body
	if (data.name) {
		try {
			const key = await User.createUser(data.name)
			const resp: IRespond = {
				complete: true,
				error: null,
				data: { key }
			}
			res.status(200).json(resp)
		} catch (error) {
			const resp: IRespond = {
				complete: false,
				error: error,
				data: null
			}
			res.status(400).json(resp)
		}
	} else {
		const resp: IRespond = {
			complete: false,
			error: 'Name is necessary',
			data: null
		}
		res.status(400).json(resp)
	}
})

export default index

// ----------------------------------------------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------------------------------------------
interface DataPayU {
	// Merchant data when
	merchant: {
		apiKey: string
		apiLogin: string
	}
	accountId: number
	merchantId: number
	url: string
	urlReport: string
	respond: string
}

interface IRespond {
	complete: boolean
	error: string
	data?: any
}
