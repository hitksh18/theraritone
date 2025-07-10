'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ShoppingBag, Shield, Zap, Clock, Star, TrendingUp, Mail, Phone, MapPin, Heart } from 'lucide-react';
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

  // Product data
  const catalogProducts = [
    {
      id: '1',
      name: 'Bold vibe Oversize Tshirt',
      description: 'Luxury cotton t-shirt with premium finish and exceptional comfort. Made from 100% organic cotton.',
      price: 696.00,
      imageURL: 'Raritone Collection/Bold vibe Oversize Tshirt.jpg',
      category: 'Tops',
      stock: 10,
      tags: ['Cotton', 'Premium', 'Casual'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      createdAt: new Date(),
      rating: 4.8
    },
    {
      id: '2',
      name: 'Raritone Hoodie',
      description: 'Raritone Hoodie from Theraritone. Crafted from premium materials, this hoodie ensures warmth and durability while offering a modern, minimalist design perfect for any wardrobe.',
      price: 1043.13,
      imageURL: 'Raritone Collection/Hoddie1(F).jpg',
      backImageURL: 'Raritone Collection/Hoddie1(B).jpg',
      category: 'Outerwear',
      stock: 5,
      tags: ['Hoodie', 'designer', 'Cozy'],
      sizes: ['28', '30', '32', '34', '36'],
      createdAt: new Date(),
      rating: 4.9
    },
    {
      id: '3',
      name: 'Kiss me again Oversize Tshirt',
      description: 'Its soft, premium fabric ensures lasting wear, while the chic, modern design adds a touch of effortless cool.',
      price: 399.20,
      imageURL: 'Raritone Collection/Kiss me again.jpeg',
      category: 'Tops',
      stock: 8,
      tags: ['Tshirt', 'luxury', 'comfort'],
      sizes: ['S', 'M', 'L', 'XL'],
      createdAt: new Date(),
      rating: 4.7
    }
  ];

  // New Arrivals
  const newArrivals = catalogProducts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map(product => ({
      id: product.id,
      name: product.name,
      price: `₹${product.price}`,
      image: product.imageURL,
      tag: product.stock === 0 ? 'Out of Stock' : 'New'
    }));

  // Categories
  const categories = [
    { 
      name: "T-Shirts", 
      image: catalogProducts.find(p => p.category === 'Tops')?.imageURL || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", 
      count: `${catalogProducts.filter(p => p.category === 'Tops').length} Items`, 
      category: "Tops" 
    },
    { 
      name: "Hoodies", 
      image: catalogProducts.find(p => p.tags.includes('Hoodie'))?.imageURL || "https://images.unsplash.com/photo-1556821840-3a63f95609a7", 
      count: `${catalogProducts.filter(p => p.tags.includes('Hoodie')).length} Items`, 
      category: "Outerwear" 
    },
    { 
      name: "Outerwear", 
      image: catalogProducts.find(p => p.category === 'Outerwear')?.imageURL || "https://images.unsplash.com/photo-1542272604-787c3835535d", 
      count: `${catalogProducts.filter(p => p.category === 'Outerwear').length} Items`, 
      category: "Outerwear" 
    },
    { 
      name: "Premium", 
      image: catalogProducts.find(p => p.tags.includes('premium'))?.imageURL || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446", 
      count: `${catalogProducts.filter(p => p.tags.includes('premium')).length} Items`, 
      category: "Premium" 
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

  // Quick add to wishlist for new arrivals
  const quickAddToWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    handleAddToWishlist(productId.toString());
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)]" style={{ background: 'var(--main-bg)' }}>
      {/* Navigation */}
      <Navbar 
        onSearchOpen={() => setIsSearchOpen(true)}
        onCartOpen={() => {}}
      />

      {/* ENHANCED HERO SECTION */}
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* 3D Butterfly Background - LARGER & HIGHER */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: 'scale(1.2) translateY(-10vh)', zIndex: 1 }}>
          <ButterflyScene />
        </div>
        
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" style={{ zIndex: 2 }} />

        {/* Hero Content - LOGO BELOW BUTTERFLY CENTERLINE */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-8" style={{ zIndex: 3, transform: 'translateY(15vh)' }}>
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="mb-8">
              <img
                src="/IMG-20250305-WA0003-removebg-preview.png"
                alt="RARITONE"
                className="mx-auto w-full max-w-xs sm:max-w-2xl h-auto minimal-float"
                style={{ 
                  filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.8)) brightness(1.2)',
                  textShadow: '0 0 20px rgba(255,255,255,0.5)'
                }}
              />
            </div>

            <p className="hero-subtitle font-light mb-16 opacity-90" 
               style={{ 
                 textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                 filter: 'brightness(1.2)'
               }}>
              Fashion Meets Technology
            </p>

            {/* EQUAL STYLED BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-16">
              <button
                className="btn-primary font-medium flex items-center space-x-3 rounded-full justify-center w-full max-w-xs sm:min-w-[220px] px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base"
                onClick={() => navigate('/scan')}
              >
                <Camera size={isMobile ? 18 : 20} />
                <span>Start Body Scan</span>
              </button>
              
              <button
                className="btn-secondary font-medium flex items-center space-x-3 rounded-full justify-center w-full max-w-xs sm:min-w-[220px] px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base"
                onClick={() => navigate('/catalog')}
              >
                <ShoppingBag size={isMobile ? 18 : 20} />
                <span>Browse Collection</span>
              </button>
            </div>

            {/* Notice Text with Better Visibility */}
            <p className="max-w-md mx-auto leading-relaxed text-xs sm:text-sm px-4 opacity-80"
               style={{ 
                 textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                 background: 'rgba(0,0,0,0.3)',
                 padding: '8px 16px',
                 borderRadius: '8px',
                 backdropFilter: 'blur(10px)'
               }}>
              This site uses webcam access to enable AI-powered try-ons. Your camera data is never stored or shared.
            </p>
          </div>
        </div>
      </div>

      {/* BODY SCAN FEATURES SECTION (REPLACES NEW ARRIVALS) */}
      <section className="py-12 sm:py-20" style={{ background: 'var(--main-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="hero-title mb-4 flex items-center justify-center">
              <Shield className="mr-3" size={isMobile ? 24 : 32} color="var(--primary-accent)" />
              AI Body Scanning
            </h2>
            <p className="hero-subtitle max-w-2xl mx-auto px-4">
              Revolutionary technology that ensures perfect fit every time with complete privacy and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {/* 100% Private */}
            <div className="feature-card">
              <Shield size={48} color="var(--primary-accent)" className="mx-auto mb-4" />
              <h3 className="feature-title">100% Private</h3>
              <p className="feature-description">
                Body data never stored or sent online. All processing happens locally on your device for complete privacy.
              </p>
            </div>

            {/* 99% Accurate */}
            <div className="feature-card">
              <Zap size={48} color="var(--primary-accent)" className="mx-auto mb-4" />
              <h3 className="feature-title">99% Accurate</h3>
              <p className="feature-description">
                Advanced AI scanning with micro-fit precision. Our technology ensures the most accurate measurements possible.
              </p>
            </div>

            {/* 30 Second Scan */}
            <div className="feature-card">
              <Clock size={48} color="var(--primary-accent)" className="mx-auto mb-4" />
              <h3 className="feature-title">30 Second Scan</h3>
              <p className="feature-description">
                Fast, smartphone-only scan with no extra hardware required. Get your perfect measurements in half a minute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS SECTION */}
      <section className="py-12 sm:py-20" style={{ background: 'var(--card-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="hero-title mb-4 flex items-center justify-center">
              <Star className="mr-3" size={isMobile ? 24 : 32} color="var(--primary-accent)" />
              New Arrivals
            </h2>
            <p className="hero-subtitle max-w-2xl mx-auto px-4">
              Discover our latest collections, meticulously crafted and designed for the modern luxury connoisseur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {newArrivals.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
                onClick={() => navigate('/catalog')}
              >
                <div className="modern-card rounded-2xl overflow-hidden instant-transition hover:bg-[var(--border-color)]">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 instant-transition"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`font-medium rounded-full px-3 py-1 text-xs backdrop-blur-md ${
                        item.tag === 'Out of Stock' 
                          ? 'bg-[var(--error-color)] text-white' 
                          : 'bg-[var(--primary-accent)] text-black border border-[var(--border-color)]'
                      }`}>
                        {item.tag}
                      </span>
                    </div>
                    
                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => quickAddToWishlist(e, item.id.toString())}
                      className={`absolute top-3 right-3 p-2 rounded-full instant-transition opacity-0 group-hover:opacity-100 backdrop-blur-md ${
                        wishlist.includes(item.id.toString())
                          ? 'wishlist-heart bg-[var(--error-color)]/20'
                          : 'text-white hover:bg-white/30 border border-white/30'
                      }`}
                    >
                      <Heart 
                        size={14} 
                        className={wishlist.includes(item.id.toString()) ? 'wishlist-heart' : ''} 
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-[var(--text-primary)] text-base sm:text-lg">
                      {item.name}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      {item.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-12 sm:py-20" style={{ background: 'var(--main-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="hero-title mb-4 flex items-center justify-center">
              <TrendingUp className="mr-3" size={isMobile ? 24 : 32} color="var(--primary-accent)" />
              Shop by Category
            </h2>
            <p className="hero-subtitle max-w-2xl mx-auto px-4">
              Explore our diverse range of fashion categories, each carefully curated for your unique style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group cursor-pointer"
                onClick={() => handleCategoryClick(category.category)}
              >
                <div className="modern-card rounded-2xl overflow-hidden instant-transition hover:bg-[var(--border-color)]">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 instant-transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="text-center p-4">
                    <h3 className="font-medium mb-1 text-[var(--text-primary)] text-base sm:text-lg">
                      {category.name}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      {category.count}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER SECTION WITH SMOOTH SCROLL LINKS */}
      <footer className="py-8 sm:py-16 section-divider border-t" style={{ background: 'var(--card-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="modern-card rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <img
                  src="/IMG-20250305-WA0003-removebg-preview.png"
                  alt="RARITONE"
                  className="h-16 sm:h-20 w-auto mb-4"
                />
                <p className="text-[var(--text-muted)] max-w-md leading-relaxed text-sm sm:text-base">
                  Revolutionizing fashion with AI-powered body scanning technology. 
                  Experience perfect fit and personalized style recommendations across India.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-base sm:text-lg">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#about" className="text-[var(--text-muted)] hover:text-[var(--secondary-accent)] text-sm sm:text-base instant-transition">About Us</a></li>
                  <li><a href="#privacy" className="text-[var(--text-muted)] hover:text-[var(--secondary-accent)] text-sm sm:text-base instant-transition">Privacy Policy</a></li>
                  <li><a href="#returns" className="text-[var(--text-muted)] hover:text-[var(--secondary-accent)] text-sm sm:text-base instant-transition">Returns & Exchanges</a></li>
                  <li><a href="#contact" className="text-[var(--text-muted)] hover:text-[var(--secondary-accent)] text-sm sm:text-base instant-transition">Contact Us</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-base sm:text-lg">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-[var(--text-muted)]" />
                    <span className="text-[var(--text-muted)] text-sm sm:text-base">
                      hello@raritone.in
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-[var(--text-muted)]" />
                    <span className="text-[var(--text-muted)] text-sm sm:text-base">
                      +91 98765 43210
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={16} className="text-[var(--text-muted)]" />
                    <span className="text-[var(--text-muted)] text-sm sm:text-base">
                      Mumbai, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-divider border-t mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
              <p className="text-[var(--text-muted)] text-xs sm:text-sm">
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