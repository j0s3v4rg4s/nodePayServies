import { User } from '../user.models'
import * as request from 'request'

export namespace PayU {
	// ----------------------------------------------------------------------------------------------------------------
	// Interfaces
	// ----------------------------------------------------------------------------------------------------------------
	export interface IAccount {
		merchant: {
			apiKey: string
			apiLogin: string
		}
		accountId: number
		merchantId: number
	}

	export interface ICardToken {
		payerId: string // key of user card
		name: string // name of user card
		identificationNumber: string // identification number of user card
		paymentMethod: string // type of card, exp visa, mastercard ...
		number: string // number of card
		expirationDate: string // aaaa/mm
	}

	// ----------------------------------------------------------------------------------------------------------------
	// Public Constants
	// ----------------------------------------------------------------------------------------------------------------
	export const URL_API_DEVELOP = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
	export const URL_API_PRODUCTION = 'https://api.payulatam.com/payments-api/4.0/service.cgi'

	export const URL_REPORT_DEVELOP = 'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi'
	export const URL_REPORT__PRODUCTION = 'https://api.payulatam.com/reports-api/4.0/service.cgi'

	// ----------------------------------------------------------------------------------------------------------------
	// Private Constants
	// ----------------------------------------------------------------------------------------------------------------
	const accountDev: IAccount = {
		merchant: {
			apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
			apiLogin: 'pRRXKOl8ikMmt9u'
		},
		accountId: 512321,
		merchantId: 508029
	}

	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	}

	// ----------------------------------------------------------------------------------------------------------------
	// Public Methods
	// ----------------------------------------------------------------------------------------------------------------

	/**
	 * Validate parameters of data account PayU
	 * @export
	 * @param {IAccount} params
	 * @returns {string}
	 */
	export function validateAccount(params: IAccount): string {
		if (params == null || Object.keys(params).length == 0) return 'PayU account is required'
		else if (params.accountId == null) return 'accountId is required'
		else if (params.accountId != null && !Number.isFinite(params.accountId)) return 'accountId must be a number'
		else if (params.merchantId == null) return 'merchantId is required'
		else if (params.merchantId != null && !Number.isFinite(params.merchantId)) return 'merchantId must be a number'
		else if (params.merchant == null) return 'merchant is required'
		else if (params.merchant.apiKey == null) return 'apiKey is required'
		else if (params.merchant.apiLogin == null) return 'apiLogin is required'
		else return ''
	}

	export async function createToken(uid: string, cardData: ICardToken) {
		try {
			const isProduction = process.env.PRODUCTION === 'true'
			let account: IAccount
			if (isProduction) account = await User.getPayuAccount(uid)
			else account = accountDev

			const jsonTokenization = {
				language: 'es',
				command: 'CREATE_TOKEN',
				merchant: account.merchant,
				creditCardToken: cardData
			}

			const options = {
				uri: isProduction ? URL_API_PRODUCTION : URL_API_DEVELOP,
				method: 'POST',
				headers: headers,
				json: jsonTokenization
			}

			return await newFunction(options)
		} catch (error) {
			throw new Error(error)
		}
	}

	// ----------------------------------------------------------------------------------------------------------------
	// Private Methods
	// ----------------------------------------------------------------------------------------------------------------

	function newFunction(options: { uri: string; method: string; headers: {}; json: {} }) {
		return new Promise((ok, err) => {
			request(options, (_err, response, body) => {
				if (_err) err(_err)
				else ok(body)
			})
		})
	}
}
