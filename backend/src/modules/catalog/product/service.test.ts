import { ProductService } from './service';
import { Store } from './store';
import { Product, CreateProductPayload, UpdateProductPayload } from './types';

describe('ProductService', () => {
  let store: jest.Mocked<Store>;
  let service: ProductService;

  beforeEach(() => {
    store = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new ProductService(store);
  });

  it('should create a product', async () => {
    const product: CreateProductPayload = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100.0,
      stock: 10,
      categoryId: '1',
    };

    await service.create(product);
    expect(store.create).toHaveBeenCalledWith(product);
  });

  it('should find all products', async () => {
    await service.findAll();
    expect(store.findAll).toHaveBeenCalled();
  });

  it('should find one product', async () => {
    const id = '1';
    await service.findOne(id);
    expect(store.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a product', async () => {
    const product: UpdateProductPayload = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100.0,
      stock: 10,
      categoryId: '1',
    };

    await service.update(product);
    expect(store.update).toHaveBeenCalledWith(product);
  });

  it('should delete a product', async () => {
    const id = '1';
    await service.delete(id);
    expect(store.delete).toHaveBeenCalledWith(id);
  });
});
