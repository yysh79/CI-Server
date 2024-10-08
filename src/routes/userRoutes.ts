
import { Router } from 'express';
import { getAllUsers, addUsers, exportToExcelAllUsers ,updateUser, searchUser ,deleteUser} from '../controllers/userController';

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
// userRoutes.put('/updateUser', updateUser);




export default userRoutes;
