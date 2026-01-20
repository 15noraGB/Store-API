"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../database/db");
var router = (0, express_1.Router)();
//===================================
// Get all products
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.pool.query('SELECT * FROM products ORDER BY id ASC')];
            case 1:
                result = _a.sent();
                res.json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error executing query', error_1);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//===================================
// Get a single product by ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])];
            case 1:
                result = _a.sent();
                if (result.rows.length > 0) {
                    res.json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: 'Product not found' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error executing query', error_2);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//========================================
// Create a new product
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                product = req.body;
                return [4 /*yield*/, db_1.pool.query('INSERT INTO products(title, price, description, category, image) VALUES ($1, $2, $3, $4, $5) RETURNING id', [
                        product.title,
                        product.price,
                        product.description,
                        product.category,
                        product.image,
                    ])];
            case 1:
                result = _a.sent();
                // 'result' from pg doesn\'t have a .json method, use 'res'. Also fixed typo in 'message'.
                res.status(201).json({ message: 'Product created', id: result.rows[0].id });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error executing query', error_3);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//=====================================================
// Shared function to update a product (for PUT and PATCH)
var updateProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updates, fields, values, queryIndex, key, updateQuery, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                updates = req.body;
                fields = [];
                values = [];
                queryIndex = 1;
                // Dynamically construct the SET part of the query from the request body
                for (key in updates) {
                    if (Object.prototype.hasOwnProperty.call(updates, key)) {
                        fields.push("".concat(key, " = $").concat(queryIndex++));
                        values.push(updates[key]);
                    }
                }
                if (fields.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'No fields to update' })];
                }
                values.push(id);
                updateQuery = "UPDATE products SET ".concat(fields.join(', '), " WHERE id = $").concat(queryIndex, " RETURNING *");
                return [4 /*yield*/, db_1.pool.query(updateQuery, values)];
            case 1:
                result = _a.sent();
                if (result.rowCount > 0) {
                    res.json(result.rows[0]);
                }
                else {
                    res.status(404).json({ error: 'Product not found' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error executing query', error_4);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// PUT and PATCH routes were using a non-existent in-memory 'products' array.
// They are now correctly implemented to update the product in the database.
// Both are implemented to perform a partial update.
router.put('/:id', updateProduct);
router.patch('/:id', updateProduct);
//=================================================
// Delete a product
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, db_1.pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id])];
            case 1:
                result = _a.sent();
                if (result.rowCount > 0) {
                    res.json(result.rows[0]); // Return the deleted product
                }
                else {
                    res.status(404).json({ error: 'Product not found' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error executing query', error_5);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
