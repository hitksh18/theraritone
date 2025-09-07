'use client';

import React, { useState, useEffect, memo } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart, ArrowLeft, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

interface NavbarProps {
  onSearchOpen: () => void;
  onCartOpen: () => void;
  pageTitle?: string;
  showBackButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = memo(({ onSearchOpen, onCartOpen, pageTitle, showBackButton = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, cart, logout } = useAuth();

  // Only enable scroll animations on homepage
  const isHomepage = location.pathname === '/';

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IMMEDIATE NAVBAR VISIBILITY - NO DELAY
  useEffect(() => {
    if (!isHomepage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  // Close menu when clicking outside or on route change
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-menu-container]')) {
          setIsMenuOpen(false);
        }
      }
    };

    // Load wishlist count from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistCount(JSON.parse(savedWishlist).length);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Update wishlist count when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlistCount(JSON.parse(savedWishlist).length);
      } else {
        setWishlistCount(0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleStorageChange);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleProfileClick = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleMenuClick = () => {
    if (isProfileOpen) setIsProfileOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  const menuItems = [
    { label: 'Shop', path: '/catalog', icon: ShoppingBag },
    { label: 'Body Scan', path: '/scan', icon: Search },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* ENHANCED LUXURY NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 luxury-navbar ${
          isHomepage ? (isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0') : 'translate-y-0 opacity-100'
        }`}
        data-menu-container
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left - Back Button or Menu */}
            <div className="flex items-center w-32">
              {showBackButton ? (
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-3 px-4 py-3 text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all duration-300 rounded-lg"
                >
                  <ArrowLeft size={28} className="navbar-icon" />
                  {!isMobile && <span className="text-base font-medium">Back</span>}
                </button>
              ) : (
                <button
                  onClick={handleMenuClick}
                  className="flex items-center space-x-3 px-4 py-3 text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all duration-300 rounded-lg"
                >
                  {/* Enhanced Hamburger to Cross */}
                  <div className="relative w-7 h-7 flex flex-col justify-center items-center">
                    <span
                      className={`absolute w-6 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-300 ${
                        isMenuOpen ? 'rotate-45' : '-translate-y-2'
                      }`}
                    />
                    <span
                      className={`absolute w-6 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-300 ${
                        isMenuOpen ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    <span
                      className={`absolute w-6 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-300 ${
                        isMenuOpen ? '-rotate-45' : 'translate-y-2'
                      }`}
                    />
                  </div>
                  
                  {!isMobile && (
                    <span className="text-base font-medium">
                      {isMenuOpen ? 'Close' : 'Menu'}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Center - Logo or Page Title */}
            <div className="flex-1 flex justify-center items-center">
              {pageTitle ? (
                <div 
                  className="cursor-pointer flex items-center justify-center"
                  onClick={handleTitleClick}
                >
                  <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors duration-300">
                    {pageTitle}
                  </h1>
                </div>
              ) : (
                <img
                  src="/IMG-20250305-WA0003-removebg-preview.png"
                  alt="RARITONE"
                  className="cursor-pointer transition-all duration-300 luxury-float"
                  onClick={() => navigate('/')}
                  style={{
                    height: isMobile ? '56px' : '72px',
                    width: 'auto',
                    maxWidth: isMobile ? '240px' : '320px',
                    objectFit: 'contain',
                    filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(148, 137, 121, 0.3))'
                  }}
                />
              )}
            </div>

            {/* Right - Enhanced Action Buttons */}
            <div className="flex items-center space-x-2 w-32 justify-end">
              <button
                onClick={handleSearchClick}
                className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all duration-300 p-3 rounded-lg hover:bg-[var(--secondary-bg)]"
              >
                <Search size={28} className="navbar-icon" />
              </button>
              
              <button 
                onClick={() => navigate('/wishlist')}
                className="relative text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all duration-300 p-3 rounded-lg hover:bg-[var(--secondary-bg)]"
              >
                <Heart size={28} className="navbar-icon" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--error-color)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="relative text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all duration-300 p-3 rounded-lg hover:bg-[var(--secondary-bg)]"
              >
                <ShoppingBag size={28} className="navbar-icon" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--accent-color)] text-[var(--main-bg)] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={handleProfileClick}
                className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all duration-300 p-3 rounded-lg hover:bg-[var(--secondary-bg)]"
              >
                <User size={28} className="navbar-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Menu Dropdown */}
        {isMenuOpen && (
          <div className="luxury-card border-t-0 rounded-t-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-center gap-8 flex-wrap">
                {menuItems.map((item) => (
                  <div key={item.label} className="transition-all duration-300">
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className="text-center text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-all duration-300 flex flex-col items-center px-6 py-4 space-y-3 rounded-xl hover:bg-[var(--accent-color)] hover:bg-opacity-10 hover-lift"
                    >
                      <item.icon size={32} className="navbar-icon" />
                      <span className="font-semibold text-base">{item.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Profile Sidebar */}
      {isProfileOpen && user && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsProfileOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full z-50 w-full max-w-sm luxury-card rounded-l-xl">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  Profile
                </h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors p-2 rounded-lg"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="luxury-card rounded-full flex items-center justify-center w-16 h-16">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={28} className="text-[var(--text-primary)]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-lg">
                      {user.displayName || 'User'}
                    </h3>
                    <p className="text-[var(--accent-color)] text-base">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {[
                  { label: 'Profile Info', path: '/profile' },
                  { label: 'Order History', path: '/orders' },
                  { label: 'Saved Items', path: '/wishlist' },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      navigate(action.path);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left text-[var(--text-primary)] luxury-card rounded-xl transition-all duration-300 hover:bg-[var(--accent-color)] hover:bg-opacity-20 hover-lift px-4 py-3 text-base font-medium"
                  >
                    {action.label}
                  </button>
                ))}
                
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left text-[var(--error-color)] hover:bg-red-900/20 border-2 border-[var(--error-color)] rounded-xl transition-all duration-300 px-4 py-3 text-base font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;