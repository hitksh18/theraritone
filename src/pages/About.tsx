import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Award, Globe, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data security and privacy are our top priorities. All body scans are processed locally."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Cutting-edge AI technology that revolutionizes how you shop for fashion online."
    },
    {
      icon: Users,
      title: "Customer Centric",
      description: "Every decision we make is focused on improving your shopping experience."
    },
    {
      icon: Award,
      title: "Quality",
      description: "Premium fashion items curated for style, comfort, and durability."
    }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Visionary leader with 15+ years in fashion technology"
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "AI expert specializing in computer vision and machine learning"
    },
    {
      name: "Arjun Patel",
      role: "Head of Design",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Fashion designer with expertise in sustainable luxury fashion"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--main-bg)' }}>
      <Navbar 
        onSearchOpen={() => navigate('/search')}
        onCartOpen={() => {}}
        pageTitle="About Us"
        showBackButton={true}
      />

      <div className="pt-20 max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-6">
              About RARITONE
            </h1>
            <p className="text-xl text-[var(--accent-color)] max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing the fashion industry with AI-powered body scanning technology, 
              making perfect-fit clothing accessible to everyone across India.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="luxury-card rounded-2xl p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Our Mission</h2>
              <p className="text-lg text-[var(--text-primary)] leading-relaxed max-w-4xl mx-auto">
                To eliminate the guesswork from online fashion shopping by providing accurate, 
                AI-powered size recommendations that ensure every customer gets the perfect fit. 
                We believe that technology should enhance personal style, not complicate it.
              </p>
            </div>
          </div>

          {/* Company Values */}
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="feature-card text-center"
                >
                  <value.icon size={48} color="var(--accent-color)" className="mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{value.title}</h3>
                  <p className="text-[var(--text-primary)] leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Our Story */}
          <div className="luxury-card rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-[var(--text-primary)] leading-relaxed mb-4">
                  Founded in 2024 in Mumbai, RARITONE emerged from a simple frustration: 
                  the difficulty of finding perfectly fitting clothes online. Our founders, 
                  experienced in both fashion and technology, saw an opportunity to solve 
                  this universal problem.
                </p>
                <p className="text-[var(--text-primary)] leading-relaxed mb-4">
                  By combining advanced computer vision, machine learning, and a deep 
                  understanding of fashion, we created the first AI-powered body scanning 
                  platform specifically designed for the Indian market.
                </p>
                <p className="text-[var(--text-primary)] leading-relaxed">
                  Today, we're proud to serve thousands of customers across India, 
                  helping them discover their perfect style with confidence and precision.
                </p>
              </div>
              <div className="text-center">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop"
                  alt="RARITONE Team"
                  className="rounded-xl shadow-lg mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Leadership Team */}
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12 text-center">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="luxury-card rounded-xl p-6 text-center hover-lift"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{member.name}</h3>
                  <p className="text-[var(--accent-color)] font-semibold mb-3">{member.role}</p>
                  <p className="text-[var(--text-primary)] text-sm leading-relaxed">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="luxury-card rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12 text-center">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--accent-color)] mb-2">50K+</div>
                <div className="text-[var(--text-primary)] font-medium">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--accent-color)] mb-2">99%</div>
                <div className="text-[var(--text-primary)] font-medium">Fit Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--accent-color)] mb-2">100+</div>
                <div className="text-[var(--text-primary)] font-medium">Premium Brands</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--accent-color)] mb-2">25+</div>
                <div className="text-[var(--text-primary)] font-medium">Cities Served</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center luxury-card rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Ready to Experience Perfect Fit?</h2>
            <p className="text-[var(--accent-color)] mb-8 text-lg">
              Join thousands of satisfied customers who've discovered their perfect style with RARITONE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/scan')}
                className="btn-primary"
              >
                Start Your Body Scan
              </button>
              <button
                onClick={() => navigate('/catalog')}
                className="btn-secondary"
              >
                Browse Collection
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;