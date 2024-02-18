import { Router } from 'express';
import { ProductReviewService } from './service';
import { ProductReviewStore } from './store';
import { ProductStore } from '../product/store';
import { ProductService } from '../product/service';
import { z, ZodError } from 'zod';

const store = new ProductReviewStore();
const productStore = new ProductStore();
const productService = new ProductService(productStore);
const service = new ProductReviewService(store, productService);
const router = Router();

router.post('/', async (req, res) => {
  // validate request body
  const schema = z.object({
    productId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string(),
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
    const productReview = await service.create(req.body);
    res.json(productReview);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error });
  }
});

router.get('/', async (req, res) => {
  const productReviews = await service.findAll();
  res.json(productReviews);
});

router.get('/:id', async (req, res) => {
  const productReview = await service.findOne(req.params.id);
  res.json(productReview);
});

router.put('/:id', async (req, res) => {
  // validate request body
  const schema = z.object({
    id: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string(),
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
    const productReview = await service.update({
      id: req.params.id,
      ...req.body,
    });

    res.json(productReview);
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

export { router as productReviewRouter };
