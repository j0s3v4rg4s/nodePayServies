export namespace PayU {
	// ----------------------------------------------------------------------------------------------------------------
	// Interfaces
	// ----------------------------------------------------------------------------------------------------------------
	export interface IAccount {
		merchant: {
			apiKey: string,
			apiLogin: string
		}
		accountId: number
		merchantId: number
	}

	// ----------------------------------------------------------------------------------------------------------------
	// Constants 
	// ----------------------------------------------------------------------------------------------------------------
	export const URL_API_DEVELOP = "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
	export const URL_API_PRODUCTION = "https://api.payulatam.com/payments-api/4.0/service.cgi"

	export const URL_REPORT_DEVELOP = "https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi"
	export const URL_REPORT__PRODUCTION = "https://api.payulatam.com/reports-api/4.0/service.cgi"



	
}