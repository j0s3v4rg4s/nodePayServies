import { PayU } from './pasarelas/payu.models'
import * as admin from 'firebase-admin'
const uid = require('uid')

export namespace User {
	// ----------------------------------------------------------------------------------------------------------------
	// Constants
	// ----------------------------------------------------------------------------------------------------------------

	export const REF = 'user'
	const REF_ACCOUNT = 'account'

	// ----------------------------------------------------------------------------------------------------------------
	// Interfaces
	// ----------------------------------------------------------------------------------------------------------------

	export interface User {
		payu?: PayU.IAccount
	}

	// ----------------------------------------------------------------------------------------------------------------
	// Methods
	// ----------------------------------------------------------------------------------------------------------------

	/**
	 * Create a user by email and password
	 * @export
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<string>} uid of user
	 */
	export async function createUser(email: string, password: string): Promise<string> {
		try {
			const userRecord = await admin.auth().createUser({
				email,
				password
			})

			admin.auth().setCustomUserClaims(userRecord.uid, {
				admin: false
			})
			return userRecord.uid
		} catch (error) {
			throw new error(error)
		}
	}

	/**
	 * Add PayU account to a user
	 * @export
	 * @param {string} uid
	 * @param {PayU.IAccount} data
	 * @returns
	 */
	export async function addPayuAccount(uid: string, data: PayU.IAccount) {
		return admin
			.database()
			.ref(REF_ACCOUNT)
			.child(uid)
			.child('payu')
			.set(data)
	}

	/**
	 * Get PayU account of user
	 * @export
	 * @param {string} uid 
	 * @returns {Promise<PayU.IAccount>} 
	 */
	export function getPayuAccount(uid: string): Promise<PayU.IAccount> {
		return new Promise((ok, err) => {
			admin
				.database()
				.ref(REF_ACCOUNT)
				.child(uid)
				.child('payu')
				.once('value', (snap) => {
					if (snap.val()) ok(snap.val())
					else err('No account data found')
				})
		})
	}
}
