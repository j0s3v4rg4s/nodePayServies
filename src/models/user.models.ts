import { PayU } from './pasarelas/payu.models'
import * as admin from 'firebase-admin'
const uid = require("uid")

export namespace User {
	// ----------------------------------------------------------------------------------------------------------------
	// Constants
	// ----------------------------------------------------------------------------------------------------------------

	export const REF = "user"
	const REF_ACCOUNT = "account"

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
	export async function createUser (email: string, password: string): Promise<string> {
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

	export async function addPayuAccount(uid: string, data: PayU.IAccount) {
		return admin.database().ref(REF_ACCOUNT).child(uid).child("payu").set(data)
	}
}
