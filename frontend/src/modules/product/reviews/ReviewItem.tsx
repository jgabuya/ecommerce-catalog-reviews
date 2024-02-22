import { ProductReviewWithUser } from '../types';

interface ReviewItemProps extends ProductReviewWithUser {}

export const ReviewItem: React.FC<ReviewItemProps> = review => {
  return (
    <article className="mb-10">
      <div className="flex items-center mb-4">
        <img
          className="w-10 h-10 me-4 rounded-full"
          src={`https://placehold.co/100x100?text=${review.user.name?.[0]}`}
          alt=""
        />
        <div className="font-medium dark:text-white">
          <p>{review.user.name}</p>
        </div>
      </div>
      <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              review.rating >= index + 1
                ? 'text-yellow-300'
                : 'text-gray-300 dark:text-gray-500'
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
      </div>

      <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        {review.createdAt && (
          <p>
            Reviewed on{' '}
            <time dateTime="2017-03-03 19:00">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </p>
        )}
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{review.comment}</p>
    </article>
  );
};
