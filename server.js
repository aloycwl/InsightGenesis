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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var promises_1 = require("fs/promises");
var multer_1 = require("multer");
var ethers_1 = require("ethers");
var pinata_1 = require("pinata");
var dotenv = require("dotenv");
dotenv.config();
var ap = (0, express_1.default)();
var pv = new ethers_1.ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545/");
ap.post("/upload", (0, multer_1.default)({ dest: "uploads/" }).single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tx, _a, _b, _c, _d, _e, err_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 5, , 6]);
                _b = (_a = new ethers_1.ethers.Contract("0xF70068E66527294f6073bF7a39414E2B12a03C8f", ["function store(string calldata, address) external"], pv).
                    connect(new ethers_1.ethers.Wallet(process.env.PK, pv))).
                    store;
                _d = (_c = new pinata_1.PinataSDK({
                    pinataJwt: process.env.PJ,
                    pinataGateway: "amber-implicit-jay-463.mypinata.cloud",
                }).upload.public).file;
                _e = Blob.bind;
                return [4 /*yield*/, promises_1.default.readFile(req.file.path)];
            case 1: return [4 /*yield*/, _d.apply(_c, [new (_e.apply(Blob, [void 0, [_f.sent()], { type: req.file.mimetype }]))()])];
            case 2: return [4 /*yield*/, _b.apply(_a, [(_f.sent()).cid, req.body.addr])];
            case 3:
                tx = _f.sent();
                return [4 /*yield*/, tx.wait()];
            case 4:
                _f.sent();
                res.send("200");
                return [3 /*break*/, 6];
            case 5:
                err_1 = _f.sent();
                res.status(500).send(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
ap.listen(80, function () { });
