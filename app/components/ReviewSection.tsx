"use client";

import { useState, useEffect } from "react";
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

export default function ReviewSection({ targetId, targetTitle }: { targetId: string; targetTitle: string }) {
  const { user, isSignedIn, setShowSignIn } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

  const storageKey = `autoflix_reviews_${targetId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { setReviews(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, [storageKey]);

  const saveReviews = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim() || rating === 0) return;

    const newReview: Review = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    saveReviews([newReview, ...reviews]);
    setComment("");
    setRating(0);
  };

  const handleDelete = (id: string) => {
    saveReviews(reviews.filter((r) => r.id !== id));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "highest") return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-bold text-white">
          Reviews
          {reviews.length > 0 && (
            <span className="text-[14px] text-[#737373] font-normal ml-2">
              {avgRating} avg &middot; {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          )}
        </h3>
        {reviews.length > 1 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-[#333] text-white text-[13px] px-3 py-1.5 rounded border border-white/10 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        )}
      </div>

      {/* Write Review */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-[#1a1a1a] rounded border border-white/10">
          <div className="star-rating flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl"
              >
                <span className={star <= (hoverRating || rating) ? "text-yellow-400" : "text-[#555]"}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Write a review for ${targetTitle}...`}
            rows={3}
            className="w-full bg-[#333] text-white text-[14px] p-3 rounded border border-white/10 outline-none focus:border-white/30 placeholder:text-[#737373] resize-none"
          />
          <button
            type="submit"
            disabled={!comment.trim() || rating === 0}
            className="mt-2 px-6 py-2 bg-[#e50914] text-white text-[14px] font-bold rounded hover:bg-[#f6121d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Post Review
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowSignIn(true)}
          className="mb-8 w-full p-4 bg-[#1a1a1a] rounded border border-white/10 text-[14px] text-[#737373] hover:text-white hover:border-white/20 transition-colors text-center"
        >
          Sign in to write a review
        </button>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="p-4 bg-[#1a1a1a] rounded border border-white/5">
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] text-white font-medium">{review.userName}</span>
                  <div className="flex text-[12px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-[#555]"}>★</span>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#737373]">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[14px] text-[#d2d2d2] leading-relaxed">{review.comment}</p>
                {user?.id === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-[12px] text-[#737373] hover:text-[#e50914] mt-2 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-center text-[#737373] text-[14px] py-8">
          No reviews yet. Be the first to review {targetTitle}!
        </p>
      )}
    </div>
  );
}
