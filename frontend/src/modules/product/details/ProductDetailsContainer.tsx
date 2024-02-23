import { useAuth } from '@/modules/auth';
import { ReviewListingContainer, ReviewForm } from '../reviews';
import { ProductWithCategory } from '../types';

export const ProductDetailsContainer: React.FC<{
  product: ProductWithCategory;
}> = ({ product }) => {
  const { loggedInUser } = useAuth();

  return (
    <main className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8 py-10">
      <section className="py-10 font-poppins dark:bg-gray-800">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="flex flex-wrap mb-24 -mx-4">
            <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
              <div className="sticky top-0 overflow-hidden ">
                <div className="relative mb-6 lg:mb-10 lg:h-96">
                  <img
                    className="object-contain w-full lg:h-full"
                    src="https://placehold.co/532x469?text=Product image"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2">
              <div className="lg:pl-20">
                <div className="mb-6 ">
                  <span className="px-2.5 py-0.5 text-xs text-blue-600 bg-blue-100 dark:bg-gray-700 rounded-xl dark:text-gray-200">
                    {product.category.name}
                  </span>
                  <h2 className="max-w-xl mt-6 mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
                    {product.name}
                  </h2>
                  <div className="flex flex-wrap items-center mb-6">
                    <ul className="flex mb-4 mr-2 lg:mb-0">
                      <li>
                        <a href="#">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                          </svg>
                        </a>
                      </li>
                    </ul>
                    {product.averageRating?.toFixed(1)} / 5
                  </div>
                  <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400 ">
                    <span>€{product.price}</span>
                  </p>
                </div>

                <div className="py-6 mb-6 border-t border-b border-gray-200 dark:border-gray-700">
                  <span className="text-base text-gray-600 dark:text-gray-400">
                    {product.description}
                  </span>
                </div>
                <div className="mb-6 "></div>

                <div className="flex flex-col gap-4 mb-6 border-b border-gray-200 pb-6">
                  <h2>Add a review</h2>

                  {loggedInUser ? (
                    <ReviewForm
                      productId={product.id}
                      userId={loggedInUser.id}
                    />
                  ) : (
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      You need to be logged in to leave a review
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-4 mb-6">
                  <h2>Reviews</h2>

                  <ReviewListingContainer productId={product.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
