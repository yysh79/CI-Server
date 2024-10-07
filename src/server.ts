import express from 'express';
import indexRout from './routes/indexRout.js';
import { connectDatabase } from './config/mongoDbConect.js';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './swagger_output.json'; 

connectDatabase();

const app = express();

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(express.json());
app.use('/', indexRout);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
