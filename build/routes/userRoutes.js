"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userRoutes = (0, express_1.Router)();
userRoutes.get('/getAllUsers', userController_1.getAllUsers);
userRoutes.post('/addUsers', userController_1.addUsers);
exports.default = userRoutes;
