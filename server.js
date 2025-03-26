import cors from 'cors';
import mysql from 'mysql2/promise';  // Use promise-based MySQL

import express from 'express';

const app = express();
app.use(cors());
app.use(express.json())


const db = mysql.createPool({  // Use connection pooling for better performance
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kidkod-shop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



app.get('/', async (req, res) => {
    try {
        const [products] = await db.query("SELECT * FROM products");
        res.json(products);
    } catch (error) {
        console.error("Database Query Error: ", error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});



app.post('/create', async (req, res) => {
    try {
        const sql = `INSERT INTO products 
            (id, title, brand, category, type, img1, img2, description, price, stock, isOnSale) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            req.body.id, req.body.title, req.body.brand, req.body.category,
            req.body.type, req.body.img1, req.body.img2, req.body.description,
            req.body.price, req.body.stock, req.body.isOnSale
        ];
        
        const [product] = await db.execute(sql, values);
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        console.error("Error inserting product: ", error);
        res.status(500).json({ error: 'ERROR UPLOADING PRODUCT!' });
    }
});



app.put('/update/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!id || !req.body.title || !req.body.brand || !req.body.category || !req.body.price || !req.body.stock) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const sql = `UPDATE products 
            SET title = ?, brand = ?, category = ?, type = ?, img1 = ?, img2 = ?, description = ?, price = ?, stock = ?, isOnSale = ? 
            WHERE id = ?`;

        const values = [
            req.body.title, req.body.brand, req.body.category, req.body.type,
            req.body.img1, req.body.img2, req.body.description, req.body.price,
            req.body.stock, req.body.isOnSale, id
        ];

        const [product] = await db.execute(sql, values);
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error("Error updating product: ", error);
        res.status(500).json({ error: error.message });
    }
});


app.delete('/product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM products WHERE id = ?';
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', result });
    } catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({ error: error.message });
    }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running(listening) on port ${PORT}`);
});

