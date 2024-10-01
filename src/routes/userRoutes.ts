
import { Router } from 'express';
import { getAllUsers, addUsers } from '../controllers/userController';

const userRoutes = Router();

userRoutes.get('/getAllUsers', getAllUsers);
userRoutes.post('/addUsers', addUsers); 

export default userRoutes;
