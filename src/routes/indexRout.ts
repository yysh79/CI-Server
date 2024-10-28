import {Router} from 'express';
import userRoutes from './userRoutes';
import getAllForms from './fromRoutes';
const indexRout = Router();


indexRout.use('/users', userRoutes )
indexRout.use('/froms', getAllForms )
export default indexRout;

