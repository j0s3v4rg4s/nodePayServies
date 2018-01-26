"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
function loginAdmin(req, res, next) {
    const { uid } = req.body;
    if (uid == null)
        next('uid parameter is required');
    else {
        admin
            .auth()
            .getUser(uid)
            .then((userRecord) => {
            const extraParameters = userRecord.customClaims;
            if (extraParameters && extraParameters.admin)
                next();
            else
                next('This operation is not permitted by this user');
        })
            .catch((err) => {
            next(err);
        });
    }
}
exports.loginAdmin = loginAdmin;
function loginUser(req, res, next) {
    const { uid } = req.body;
    if (uid == null)
        next('uid parameter is required');
    else {
        admin
            .auth()
            .getUser(uid)
            .then(() => next())
            .catch((err) => next(err));
    }
}
exports.loginUser = loginUser;
function errorHandle(err, req, res, next) {
    res.status(400);
    const errRes = {
        complete: false,
        error: err.toString(),
        data: null
    };
    res.json(errRes);
}
exports.errorHandle = errorHandle;
//# sourceMappingURL=index.js.map