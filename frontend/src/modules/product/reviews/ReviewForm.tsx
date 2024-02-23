import React, { useState, useCallback } from 'react';
import { useSubmitReview } from './useSubmitReview';

interface ReviewFormProps {
  productId: string;
  userId: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  userId,
}) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const { submit, error, submitting, submittedReview } = useSubmitReview(
    productId,
    userId,
  );

  const handleSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (submitting) return;

      await submit({ rating, comment, productId, userId });
      console.log('error', error);
      if (!error) {
        setRating(1);
        setComment('');
      }
    },
    [comment, productId, rating, submit, userId, submitting, error],
  );

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      {submittedReview && (
        <p className="text-green-500">Review submitted successfully!</p>
      )}

      {!submittedReview && (
        <form>
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2" htmlFor="rating">
              Rating
            </label>
            <input
              className="w-20 border border-gray-300 rounded-md p-2"
              onChange={e => setRating(parseInt(e.target.value))}
              type="number"
              min="1"
              max="5"
              id="rating"
              value={rating}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm mb-2" htmlFor="review">
              Review
            </label>
            <textarea
              className="border border-gray-300 rounded-md p-2"
              id="review"
              onChange={e => setComment(e.target.value)}
              required
              value={comment}
            ></textarea>
          </div>

          <div className="flex flex-col mb-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>

          <button
            disabled={submitting}
            className="bg-blue-600 text-white rounded-md p-2"
            type="submit"
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
};
