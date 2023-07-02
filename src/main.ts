import express, {json} from 'express';
import cors from 'cors';
import {router as customerRouter} from "./api/customer-router";

const app = express();
app.use(json());           
app.use(cors());            
app.use('/pos/api/v1/customers', customerRouter);
app.listen(8080, () => console.log("Server has been started at 8080"));

