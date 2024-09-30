import { Router } from 'express';
import { getAllUsers } from '../controllers/userController';
const userRoutes = Router();

userRoutes.get('/getAllUsers', getAllUsers);


export default userRoutes;
