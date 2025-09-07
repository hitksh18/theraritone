import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, User, ThumbsUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ToastContainer';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  productName?: string;
}

const Reviews = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    productName: ''
  });

  const mockReviews: Review[] = [
    {
      id: '1',
      userName: 'Priya Sharma',
      rating: 5,
      title: 'Perfect Fit Every Time!',
      comment: 'The AI body scan is absolutely incredible. I\'ve ordered 5 items and each one fits perfectly. No more guessing sizes!',
      date: '2024-12-15',
      verified: true,
      helpful: 24,
      productName: 'Premium Cotton T-Shirt'
    },
    {
      id: '2',
      userName: 'Arjun Patel',
      rating: 5,
      title: 'Revolutionary Technology',
      comment: 'This is the future of online shopping. The virtual try-on feature saved me so much time and hassle. Highly recommend!',
      date: '2024-12-10',
      verified: true,
      helpful: 18,
      productName: 'Designer Jeans'
    },
    {
      id: '3',
      userName: 'Sneha Reddy',
      rating: 4,
      title: 'Great Quality, Fast Delivery',
      comment: 'Love the quality of the clothes and the personalized recommendations. Delivery was super fast too!',
      date: '2024-12-08',
      verified: true,
      helpful: 15,
      productName: 'Luxury Hoodie'
    },
    {
      id: '4',
      userName: 'Vikram Singh',
      rating: 5,
      title: 'Game Changer for Men\'s Fashion',
      comment: 'Finally, a platform that understands men\'s fashion needs. The AI recommendations are spot on!',
      date: '2024-12-05',
      verified: true,
      helpful: 22,
      productName: 'Casual Blazer'
    },
    {
      id: '5',
      userName: 'Anita Gupta',
      rating: 5,
      title: 'Excellent Customer Service',
      comment: 'Had an issue with sizing and the customer service team was incredibly helpful. They made it right immediately.',
      date: '2024-12-01',
      verified: true,
      helpful: 12
    },
    {
      id: '6',
      userName: 'Rohit Mehta',
      rating: 4,
      title: 'Impressive Technology',
      comment: 'The body scanning technology is impressive. Still getting used to it, but the results are very accurate.',
      date: '2024-11-28',
      verified: true,
      helpful: 9,
      productName: 'Formal Shirt'
    }
  ];

  useEffect(() => {
    setReviews(mockReviews);
    setFilteredReviews(mockReviews);
  }, []);

  useEffect(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterRating) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    // Sort reviews
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful - a.helpful);
    }

    setFilteredReviews(filtered);
  }, [reviews, filterRating, sortBy]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast({
        type: 'warning',
        title: 'Login Required',
        message: 'Please login to submit a review.'
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userName: user.displayName || 'Anonymous User',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0,
      productName: newReview.productName || undefined
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 5, title: '', comment: '', productName: '' });
    setShowReviewForm(false);
    
    showToast({
      type: 'success',
      title: 'Review Submitted',
      message: 'Thank you for your review! It has been published.'
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--main-bg)' }}>
      <Navbar 
        onSearchOpen={() => navigate('/search')}
        onCartOpen={() => {}}
        pageTitle="Customer Reviews"
        showBackButton={true}
      />

      <div className="pt-20 max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-6">Customer Reviews</h1>
            <p className="text-xl text-[var(--accent-color)] max-w-3xl mx-auto">
              See what our customers are saying about their RARITONE experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Review Summary & Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Overall Rating */}
              <div className="luxury-card rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-[var(--accent-color)] mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(averageRating) ? 'star-rating' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <p className="text-[var(--text-primary)] text-sm">
                  Based on {reviews.length} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="luxury-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Rating Breakdown</h3>
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-[var(--text-primary)] text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-[var(--secondary-bg)] rounded-full h-2">
                        <div
                          className="bg-[var(--accent-color)] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[var(--text-primary)] text-sm w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="luxury-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center">
                  <Filter className="mr-2" size={20} />
                  Filters
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">Filter by Rating</Label>
                    <select
                      value={filterRating || ''}
                      onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full luxury-input"
                    >
                      <option value="">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-[var(--text-primary)] mb-2 block">Sort By</Label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full luxury-input"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Write Review Button */}
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full btn-primary"
              >
                Write a Review
              </Button>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-3 space-y-6">
              {/* Review Form */}
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="luxury-form"
                >
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Write Your Review</h3>
                  
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label className="text-[var(--text-primary)]">Rating</Label>
                      <div className="flex space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewReview({...newReview, rating})}
                            className="p-1"
                          >
                            <Star
                              size={24}
                              className={rating <= newReview.rating ? 'star-rating' : 'text-gray-400'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title" className="text-[var(--text-primary)]">Review Title</Label>
                      <Input
                        id="title"
                        value={newReview.title}
                        onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                        placeholder="Summarize your experience"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="productName" className="text-[var(--text-primary)]">Product Name (Optional)</Label>
                      <Input
                        id="productName"
                        value={newReview.productName}
                        onChange={(e) => setNewReview({...newReview, productName: e.target.value})}
                        placeholder="Which product are you reviewing?"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="comment" className="text-[var(--text-primary)]">Your Review</Label>
                      <textarea
                        id="comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Share your experience with other customers"
                        required
                        rows={4}
                        className="mt-2 w-full luxury-input"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" className="btn-primary flex items-center space-x-2">
                        <Send size={16} />
                        <span>Submit Review</span>
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Reviews */}
              <div className="space-y-6">
                {filteredReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="review-card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-[var(--main-bg)] font-bold">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-[var(--text-primary)]">{review.userName}</h4>
                            {review.verified && (
                              <span className="luxury-badge text-xs">Verified</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < review.rating ? 'star-rating' : 'text-gray-400'}
                                />
                              ))}
                            </div>
                            <span className="text-[var(--accent-color)] text-sm">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{review.title}</h3>
                    
                    {review.productName && (
                      <p className="text-[var(--accent-color)] text-sm mb-3">
                        Product: {review.productName}
                      </p>
                    )}

                    <p className="text-[var(--text-primary)] leading-relaxed mb-4">{review.comment}</p>

                    <div className="flex items-center justify-between">
                      <button className="flex items-center space-x-2 text-[var(--accent-color)] hover:text-[var(--text-primary)] transition-colors">
                        <ThumbsUp size={16} />
                        <span className="text-sm">Helpful ({review.helpful})</span>
                      </button>
                      
                      <span className="text-[var(--accent-color)] text-sm">
                        {new Date(review.date).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredReviews.length === 0 && (
                <div className="text-center py-12">
                  <Star size={64} className="mx-auto text-[var(--accent-color)] mb-6" />
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">No Reviews Found</h3>
                  <p className="text-[var(--accent-color)] mb-6">
                    {filterRating ? `No reviews with ${filterRating} stars found.` : 'Be the first to write a review!'}
                  </p>
                  {filterRating && (
                    <Button
                      onClick={() => setFilterRating(null)}
                      className="btn-secondary"
                    >
                      Clear Filter
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reviews;