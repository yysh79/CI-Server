"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userRoutes = (0, express_1.Router)();
/**
 * @swagger
 * /users/getAllUsers:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 */
userRoutes.get('/getAllUsers', userController_1.getAllUsers);
/**
 * @swagger
 * /users/addUsers:
 *   post:
 *     summary: Add new users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User added successfully
 */
userRoutes.post('/login', userController_1.login);
userRoutes.post('/addUsers', userController_1.addUsers);
userRoutes.get('/exportToExcelAllUsers', userController_1.exportToExcelAllUsers);
userRoutes.get('/search/:searchName', userController_1.searchUser);
userRoutes.delete('/deleteUser/:id', userController_1.deleteUser);
/**
 * @swagger
 * /users/updateUser/{id}:
 *   put:
 *     summary: Update an existing user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRoutes.put('/updateUser/:id', userController_1.updateUser);
userRoutes.post('/otp', userController_1.createOTP);
userRoutes.post('/verify-otp', userController_1.verifyOTP);
exports.default = userRoutes;
