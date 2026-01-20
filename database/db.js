"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
var pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});
