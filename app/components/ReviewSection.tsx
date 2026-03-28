"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/lib/auth-context";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarRating({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className="star"
        >
          <svg
            className={`w-5 h-5 ${
              star <= (hover || rating)
                ? "text-[#e50914]"
                : "text-[#808080]/40"
            } ${interactive ? "cursor-pointer" : "cursor-default"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function getStorageKey(targetId: string) {
  return `autoflix_reviews_${targetId}`;
}

export default function ReviewSection({
  targetId,
  targetTitle,
}: {
  targetId: string;
  targetTitle: string;
}) {
  const { user, isSignedIn, setShowSignIn } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

  const loadReviews = useCallback(() => {
    const stored = localStorage.getItem(getStorageKey(targetId));
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch {
        setReviews([]);
      }
    }
  }, [targetId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  function saveReviews(updated: Review[]) {
    setReviews(updated);
    localStorage.setItem(getStorageKey(targetId), JSON.stringify(updated));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn || !user) {
      setShowSignIn(true);
      return;
    }
    if (!newComment.trim() || newRating === 0) return;

    const review: Review = {
      id: `review_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    saveReviews([review, ...reviews]);
    setNewComment("");
    setNewRating(0);
  }

  function handleDelete(reviewId: string) {
    saveReviews(reviews.filter((r) => r.id !== reviewId));
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "highest") return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <section className="mt-12 border-t border-[#333] pt-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Reviews & Comments</h2>
          <div className="flex items-center gap-3 mt-1">
            <StarRating rating={Math.round(Number(avgRating))} />
            <span className="text-[#808080] text-sm">
              {avgRating} average ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {reviews.length > 1 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[#333] text-white text-sm rounded-[4px] px-3 py-1.5 border border-[#808080]/30 focus:border-white/50"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        )}
      </div>

      {/* Add review form */}
      <div className="bg-[#181818] rounded-[4px] p-5 mb-6 border border-[#333]">
        {isSignedIn && user ? (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-4">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-[4px]" />
              <div>
                <p className="text-white text-sm font-medium">{user.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#808080] text-xs">Your rating:</span>
                  <StarRating
                    rating={newRating}
                    onRate={setNewRating}
                    interactive
                  />
                </div>
              </div>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Share your thoughts about ${targetTitle}...`}
              rows={3}
              className="w-full bg-[#333] text-white text-sm rounded-[4px] px-4 py-3 placeholder-[#808080] border border-[#333] focus:border-white/40 transition resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!newComment.trim() || newRating === 0}
                className="bg-[#e50914] text-white px-6 py-2 rounded-[4px] text-sm font-bold hover:bg-[#f40612] transition disabled:opacity-40 disabled:hover:bg-[#e50914]"
              >
                Post Review
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-[#808080] text-sm mb-3">Sign in to leave a review</p>
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-[#e50914] text-white px-6 py-2 rounded-[4px] text-sm font-bold hover:bg-[#f40612] transition"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Reviews list */}
      {sortedReviews.length > 0 ? (
        <div className="space-y-4 review-scroll max-h-[600px] overflow-y-auto pr-1">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#181818] rounded-[4px] p-4 border border-[#282828] hover:border-[#333] transition"
            >
              <div className="flex items-start gap-3">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-9 h-9 rounded-[4px] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{review.userName}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#808080] text-xs flex-shrink-0">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {user && user.id === review.userId && (
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-[#808080] hover:text-[#e50914] transition"
                          title="Delete review"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[#d2d2d2] text-sm mt-2 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#808080] text-sm">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </section>
  );
}
