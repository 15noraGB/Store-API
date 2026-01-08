import { Router, Request, Response } from "express";
import { CreateProductDTO, UpdateProductDTO } from "../interfaces/product";
import { pool } from "../database/db";

const router = Router();

//===================================
// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//===================================
// Get a single product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//========================================
// Create a new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const product: CreateProductDTO = req.body;
    // The original query had 6 value placeholders for 5 columns. Corrected to 5.
    const result = await pool.query(
      'INSERT INTO products(title, price, description, category, image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [
        product.title,
        product.price,
        product.description,
        product.category,
        product.image,
      ]
    );
    // 'result' from pg doesn\'t have a .json method, use 'res'. Also fixed typo in 'message'.
    res.status(201).json({ message: 'Product created', id: result.rows[0].id });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//=====================================================
// Shared function to update a product (for PUT and PATCH)
const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updates: UpdateProductDTO = req.body;

    const fields = [];
    const values = [];
    let queryIndex = 1;

    // Dynamically construct the SET part of the query from the request body
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key as keyof UpdateProductDTO)) {
        fields.push(`${key} = $${queryIndex++}`);
        values.push(updates[key as keyof UpdateProductDTO]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const updateQuery = `UPDATE products SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;

    const result = await pool.query(updateQuery, values);
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT and PATCH routes were using a non-existent in-memory 'products' array.
// They are now correctly implemented to update the product in the database.
// Both are implemented to perform a partial update.
router.put('/:id', updateProduct);
router.patch('/:id', updateProduct);

//=================================================
// Delete a product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // The original code was using an in-memory 'products' array. Corrected to use the database.
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.json(result.rows[0]); // Return the deleted product
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
