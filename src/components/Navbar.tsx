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
      setIsVisible(currentScrollY > 50); // Show immediately after hero
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

  const menuItems = [
    { label: 'Shop', path: '/catalog', icon: ShoppingBag },
    { label: 'Body Scan', path: '/scan', icon: Search },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* MODERN NAVBAR - INSTANT TRANSITIONS */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 instant-transition modern-navbar ${
          isHomepage ? (isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0') : 'translate-y-0 opacity-100'
        }`}
        data-menu-container
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left - Back Button or Menu */}
            <div className="flex items-center w-24 sm:w-32">
              {showBackButton ? (
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-2 px-4 text-[var(--text-primary)] hover:text-[var(--secondary-accent)] instant-transition p-2 rounded-lg min-h-[40px] min-w-[40px]"
                >
                  <ArrowLeft size={isMobile ? 18 : 20} />
                  {!isMobile && <span className="text-sm font-medium">Back</span>}
                </button>
              ) : (
                <button
                  onClick={handleMenuClick}
                  className="flex items-center space-x-2 px-4 text-[var(--text-primary)] hover:text-[var(--secondary-accent)] instant-transition relative p-2 rounded-lg min-h-[40px] min-w-[40px]"
                >
                  {/* Instant Hamburger to Cross */}
                  <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                    <span
                      className={`absolute w-4 h-0.5 bg-current rounded-full instant-transition ${
                        isMenuOpen ? 'rotate-45' : '-translate-y-1'
                      }`}
                    />
                    <span
                      className={`absolute w-4 h-0.5 bg-current rounded-full instant-transition ${
                        isMenuOpen ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                    <span
                      className={`absolute w-4 h-0.5 bg-current rounded-full instant-transition ${
                        isMenuOpen ? '-rotate-45' : 'translate-y-1'
                      }`}
                    />
                  </div>
                  
                  {!isMobile && (
                    <span className="text-sm font-medium">
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
                  className="relative cursor-pointer flex items-center justify-center h-16 w-full max-w-xs instant-transition"
                  onClick={handleTitleClick}
                >
                  <h1 className="font-light text-[var(--text-primary)] text-lg sm:text-xl">
                    {pageTitle}
                  </h1>
                </div>
              ) : (
                <img
                  src="/IMG-20250305-WA0003-removebg-preview.png"
                  alt="RARITONE"
                  className="cursor-pointer instant-transition minimal-float"
                  onClick={() => navigate('/')}
                  style={{
                    height: isMobile ? '48px' : '64px',
                    width: 'auto',
                    maxWidth: isMobile ? '200px' : '300px',
                    objectFit: 'contain'
                  }}
                />
              )}
            </div>

            {/* Right - Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 w-24 sm:w-32 justify-end">
              <button
                onClick={onSearchOpen}
                className="text-[var(--secondary-accent)] hover:text-[var(--text-primary)] instant-transition px-4 p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Search size={isMobile ? 16 : 18} />
              </button>
              
              <button 
                onClick={() => navigate('/wishlist')}
                className="relative text-[var(--secondary-accent)] hover:text-[var(--text-primary)] instant-transition px-4 p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Heart size={isMobile ? 16 : 18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--error-color)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="relative text-[var(--secondary-accent)] hover:text-[var(--text-primary)] instant-transition px-4 p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <ShoppingBag size={isMobile ? 16 : 18} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--primary-accent)] text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={handleProfileClick}
                className="text-[var(--secondary-accent)] hover:text-[var(--text-primary)] instant-transition px-4 p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <User size={isMobile ? 16 : 18} />
              </button>
            </div>
          </div>
        </div>

        {/* INSTANT Menu Dropdown */}
        {isMenuOpen && (
          <div className="overflow-hidden modern-card border-t-0 rounded-t-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
                {menuItems.map((item) => (
                  <div key={item.label} className="instant-transition">
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-center text-[var(--text-primary)] hover:text-[var(--secondary-accent)] instant-transition flex flex-col items-center px-3 py-4 sm:px-4 sm:py-6 space-y-2 sm:space-y-3 rounded-xl hover:bg-[var(--border-color)]"
                    >
                      <item.icon size={isMobile ? 18 : 22} />
                      <span className="font-medium text-xs sm:text-sm">{item.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* INSTANT Profile Sidebar */}
      {isProfileOpen && user && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setIsProfileOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full z-50 drawer-content w-full max-w-sm modern-card rounded-l-xl">
            <div className="p-4 sm:p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl sm:text-2xl font-light text-[var(--text-primary)]">
                  Profile
                </h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="text-[var(--text-primary)] hover:text-[var(--secondary-accent)] instant-transition p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <X size={isMobile ? 18 : 22} />
                </button>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-6">
                  <div className="modern-card rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={isMobile ? 18 : 22} className="text-[var(--text-primary)]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)] text-base sm:text-lg">
                      {user.displayName || 'User'}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm sm:text-base">
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
                ].map((action, index) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      navigate(action.path);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left text-[var(--text-primary)] modern-card rounded-xl instant-transition hover:bg-[var(--border-color)] px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
                  >
                    {action.label}
                  </button>
                ))}
                
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left text-[var(--error-color)] hover:bg-red-900/20 border border-[var(--error-color)] rounded-xl instant-transition px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
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