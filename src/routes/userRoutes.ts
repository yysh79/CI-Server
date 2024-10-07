
import { Router } from 'express';
import { getAllUsers, addUsers ,exportToExcelAllUsers} from '../controllers/userController';

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
userRoutes.post('/addUsers', addUsers);

export default userRoutes;
