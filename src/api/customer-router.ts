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

router.delete('/:customerId', async (req, res) => {
    const result = await datasource.query('DELETE FROM customer WHERE id=?',
        [req.params.customerId]);
    if (result.affectedRows === 1) res.sendStatus(204);
    else res.sendStatus(404);
});

router.get('/', async (req, res)=>{
    let query = "%";
    if (req.query.q){
        query = `%${req.query.q}%`;
    }
    const resultSet = await datasource
.query('SELECT * FROM customer WHERE id LIKE ? OR name LIKE ? OR address LIKE ? OR contact LIKE ?',
    new Array(4).fill(query));
    res.json(resultSet);
});
