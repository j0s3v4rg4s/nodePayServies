import { PayU } from './pasarelas/payu.models'
import * as admin from 'firebase-admin'

export namespace User {

	const REF = "user"

	export interface User {
		key: string
		name: string
		payu?: PayU.IAccount
	}

	export async function createUser (name: string){
		const pat = admin.database().ref(REF).push()
		const us: User = {
			key: pat.key,
			name
		}
		await pat.set(us)
		return pat.key 
	}
}
