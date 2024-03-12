import { ProductService } from './service'
import { Store } from './store'
import {
  Product,
  ProductCreatePayload,
  ProductUpdatePayload,
  ProductWithCategoryAndAverageRating,
} from './types'
import { pick } from 'lodash'

describe('ProductService', () => {
  let store: jest.Mocked<Store>
  let service: ProductService

  const mockProduct: ProductWithCategoryAndAverageRating = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100.0,
    stock: 10,
    categoryId: '1',
    category: {
      id: '1',
    },
    averageRating: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockProductArray = Array.from({ length: 5 }, (_, index) => ({
    ...mockProduct,
    id: (index + 1).toString(),
  }))

  beforeEach(() => {
    store = {
      create: jest.fn().mockResolvedValue(mockProduct),
      findAll: jest.fn().mockResolvedValue(mockProductArray),
      findOne: jest
        .fn()
        .mockImplementation(async (id: string): Promise<Product | null> => {
          return Promise.resolve(
            mockProductArray.find((product) => id === product.id) || null,
          )
        }),
      update: jest.fn().mockResolvedValue(mockProduct),
      delete: jest.fn(),
    }

    service = new ProductService(store)
  })

  it('should create a product', async () => {
    const mockProductPayload = {
      ...pick(mockProduct, ['id', 'name', 'description', 'price', 'stock']),
      category: {
        create: {
          id: '1',
          name: 'test category',
        },
      },
    }

    const product: ProductCreatePayload = mockProductPayload

    await service.create(product)
    expect(store.create).toHaveBeenCalledWith(product)
  })

  it('should find all products', async () => {
    await service.findAll()
    expect(store.findAll).toHaveBeenCalled()
  })

  it('should find one product', async () => {
    const id = '1'
    await service.findOne(id)
    expect(store.findOne).toHaveBeenCalledWith(id)
  })

  it('should update a product', async () => {
    const product: ProductUpdatePayload = pick(mockProduct, [
      'id',
      'name',
      'description',
    ])

    await service.update(product)
    expect(store.update).toHaveBeenCalledWith(product)
  })

  it('should not update a product if the given id is not found', async () => {
    const product: ProductUpdatePayload = {
      ...pick(mockProduct, ['name', 'description']),
      id: 'non-existing-id',
    }

    await expect(service.update(product)).rejects.toThrow()
  })

  it('should delete a product', async () => {
    const id = '1'
    await service.delete(id)
    expect(store.delete).toHaveBeenCalledWith(id)
  })

  it('should not delete a product if the given id is not found', async () => {
    const id = 'non-existing-id'
    await expect(service.delete(id)).rejects.toThrow()
  })
})
