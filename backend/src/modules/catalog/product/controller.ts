import { Router } from 'express';
import { ProductService } from './service';
import { ProductStore } from './store';
import { z, ZodError } from 'zod';

const store = new ProductStore();
const service = new ProductService(store);
const router = Router();

router.post('/', async (req, res) => {
  // validate request body using zod library
  const schema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    categoryId: z.string(),
  });

  try {
    schema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.errors);
    }

    return res.status(400).json({ error });
  }

  try {
    const product = await service.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/', async (req, res) => {
  const products = await service.findAll();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await service.findOne(req.params.id);
  res.json(product);
});

router.put('/:id', async (req, res) => {
  // validate request body
  const schema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    categoryId: z.string(),
  });

  try {
    schema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.errors);
    }

    return res.status(400).json({ error });
  }

  try {
    const product = await service.update({ id: req.params.id, ...req.body });
    res.json(product);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await service.delete(req.params.id);
    res.json(success);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error });
  }
});

export { router as productRouter };
