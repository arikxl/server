import express from 'express';
import mysql from 'mysql2/promise';  // Use promise-based MySQL
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/products.js';  // Import product routes


const app = express();
app.use(cors());
app.use(express.json())

dotenv.config();  // Load environment variables

app.use('/products', productRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running(listening) on port ${PORT}`);
});

