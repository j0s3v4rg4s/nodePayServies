import { User } from '../user.models'
import * as request from 'request'
import * as md5 from 'md5'

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

	export interface IPayToken {
		code: string //transaction reference code
		description: string // transaction description 
		txValue: number // payment amount
		currency: string // payment currency 
		buyerInfo: payBuy // buier info
		payerInfo: payBuy //  CC owner info
		valueTxTax: number // 
		valueReturnBase: number //
		tokenCC: string // CC token
		typeCC: string // kind of CC
		IPADDRESS: string
		COOKIE: string
		USERAGENT: string
		SESSIONID: string
	}

	export interface payBuy {
		name: string
		email: string
		shipping: {
			adress: string
			city: string
			state: string
			country: 'CO' | 'AR' | 'BR' | 'MX' | 'PA' | 'PE' | 'CL'
			phone: string
		}
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

	const URL_NOTIFICATION_DEV = 'https://localhost:4200'
	const URL_NOTIFICATION_PROD = 'https://localhost:4200'


	// ----------------------------------------------------------------------------------------------------------------
	// Public Methods
	// ----------------------------------------------------------------------------------------------------------------

	/**
	 * Validate parameters of data account PayU
	 * @export
	 * @param {IAccount} params
	 * @returns {string} type of error
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

	export function validateTokenData(params: ICardToken): string {
		if (params == null) return "information is required"
		else if (params.payerId == null) return 'invalid payerId'
		else if (params.name == null) return 'invalid name'
		else if (params.identificationNumber == null) return 'invalid identificationNumber'
		else if (params.paymentMethod == null) return 'invalid paymentMethod'
		else if (params.number == null) return 'invalid number'
		else if (params.expirationDate == null) return 'invalid expirationDate'
		else return ''
	}

	export function validateDataPay(params: IPayToken): string {
		if (params == null) return 'infotmation is requiered'
		else if (params.code == null) return ' code id required'
		else if (params.description == null) return ' description id required'
		else if (params.txValue == null) return ' txValue id required'
		else if (params.currency == null) return ' currency id required'
		else if (validatePayBuy(params.buyerInfo)) return  validatePayBuy(params.buyerInfo)
		else if (validatePayBuy(params.payerInfo)) return  validatePayBuy(params.payerInfo)
		else if (params.valueTxTax == null) return ' valueTxTax id required'
		else if (params.valueReturnBase == null) return ' valueReturnBase id required'
		else if (params.tokenCC == null) return ' tokenCC id required'
		else if (params.typeCC == null) return ' typeCC id required'
		else if (params.IPADDRESS == null) return ' IPADDRESS id required'
		else if (params.COOKIE == null) return ' COOKIE id required'
		else if (params.USERAGENT == null) return ' USERAGENT id required'
		else if (params.SESSIONID == null) return ' SESSIONID id required'
		else return ''
	}

	export function validatePayBuy(params: payBuy): string {
		if (params.name == null ) return 'name is required'
		else if (params.email == null ) return 'email is required'
		if ( params.shipping ==null ) return 'shipping is required'
		else if (params.shipping != null ){
				if (params.shipping.adress == null) return 'adress is required'
				else if (params.shipping.city == null) return 'city is required'
				else if (params.shipping.state == null) return 'state is required'
				else if (params.shipping.phone == null) return 'phone is required'
				else if ( params.shipping.country == null) return 'Country is required'
		}
	}



	/**
	 * Crear el token de la tarjeta del usuario 
	 * @param uid id del usuario en la base de datos 
	 * @param cardData informacion de la tarjeta de credito
	 */
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

	export async function payWithCC(uid: string, data: IPayToken) {
		try {
			const isProduction = process.env.PRODUCTION === 'true'
			let account: IAccount
			if (isProduction) account = await User.getPayuAccount(uid)
			else account = accountDev
			if (account == null) {
				throw new Error('user don´t have payU data')
			}
			const signature = md5(`${account.merchant.apiKey}~${account.merchantId}~${data.code}~${data.txValue}~${data.currency}`)
			const obj = {
				"test": false,
				"language": "es",
				"command": "SUBMIT_TRANSACTION",
				"merchant": account.merchant,
				"transaction": {
					"order": {
						"accountId": account.accountId,
						"referenceCode": data.code,
						"description": data.description,
						"language": "es",
						"signature": signature,
						"notifyUrl": isProduction ? URL_NOTIFICATION_PROD : URL_NOTIFICATION_DEV,
						"shippingAddress": {
							"country": "CO"
						},
						"buyer": {
							"fullName": data.buyerInfo.name,
							"emailAddress": data.payerInfo.email,
							"shippingAddress": {
								"street1": data.buyerInfo.shipping.adress,
								"city": data.buyerInfo.shipping.city,
								"state": data.buyerInfo.shipping.state,
								"country": data.buyerInfo.shipping.country,
								"phone": data.buyerInfo.shipping.phone
							}
						},
						"additionalValues": {
							"TX_VALUE": {
								"value": data.txValue,
								"currency": data.currency
							},
							"TX_TAX": {
								"value": data.valueTxTax,
								"currency": data.currency
							},
							"TX_TAX_RETURN_BASE": {
								"value": data.valueReturnBase,
								"currency": data.currency
							}
						}
					},
					"creditCardTokenId": data.tokenCC,
					"type": "AUTHORIZATION_AND_CAPTURE",
					"paymentMethod": data.typeCC,
					"paymentCountry": "CO",
					"payer": {
						"fullName": data.payerInfo.name,
						"emailAddress": data.payerInfo.email,
						"billingAddress": {
							"street1": data.payerInfo.shipping.adress,
							"city": data.payerInfo.shipping.city,
							"state": data.payerInfo.shipping.state,
							"country": data.payerInfo.shipping.country,
							"phone": data.payerInfo.shipping.phone
						}
					},
					"ipAddress": data.IPADDRESS,
					"cookie": md5(data.COOKIE),
					"userAgent": data.USERAGENT,
					"deviceSessionId": data.SESSIONID
				}
			}

			const options = {
				uri: isProduction ? URL_API_PRODUCTION : URL_API_DEVELOP,
				method: 'POST',
				headers: headers,
				json: obj
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
