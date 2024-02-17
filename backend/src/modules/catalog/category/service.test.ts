import { ProductCategoryService } from './service';
import { Store } from './store';
import {
  ProductCategory,
  CreateProductCategoryPayload,
  UpdateProductCategoryPayload,
} from './types';

describe('ProductCategoryService', () => {
  let store: jest.Mocked<Store>;
  let service: ProductCategoryService;

  const mockProductCategory: ProductCategory = {
    id: '1',
    name: 'Test Category',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductCategoryArray = Array.from({ length: 5 }, (_, index) => ({
    ...mockProductCategory,
    id: (index + 1).toString(),
  }));

  beforeEach(() => {
    store = {
      create: jest.fn().mockResolvedValue(mockProductCategory),
      findAll: jest.fn().mockResolvedValue(mockProductCategoryArray),
      findOne: jest
        .fn()
        .mockImplementation(
          async (id: string): Promise<ProductCategory | null> => {
            return Promise.resolve(
              mockProductCategoryArray.find(cat => id === cat.id) || null,
            );
          },
        ),
      update: jest.fn().mockResolvedValue(mockProductCategory),
      delete: jest.fn(),
    };
    service = new ProductCategoryService(store);
  });

  it('should create a category', async () => {
    const category: CreateProductCategoryPayload = {
      name: 'Test Category',
    };

    await service.create(category);
    expect(store.create).toHaveBeenCalledWith(category);
  });

  it('should find all categories', async () => {
    await service.findAll();
    expect(store.findAll).toHaveBeenCalled();
  });

  it('should find one category', async () => {
    const id = '1';
    await service.findOne(id);
    expect(store.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a category', async () => {
    const category: UpdateProductCategoryPayload = {
      id: '1',
      name: 'Test Category',
    };

    await service.update(category);
    expect(store.update).toHaveBeenCalledWith(category);
  });

  it('should throw an error when updating a non-existing category', async () => {
    const category: UpdateProductCategoryPayload = {
      id: 'non-existing-id',
      name: 'Test Category',
    };

    await expect(service.update(category)).rejects.toThrow();
  });

  it('should delete a category', async () => {
    const id = '1';
    await service.delete(id);
    expect(store.delete).toHaveBeenCalledWith(id);
  });

  it('should throw an error when deleting a non-existing category', async () => {
    const id = 'non-existing-id';
    await expect(service.delete(id)).rejects.toThrow();
  });
});
