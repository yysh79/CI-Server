import { connectDatabase } from './config/mongoDbConect.js';
import indexRout from './routes/indexRout.js'
import express from 'express'
const cors = require('cors'); // Import CORS middleware

connectDatabase();

const app = express();


app.use(cors()); // Use the CORS middleware

app.use(express.json())
app.use('/', indexRout);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
