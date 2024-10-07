
import { Router } from 'express';
import { getAllUsers, addUsers, exportToExcelAllUsers, searchUser } from '../controllers/userController';

const userRoutes = Router();

userRoutes.get('/getAllUsers', getAllUsers);
userRoutes.post('/addUsers', addUsers);
userRoutes.get('/exportToExcelAllUsers', exportToExcelAllUsers); // ייצוא המשתמשים ל-Excel
userRoutes.get('/search/:searchName', searchUser);

export default userRoutes;
