import {Router} from 'express';
import userRoutes from './userRoutes';
const indexRout = Router();


indexRout.use('/users', userRoutes )
export default indexRout;

