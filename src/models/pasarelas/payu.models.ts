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

	// ----------------------------------------------------------------------------------------------------------------
	// Constants
	// ----------------------------------------------------------------------------------------------------------------
	export const URL_API_DEVELOP = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
	export const URL_API_PRODUCTION = 'https://api.payulatam.com/payments-api/4.0/service.cgi'

	export const URL_REPORT_DEVELOP = 'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi'
	export const URL_REPORT__PRODUCTION = 'https://api.payulatam.com/reports-api/4.0/service.cgi'

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
}
