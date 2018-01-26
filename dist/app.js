"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// -----------------------------------------------------------------
// Imports library
// -----------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const admin = require("firebase-admin");
const morgan = require("morgan");
const config_1 = require("./config");
// -----------------------------------------------------------------
// Import router
// -----------------------------------------------------------------
const index_1 = require("./router/index");
const payu_1 = require("./router/payu");
// -----------------------------------------------------------------
// Attributes
// -----------------------------------------------------------------
const app = express();
const serviceAccount = require('./assets/admin.json');
// -----------------------------------------------------------------
// Use express
// -----------------------------------------------------------------
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://payu-af50f.firebaseio.com'
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(index_1.default);
app.use("/payu", payu_1.default);
app.use(config_1.errorHandle);
exports.default = app;
//# sourceMappingURL=app.js.map