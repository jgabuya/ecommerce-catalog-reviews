import React from 'react';
import { useFetchReviews } from './useFetchReviews';
import { ReviewItem } from './ReviewItem';

interface ReviewListingContainerProps {
  productId: string;
}

export const ReviewListingContainer: React.FC<ReviewListingContainerProps> = ({
  productId,
}) => {
  const { reviews, loading, error } = useFetchReviews(productId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      {reviews?.map(review => (
        <ReviewItem key={review.id} {...review} />
      ))}
    </>
  );
};
