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
    res.status(201).json({ message: 'Product created', id: result.rows[0].id });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//=====================================================
// Función compartida para actualizar
const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updates: UpdateProductDTO = req.body;

    const fields: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    // Usamos Object.entries para evitar problemas de tipos con "key in updates"
    for (const [key, value] of Object.entries(updates)) {
      // Evitamos actualizar el ID o campos que no existan
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${queryIndex++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const updateQuery = `UPDATE products SET ${fields.join(', ')} WHERE id = $${queryIndex} RETURNING *`;

    const result = await pool.query(updateQuery, values);
    
    // CAMBIO CLAVE: Usamos rows.length en lugar de rowCount
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

router.put('/:id', updateProduct);
router.patch('/:id', updateProduct);

//=================================================
// Delete a product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    // CAMBIO CLAVE: Usamos rows.length
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

export default router;