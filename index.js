"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var products_1 = __importDefault(require("./endpoints/products"));
var users_1 = __importDefault(require("./endpoints/users"));
var app = (0, express_1.default)();
var port = parseInt(process.env.PORT || "8080");
// Middlewares
app.use(express_1.default.json());
// Rutas API
app.use("/api/products", products_1.default);
app.use("/api/users", users_1.default);
// Ruta raíz
app.get("/", function (req, res) {
    res.send("API Tienda Online funcionando");
});
// Servidor
app.listen(port, function () {
    console.log("Listening on http://localhost:".concat(port));
});
