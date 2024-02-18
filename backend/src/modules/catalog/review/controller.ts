import { Router } from 'express';
import { ProductReviewService } from './service';
import { ProductReviewStore } from './store';
import { ProductStore } from '../product/store';
import { ProductService } from '../product/service';
import { authenticateToken } from '../../user/controller';
import { z, ZodError } from 'zod';

const store = new ProductReviewStore();
const productStore = new ProductStore();
const productService = new ProductService(productStore);
const service = new ProductReviewService(store, productService);
const router = Router({ mergeParams: true });

router.post('/', authenticateToken, async (req, res) => {
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
  // validate query
  const schema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    sort: z.enum(['createdAt', 'updatedAt', 'rating']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    rating: z.number().min(1).max(5).optional(),
  });

  try {
    schema.parse({
      ...req.query,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      rating: req.query.rating
        ? parseInt(req.query.rating as string)
        : undefined,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.errors);
    }

    return res.status(400).json({ error });
  }

  try {
    const productReviews = await service.findMany({
      ...req.query,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      filter: req.query.rating
        ? { rating: parseInt(req.query.rating as string) }
        : undefined,
      productId: (req.params as { productId: string }).productId,
    });

    res.json(productReviews);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(500).json({ error });
  }
});

router.get('/:id', async (req, res) => {
  const productReview = await service.findOne(req.params.id);
  res.json(productReview);
});

router.put('/:id', authenticateToken, async (req, res) => {
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

router.delete('/:id', authenticateToken, async (req, res) => {
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
