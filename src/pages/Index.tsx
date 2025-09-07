'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ShoppingBag, Shield, Zap, Clock, Star, TrendingUp, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchOverlay from '@/components/SearchOverlay';
import ChatWidget from '@/components/ChatWidget';
import ProductModal from '@/components/ProductModal';
import AddToCartToast from '@/components/AddToCartToast';
import ButterflyScene from '@/components/ButterflyScene';
import { useToast } from '@/components/ToastContainer';
import { useAuth } from '@/contexts/AuthContext';
import { addToCart } from '@/lib/user';

const Index = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showCartToast, setShowCartToast] = useState(false);
  const [cartToastItem, setCartToastItem] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, refreshCart, addToLocalCart } = useAuth();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load wishlist
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Categories (only 3 as requested)
  const categories = [
    { 
      name: "T-Shirts", 
      image: "Raritone Collection/Bold vibe Oversize Tshirt.jpg", 
      count: "15 Items", 
      category: "Tops" 
    },
    { 
      name: "Hoodies", 
      image: "Raritone Collection/Hoddie1(F).jpg", 
      count: "8 Items", 
      category: "Outerwear" 
    },
    { 
      name: "Premium", 
      image: "Raritone Collection/Kiss me again.jpeg", 
      count: "12 Items", 
      category: "Premium" 
    }
  ];

  // Models wearing collection data
  const modelsCollection = [
    {
      id: 1,
      name: "Urban Streetwear",
      price: 2999,
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Oversized Hoodie + Cargo Pants"
    },
    {
      id: 2,
      name: "Minimalist Chic",
      price: 3499,
      image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Classic Tee + Tailored Jeans"
    },
    {
      id: 3,
      name: "Evening Elegance",
      price: 5999,
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Silk Dress + Statement Accessories"
    },
    {
      id: 4,
      name: "Casual Comfort",
      price: 1999,
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Cotton Tee + Relaxed Fit Jeans"
    },
    {
      id: 5,
      name: "Business Casual",
      price: 4499,
      image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Blazer + Chinos + Oxford Shirt"
    }
  ];

  // Customer Reviews Data
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      comment: "The AI body scan is incredible! Perfect fit every time.",
      avatar: "PS"
    },
    {
      id: 2,
      name: "Arjun Patel",
      rating: 5,
      comment: "Amazing quality and the virtual try-on saved me so much time.",
      avatar: "AP"
    },
    {
      id: 3,
      name: "Sneha Reddy",
      rating: 5,
      comment: "Love the personalized recommendations. Best fashion app!",
      avatar: "SR"
    },
    {
      id: 4,
      name: "Vikram Singh",
      rating: 5,
      comment: "Revolutionary technology. Never buying clothes without this again.",
      avatar: "VS"
    }
  ];

  // Navigate to catalog with category filter
  const handleCategoryClick = (category: string) => {
    navigate(`/catalog?category=${encodeURIComponent(category)}`);
  };

  // Handle add to cart from modal
  const handleAddToCart = async (product: any, quantity: number, size?: string, color?: string) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size,
      imageURL: product.image
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
          message: 'Failed to add item to cart. Please try again.'
        });
        return;
      }
    } else {
      addToLocalCart(cartItem);
    }

    setCartToastItem(cartItem);
    setShowCartToast(true);
  };

  // Handle add to wishlist
  const handleAddToWishlist = (productId: string) => {
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
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--main-bg)' }}>
      {/* Navigation */}
      <Navbar 
        onSearchOpen={() => setIsSearchOpen(true)}
        onCartOpen={() => {}}
      />

      {/* ENHANCED HERO SECTION */}
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* 3D Butterfly Background */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: 'scale(1.4) translateY(-15vh)', zIndex: 1 }}>
          <ButterflyScene />
        </div>
        
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" style={{ zIndex: 2 }} />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-8" style={{ zIndex: 3 }}>
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="mb-8">
              <img
                src="/IMG-20250305-WA0003-removebg-preview.png"
                alt="RARITONE"
                className="mx-auto w-full max-w-xs sm:max-w-2xl h-auto luxury-float"
                style={{ 
                  filter: 'drop-shadow(0 0 50px rgba(148, 137, 121, 0.8)) brightness(1.3)',
                }}
              />
            </div>

            <h1 className="hero-title mb-6">
              Fashion Meets Technology
            </h1>

            <p className="hero-subtitle font-light mb-16 opacity-90 max-w-2xl mx-auto">
              Experience perfect-fit fashion with our revolutionary AI body scanning technology. 
              Discover your style with precision and confidence.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button
                className="btn-primary font-bold flex items-center space-x-3 rounded-full justify-center w-full max-w-xs sm:min-w-[260px] px-8 py-4 text-base luxury-glow"
                onClick={() => navigate('/scan')}
              >
                <Camera size={24} />
                <span>Start Body Scan</span>
              </button>
              
              <button
                className="btn-secondary font-bold flex items-center space-x-3 rounded-full justify-center w-full max-w-xs sm:min-w-[260px] px-8 py-4 text-base"
                onClick={() => navigate('/catalog')}
              >
                <ShoppingBag size={24} />
                <span>Browse Collection</span>
              </button>
            </div>

            {/* Enhanced Privacy Notice */}
            <div className="max-w-lg mx-auto">
              <p className="text-sm px-6 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--secondary-bg)]/50 backdrop-blur-md text-[var(--accent-color)]">
                🔒 Your camera data is processed locally and never stored or shared
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI BODY SCAN BENEFITS SECTION */}
      <section className="section-spacing luxury-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              AI Body Scan Benefits
            </h2>
            <p className="hero-subtitle max-w-3xl mx-auto text-lg">
              Revolutionary technology that ensures perfect fit every time with complete privacy and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* 100% Private */}
            <div className="feature-card hover-lift">
              <Shield size={64} color="var(--accent-color)" className="mx-auto mb-6" />
              <h3 className="feature-title">100% Private</h3>
              <p className="feature-description">
                Body data never stored or sent online. All processing happens locally on your device for complete privacy.
              </p>
            </div>

            {/* 99% Accurate */}
            <div className="feature-card hover-lift">
              <Zap size={64} color="var(--accent-color)" className="mx-auto mb-6" />
              <h3 className="feature-title">99% Accurate</h3>
              <p className="feature-description">
                AI scanning ensures near-perfect micro-fit. Our technology provides the most accurate measurements possible.
              </p>
            </div>

            {/* 30 Second Scan */}
            <div className="feature-card hover-lift">
              <Clock size={64} color="var(--accent-color)" className="mx-auto mb-6" />
              <h3 className="feature-title">30 Second Scan</h3>
              <p className="feature-description">
                Fast scan with only a smartphone camera. Get your perfect measurements in half a minute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODELS WEARING OUR COLLECTION SECTION */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              Models Wearing Our Collection
            </h2>
            <p className="hero-subtitle max-w-3xl mx-auto text-lg">
              See how our premium pieces look on real models. Get inspired by our curated styling.
            </p>
          </div>

          {/* Desktop: Horizontal Scroll, Mobile: Grid */}
          <div className="hidden md:block">
            <div className="horizontal-scroll gap-6 pb-4">
              {modelsCollection.map((model) => (
                <div
                  key={model.id}
                  className="model-card w-80 flex-shrink-0"
                  onClick={() => navigate('/catalog')}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{model.name}</h3>
                    <p className="text-[var(--accent-color)] mb-3 text-sm">{model.outfit}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-[var(--text-primary)]">₹{model.price}</p>
                      <ArrowRight size={20} className="text-[var(--accent-color)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Grid */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {modelsCollection.slice(0, 4).map((model) => (
              <div
                key={model.id}
                className="model-card"
                onClick={() => navigate('/catalog')}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{model.name}</h3>
                  <p className="text-[var(--accent-color)] mb-2 text-xs">{model.outfit}</p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">₹{model.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              Shop by Category
            </h2>
            <p className="hero-subtitle max-w-3xl mx-auto text-lg">
              Explore our curated collection of premium fashion categories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group cursor-pointer"
                onClick={() => handleCategoryClick(category.category)}
              >
                <div className="category-card hover-lift">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.count}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEW SLIDER SECTION */}
      <section className="section-spacing overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              What Our Customers Say
            </h2>
            <p className="hero-subtitle max-w-3xl mx-auto text-lg">
              Join thousands of satisfied customers who love our AI-powered fashion experience.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="flex space-x-6 animate-scroll">
            {[...reviews, ...reviews].map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="flex-shrink-0 w-80 review-card mx-3"
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-[var(--main-bg)] font-bold text-lg mr-4">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-lg">{review.name}</h4>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={18} className="star-rating" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[var(--text-primary)] italic text-base leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED FOOTER SECTION */}
      <footer className="section-spacing border-t-2 border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="luxury-card rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <img
                  src="/IMG-20250305-WA0003-removebg-preview.png"
                  alt="RARITONE"
                  className="h-20 w-auto mb-6"
                />
                <p className="text-[var(--text-primary)] max-w-md leading-relaxed text-base mb-6">
                  Revolutionizing fashion with AI-powered body scanning technology. 
                  Experience perfect fit and personalized style recommendations across India.
                </p>
                <div className="flex space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
                    <span className="text-[var(--main-bg)] font-bold">f</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
                    <span className="text-[var(--main-bg)] font-bold">t</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
                    <span className="text-[var(--main-bg)] font-bold">i</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => navigate('/about')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/privacy')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/returns')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      Returns & Exchanges
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/contact')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/reviews')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      Customer Reviews
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail size={20} className="text-[var(--accent-color)]" />
                    <span className="text-[var(--text-primary)] text-base">
                      hello@raritone.in
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={20} className="text-[var(--accent-color)]" />
                    <span className="text-[var(--text-primary)] text-base">
                      +91 98765 43210
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-[var(--accent-color)]" />
                    <span className="text-[var(--text-primary)] text-base">
                      Mumbai, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-[var(--border-color)] mt-12 pt-8 text-center">
              <p className="text-[var(--accent-color)] text-base">
                © 2025 RARITONE. All rights reserved. | Powered by AI Fashion Technology | Made in India
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />

      {/* Add to Cart Toast */}
      <AddToCartToast
        isOpen={showCartToast}
        onClose={() => setShowCartToast(false)}
        item={cartToastItem}
        onViewCart={() => {
          setShowCartToast(false);
          navigate('/cart');
        }}
        onCheckout={() => {
          setShowCartToast(false);
          navigate('/cart');
        }}
      />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Index;