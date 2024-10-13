
import { Router } from 'express';
import { getAllUsers, addUsers, exportToExcelAllUsers ,updateUser, searchUser ,deleteUser,createOTP,verifyOTP} from '../controllers/userController';

const userRoutes = Router();

/**
 * @swagger
 * /users/getAllUsers:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 */
userRoutes.get('/getAllUsers', getAllUsers);


userRoutes.post('/addUsers', addUsers);
userRoutes.get('/exportToExcelAllUsers', exportToExcelAllUsers);
userRoutes.get('/search/:searchName', searchUser);
userRoutes.delete('/deleteUser/:id', deleteUser);
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
 userRoutes.put('/updateUser/:id', updateUser);
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
 userRoutes.post('/otp', createOTP); 
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
userRoutes.post('/verify-otp', verifyOTP);

 userRoutes.post('/verify-otp', verifyOTP);




export default userRoutes;
