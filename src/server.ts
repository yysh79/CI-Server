import { connectDatabase } from './config/mongoDbConect.js.js';
import indexRout from './routes/indexRout.js'
import express from 'express'

connectDatabase();

const app = express();

app.use(express.json())
app.use('/', indexRout);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
