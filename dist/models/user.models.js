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
const admin = require("firebase-admin");
const uid = require('uid');
var User;
(function (User) {
    // ----------------------------------------------------------------------------------------------------------------
    // Constants
    // ----------------------------------------------------------------------------------------------------------------
    User.REF = 'user';
    const REF_ACCOUNT = 'account';
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
    function createUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRecord = yield admin.auth().createUser({
                    email,
                    password
                });
                admin.auth().setCustomUserClaims(userRecord.uid, {
                    admin: false
                });
                return userRecord.uid;
            }
            catch (error) {
                throw new error(error);
            }
        });
    }
    User.createUser = createUser;
    /**
     * Add PayU account to a user
     * @export
     * @param {string} uid
     * @param {PayU.IAccount} data
     * @returns
     */
    function addPayuAccount(uid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return admin
                .database()
                .ref(REF_ACCOUNT)
                .child(uid)
                .child('payu')
                .set(data);
        });
    }
    User.addPayuAccount = addPayuAccount;
    /**
     * Get PayU account of user
     * @export
     * @param {string} uid
     * @returns {Promise<PayU.IAccount>}
     */
    function getPayuAccount(uid) {
        return new Promise((ok, err) => {
            admin
                .database()
                .ref(REF_ACCOUNT)
                .child(uid)
                .child('payu')
                .once('value', (snap) => {
                if (snap.val())
                    ok(snap.val());
                else
                    err('No account data found');
            });
        });
    }
    User.getPayuAccount = getPayuAccount;
})(User = exports.User || (exports.User = {}));
//# sourceMappingURL=user.models.js.map