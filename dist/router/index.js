"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------------------------------------------
const express_1 = require("express");
const user_models_1 = require("../models/user.models");
const config_1 = require("../config");
// ----------------------------------------------------------------------------------------------------------------
// Attributes
// ----------------------------------------------------------------------------------------------------------------
const index = express_1.Router();
// ----------------------------------------------------------------------------------------------------------------
// Routers
// ----------------------------------------------------------------------------------------------------------------
index.get('/', (req, res, nex) => {
    res.send('hello index 9');
});
index.post('/newUser', config_1.loginAdmin, (req, res, next) => {
    const { email, password } = req.body;
    if (email == null || password == null)
        next('email and password are required');
    else
        user_models_1.User.createUser(email, password)
            .then((uid) => {
            const resp = {
                complete: true,
                data: { uid },
                error: null
            };
            res.status(200).json(resp);
        })
            .catch((err) => next(err));
});
exports.default = index;
//# sourceMappingURL=index.js.map