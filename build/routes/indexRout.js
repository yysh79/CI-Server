"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const fromRoutes_1 = __importDefault(require("./fromRoutes"));
const indexRout = (0, express_1.Router)();
indexRout.use('/users', userRoutes_1.default);
indexRout.use('/froms', fromRoutes_1.default);
exports.default = indexRout;
