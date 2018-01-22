import { Router } from "express";
const index: Router = Router()


index.get('/', (req, res, nex) => {
    res.send("Hola index 8")
})

export default index

// ----------------------------------------------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------------------------------------------
interface DataPayU {
    // Merchant data when 
    merchant: {
        apiKey: string,
        apiLogin: string
    }
    accountId: number
    merchantId: number
    url: string
    urlReport: string
    respond: string
}