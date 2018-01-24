import * as express from 'express'
import * as admin from 'firebase-admin'
import { User } from '../models/user.models'

export function loginAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
	const { uid } = req.body
	if (uid == null) next('uid parameter is required')
	else {
		admin
			.auth()
			.getUser(uid)
			.then((userRecord) => {
				const extraParameters: any = userRecord.customClaims
				if (extraParameters && extraParameters.admin) next()
				else next('This operation is not permitted by this user')
			})
			.catch((err) => {
				next(err)
			})
	}
}

export function loginUser(req: express.Request, res: express.Response, next: express.NextFunction) {
	const { uid } = req.body
	if (uid == null) next('uid parameter is required')
	else {
		admin
			.auth()
			.getUser(uid)
			.then(() => next())
			.catch((err) => next(err))
	}
}

export function errorHandle(
	err: express.ErrorRequestHandler,
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) {
	res.status(400)
	const errRes: IRespond = {
		complete: false,
		error: err.toString(),
		data: null
	}
	res.json(errRes)
}

export interface IRespond {
	complete: boolean
	error: string
	data?: any
}
