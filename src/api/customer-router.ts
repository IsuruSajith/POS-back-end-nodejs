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


type Customer = {
    id: number, name: string, address: string, contact: string
};

router.post('/', async (req, res) => {
    const customer = req.body as Customer;
    if (!customer.name || !customer.address || !customer.contact) {
        res.status(400).send("Invalid data");
    } else {
        try {
            const result = await datasource
                .query('INSERT INTO customer (name, address, contact) VALUES (?, ?, ?)',
                    [customer.name, customer.address, customer.contact]);
            customer.id = result.insertId;
            res.status(201).json(customer);
        }catch (err: any){
            if (err.sqlState === '23000'){
                res.status(409).send("Contact number already exits");
            }else{
                throw err;
            }
        }
    }
});
