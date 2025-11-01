import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { employeeRouter } from './routes/employees.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

app.use(express.json());
app.use(cors());

// Use employee routes
app.use('/', employeeRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});