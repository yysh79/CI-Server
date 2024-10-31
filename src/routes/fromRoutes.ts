import { Router } from 'express';
import { getAllForms ,addFilledForm , updateForm} from '../controllers/userController';

const formRoutes = Router();
formRoutes.get('/getAllForms', getAllForms);
formRoutes.post('/addFilled',addFilledForm);
formRoutes.post('/updateForm/:id', updateForm);

export default formRoutes;