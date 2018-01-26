"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------------------------------------------
const express_1 = require("express");
const config_1 = require("../config");
const payu_models_1 = require("../models/pasarelas/payu.models");
const user_models_1 = require("../models/user.models");
// ----------------------------------------------------------------------------------------------------------------
// Attributes
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// Routers
// ----------------------------------------------------------------------------------------------------------------
const payu = express_1.Router();
payu.use(config_1.loginUser);
payu.post('/addAccount', (req, res, next) => {
    const { uid } = req.body;
    delete req.body.uid;
    const data = req.body;
    const err = payu_models_1.PayU.validateAccount(data);
    if (err === '') {
        user_models_1.User.addPayuAccount(uid, data)
            .then(() => {
            const resp = {
                complete: true,
                error: null,
                data: null
            };
            res.status(200).json(resp);
        })
            .catch((err) => next(err));
    }
    else
        next(err);
});
payu.post('/generateToken', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { uid } = req.body;
    const data = req.body.data;
    const err = payu_models_1.PayU.validateTokenData(data);
    if (err == '') {
        try {
            const respond = yield payu_models_1.PayU.createToken(uid, data);
            const resp = {
                complete: true,
                error: null,
                data: respond
            };
            res.status(200).json(resp);
        }
        catch (error) {
            next(error);
        }
    }
    else
        next(err);
}));
payu.post('/payToken', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { uid, data } = req.body;
    const err = payu_models_1.PayU.validateDataPay(data);
    if (err == '') {
        try {
            const respond = yield payu_models_1.PayU.payWithCC(uid, data);
            const resp = {
                complete: true,
                error: null,
                data: respond
            };
            res.status(200).json(resp);
        }
        catch (error) {
            next(error);
        }
    }
    else
        next(err);
}));
exports.default = payu;
//# sourceMappingURL=payu.js.map