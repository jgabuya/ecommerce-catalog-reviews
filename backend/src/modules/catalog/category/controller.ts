import { Router, Request, Response } from 'express';
import { ProductCategoryService } from './service';
import { ProductCategoryStore } from './store';
import { z, ZodError } from 'zod';

const store = new ProductCategoryStore();
const service = new ProductCategoryService(store);
const router = Router();

router.get('/', handleList);
router.post('/', handleCreate);
router.get('/:id', handleRead);
router.put('/:id', handleUpdate);
router.delete('/:id', handleDelete);

async function handleCreate(req: Request, res: Response) {
  // validate request body
  const schema = z.object({
    name: z.string(),
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
}

async function handleList(req: Request, res: Response) {
  const categories = await service.findAll();
  res.json(categories);
}

async function handleRead(req: Request, res: Response) {
  const category = await service.findOne(req.params.id);
  res.json(category);
}

async function handleUpdate(req: Request, res: Response) {
  // validate request body
  const schema = z.object({
    id: z.string(),
    name: z.string(),
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
    const category = await service.update({ id: req.params.id, ...req.body });
    res.json(category);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error });
  }
}

async function handleDelete(req: Request, res: Response) {
  try {
    const success = await service.delete(req.params.id);
    res.json(success);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error });
  }
}

export { router as productCategoryRouter };
