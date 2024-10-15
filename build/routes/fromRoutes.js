"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const formRoutes = (0, express_1.Router)();
formRoutes.get('/getAllForms', userController_1.getAllForms);
exports.default = formRoutes;
