import express from "express";
import mysql, {Pool} from 'promise-mysql';

export const router = express.Router();


let datasource: Pool;

initPool();
async function initPool() {
    datasource = await mysql.createPool({
        host: 'localhost',
        port: 3306,
        database: 'dep10_pos',
        user: 'root',
        password: 'mysql',
        connectionLimit: 10
    });
}

