"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// -----------------------------------------------------------------
// Imports library
// -----------------------------------------------------------------
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var admin = require("firebase-admin");
// -----------------------------------------------------------------
// Import router
// -----------------------------------------------------------------
var index_1 = require("./router/index");
// -----------------------------------------------------------------
// Attributes
// -----------------------------------------------------------------
var app = express();
var serviceAccount = require('./assets/admin.json');
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
app.use(index_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map