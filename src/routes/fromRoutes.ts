import { Router } from 'express';
import { getAllForms} from '../controllers/userController';

const formRoutes = Router();
formRoutes.get('/getAllForms', getAllForms);
export default formRoutes;