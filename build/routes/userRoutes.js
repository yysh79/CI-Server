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
/**
 * @swagger
 * /users/otp:
 *   post:
 *     summary: Create OTP
 *     description: Generates a one-time password (OTP) for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The user's phone number
 *     responses:
 *       200:
 *         description: OTP created successfully
 *       400:
 *         description: Invalid phone number
 *       500:
 *         description: Internal server error
 */
userRoutes.post('/otp', userController_1.createOTP);
/**
* @swagger
* /users/verify-otp:
*   post:
*     summary: Verify OTP
*     description: Verifies the one-time password (OTP) sent to the user's phone
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               phone:
*                 type: string
*                 description: The user's phone number
*               otp:
*                 type: string
*                 description: The OTP sent to the user's phone
*     responses:
*       200:
*         description: OTP verified successfully
*       400:
*         description: Invalid OTP or phone number
*       500:
*         description: Internal server error
*/
userRoutes.post('/verify-otp', userController_1.verifyOTP);
userRoutes.post('/verify-otp', userController_1.verifyOTP);
exports.default = userRoutes;
