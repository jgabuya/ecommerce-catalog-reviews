import React from 'react';
import { ProductWithCategory } from '../types';

const ProductCard: React.FC<ProductWithCategory> = product => (
  <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto">
    <a href={`/products/${product.id}`}>
      <img
        src="https://placehold.co/899x567?text=Product image"
        alt="product image"
        width={899}
        height={567}
        className="p-5 rounded-t-lg"
      />
    </a>
    <div className="px-5 pb-5">
      <a href={`/products/${product.id}`}>
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {product.name}
        </h5>
      </a>
      <div className="flex items-center mt-2.5 mb-5">
        <div className="flex items-center space-x-1 gap-1 rtl:space-x-reverse">
          <svg
            className="w-4 h-4 text-yellow-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>

          <span className="text-sm text-gray-400">
            {product.averageRating
              ? `${product.averageRating.toFixed(1)} / 5`
              : 'No reviews'}
          </span>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
          {product.category.name}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          €{product.price}
        </span>
      </div>
    </div>
  </div>
);

export { ProductCard };
