import cors from 'cors';
import mysql from 'mysql';
import express, { json } from 'express';

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'kidkod-shop'
})


app.get('/', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (error, result) => {
        if (error) return res.json({ Message: "Server Error!" })
        return res.json(result);
    })
})


app.post('/create', (req, res) => {
    const sql = "INSERT INTO products (`id`, `title`, `brand`, `category`, `type`, `img1`, `img2`, `description`, `price`, `stock`, `isOnSale`) VALUES (?)";
    const values = [
        req.body.id,
        req.body.title,
        req.body.brand,
        req.body.category,
        req.body.type,
        req.body.img1,
        req.body.img2,
        req.body.description,
        req.body.price,
        req.body.stock,
        req.body.isOnSale
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error("Error inserting product: ", err);  // Log the error for debugging
            return res.status(500).json({ error: 'ERROR UPLOADING PRODUCT!' });
        }    
        return res.status(201).json(data);
    })
})


app.put('/update/:id', (req, res) => {
    const id = req.params.id; 
    // console.log(id);

    if (!id || !req.body.title || !req.body.brand || !req.body.category || !req.body.price || !req.body.stock) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `
        UPDATE products 
        SET title = ?, brand = ?, category = ?, type = ?, img1 = ?, img2 = ?, description = ?, price = ?, stock = ?, isOnSale = ? 
        WHERE id = ?
    `;

    const values = [
        req.body.title,
        req.body.brand,
        req.body.category,
        req.body.type,
        req.body.img1,
        req.body.img2,
        req.body.description,
        req.body.price,
        req.body.stock,
        req.body.isOnSale
    ];

   

    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            console.error("Error updating product: ", err);
            return res.status(500).json({ error: err.sqlMessage });
        }
        return res.status(200).json({ message: 'Product updated successfully', data });
    });
});


app.delete('/product/:id', (req, res) => {
    // console.log(id);
    
    const sql = 'DELETE FROM products WHERE id = ?';
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error deleting product: ", err);
            return res.status(500).json({ error: err.sqlMessage });
        }
        return res.status(200).json({ message: 'Product deleted successfully', data });
    });
});


app.listen(5000, () => {
    console.log('App is listening on port 5000')
})


