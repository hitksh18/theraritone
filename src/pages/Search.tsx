import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, ShoppingBag, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ToastContainer';
import { addToCart } from '@/lib/user';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, addToLocalCart, refreshCart } = useAuth();
  const { showToast } = useToast();

  const trendingSearches = [
    'luxury shirts', 'designer jeans', 'evening wear', 'casual tops', 
    'accessories', 'hoodies', 'premium collection', 'streetwear'
  ];

  const mockProducts = [
    {
      id: '1',
      name: 'Bold Vibe Oversize T-Shirt',
      price: 696,
      imageURL: 'Raritone Collection/Bold vibe Oversize Tshirt.jpg',
      category: 'Tops',
      tags: ['cotton', 'premium', 'casual']
    },
    {
      id: '2',
      name: 'Raritone Hoodie',
      price: 1043,
      imageURL: 'Raritone Collection/Hoddie1(F).jpg',
      category: 'Outerwear',
      tags: ['hoodie', 'designer', 'cozy']
    },
    {
      id: '3',
      name: 'Kiss Me Again Oversize T-Shirt',
      price: 399,
      imageURL: 'Raritone Collection/Kiss me again.jpeg',
      category: 'Tops',
      tags: ['tshirt', 'luxury', 'comfort']
    },
    {
      id: '4',
      name: 'Premium Silk Dress',
      price: 5999,
      imageURL: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      category: 'Dresses',
      tags: ['silk', 'elegant', 'formal']
    },
    {
      id: '5',
      name: 'Designer Leather Jacket',
      price: 7999,
      imageURL: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      category: 'Outerwear',
      tags: ['leather', 'jacket', 'premium']
    }
  ];

  const searchSuggestions = [
    'luxury shirts', 'designer jeans', 'premium hoodies', 'silk dresses',
    'leather jackets', 'casual wear', 'formal wear', 'streetwear'
  ];

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);

      // Simulate search with delay
      const timer = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = (query: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults(results);
      setIsLoading(false);
      setShowSuggestions(false);
    }, 500);
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    performSearch(term);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    performSearch(suggestion);
  };

  const addToWishlist = (productId: string) => {
    const currentWishlist = [...wishlist];
    if (!currentWishlist.includes(productId)) {
      currentWishlist.push(productId);
      setWishlist(currentWishlist);
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
      
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      showToast({
        type: 'success',
        title: 'Added to Wishlist',
        message: 'Item has been saved to your wishlist!'
      });
    } else {
      const updatedWishlist = currentWishlist.filter(id => id !== productId);
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      showToast({
        type: 'info',
        title: 'Removed from Wishlist',
        message: 'Item has been removed from your wishlist.'
      });
    }
  };

  const quickAddToCart = async (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageURL: product.imageURL
    };

    if (user) {
      try {
        await addToCart(user.uid, cartItem);
        await refreshCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to add item to cart.'
        });
        return;
      }
    } else {
      addToLocalCart(cartItem);
    }

    showToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart!`
    });
  };

  return (
    <div className="search-container">
      <div className="min-h-screen px-4 py-8">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <img
              src="/IMG-20250305-WA0003-removebg-preview.png"
              alt="RARITONE"
              className="mx-auto h-16 sm:h-20 w-auto cursor-pointer luxury-float"
              onClick={() => navigate('/')}
              style={{ filter: 'brightness(1.2) drop-shadow(0 0 30px rgba(148, 137, 121, 0.5))' }}
            />
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[var(--accent-color)]" size={24} />
              <input
                type="text"
                placeholder="Search for Products, Categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar pl-16 pr-6"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-[var(--accent-color)] hover:text-[var(--text-primary)]"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Live Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[var(--secondary-bg)] border-2 border-[var(--border-color)] rounded-xl shadow-lg z-10"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-6 py-3 text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-[var(--main-bg)] transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <Search size={16} className="inline mr-3" />
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Trending Searches */}
          {!searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center justify-center">
                <TrendingUp className="mr-2" size={24} />
                Trending Searches
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {trendingSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleTrendingClick(search)}
                    className="trending-tag"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center">
              Search Results ({searchResults.length})
            </h3>
            
            {/* Responsive Grid: 4-5 on desktop, 2 on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="product-card group"
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={product.imageURL}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(product.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          wishlist.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-black/60 text-white hover:bg-black/80'
                        }`}
                      >
                        <Heart 
                          size={16} 
                          className={wishlist.includes(product.id) ? 'fill-current' : ''} 
                        />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          quickAddToCart(product);
                        }}
                        className="p-2 bg-[var(--accent-color)] text-[var(--main-bg)] rounded-full hover:bg-[#A69688] transition-all duration-200"
                      >
                        <ShoppingBag size={16} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--text-primary)] mb-2 text-sm sm:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[var(--accent-color)] text-xs sm:text-sm mb-2">
                      {product.category}
                    </p>
                    <p className="text-xl font-bold text-[var(--text-primary)]">
                      ₹{product.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search size={64} className="mx-auto text-[var(--accent-color)] mb-6" />
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              No results found
            </h3>
            <p className="text-[var(--accent-color)] mb-8">
              We couldn't find any products matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-primary"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Default State - Show All Products */}
        {!searchQuery && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8 text-center">
              Featured Products
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="product-card group"
                  onClick={() => navigate('/catalog')}
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={product.imageURL}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(product.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          wishlist.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-black/60 text-white hover:bg-black/80'
                        }`}
                      >
                        <Heart 
                          size={16} 
                          className={wishlist.includes(product.id) ? 'fill-current' : ''} 
                        />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          quickAddToCart(product);
                        }}
                        className="p-2 bg-[var(--accent-color)] text-[var(--main-bg)] rounded-full hover:bg-[#A69688] transition-all duration-200"
                      >
                        <ShoppingBag size={16} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--text-primary)] mb-2 text-sm sm:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[var(--accent-color)] text-xs sm:text-sm mb-2">
                      {product.category}
                    </p>
                    <p className="text-xl font-bold text-[var(--text-primary)]">
                      ₹{product.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Home */}
        <div className="fixed top-6 left-6 z-10">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-[var(--secondary-bg)] border-2 border-[var(--border-color)] rounded-full text-[var(--text-primary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--main-bg)] transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;