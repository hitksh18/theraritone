import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Privacy = () => {
  const navigate = useNavigate();

  const privacyPrinciples = [
    {
      icon: Lock,
      title: "Data Encryption",
      description: "All personal data is encrypted using industry-standard AES-256 encryption"
    },
    {
      icon: Eye,
      title: "Local Processing",
      description: "Body scan data is processed locally on your device and never uploaded"
    },
    {
      icon: Database,
      title: "Minimal Collection",
      description: "We only collect data that's essential for providing our services"
    },
    {
      icon: UserCheck,
      title: "User Control",
      description: "You have full control over your data with easy access and deletion options"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--main-bg)' }}>
      <Navbar 
        onSearchOpen={() => navigate('/search')}
        onCartOpen={() => {}}
        pageTitle="Privacy Policy"
        showBackButton={true}
      />

      <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-6">Privacy Policy</h1>
            <p className="text-xl text-[var(--accent-color)] mb-4">Last updated: January 2025</p>
            <p className="text-lg text-[var(--text-primary)] max-w-3xl mx-auto leading-relaxed">
              Your privacy is fundamental to everything we do. This policy explains how we collect, 
              use, and protect your personal information.
            </p>
          </div>

          {/* Privacy Principles */}
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center">Our Privacy Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {privacyPrinciples.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="feature-card"
                >
                  <principle.icon size={48} color="var(--accent-color)" className="mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{principle.title}</h3>
                  <p className="text-[var(--text-primary)] leading-relaxed">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="space-y-8">
            <div className="luxury-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center">
                <FileText className="mr-3" size={28} />
                Information We Collect
              </h2>
              <div className="space-y-4 text-[var(--text-primary)]">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                  <p className="leading-relaxed">
                    When you create an account, we collect your name, email address, and any profile information you choose to provide.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Body Scan Data</h3>
                  <p className="leading-relaxed">
                    Our AI body scanning technology processes your measurements locally on your device. This data is used solely for size recommendations and is encrypted before any storage.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shopping Data</h3>
                  <p className="leading-relaxed">
                    We collect information about your purchases, browsing history, and preferences to provide personalized recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="luxury-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-[var(--text-primary)]">
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Provide accurate size recommendations through AI analysis</li>
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Improve our products and services</li>
                  <li>Provide customer support</li>
                  <li>Send promotional communications (with your consent)</li>
                </ul>
              </div>
            </div>

            <div className="luxury-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Data Security</h2>
              <div className="space-y-4 text-[var(--text-primary)]">
                <p className="leading-relaxed">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>End-to-end encryption for all data transmission</li>
                  <li>Secure servers with regular security audits</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Regular security training for all employees</li>
                  <li>Compliance with international data protection standards</li>
                </ul>
              </div>
            </div>

            <div className="luxury-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Your Rights</h2>
              <div className="space-y-4 text-[var(--text-primary)]">
                <p className="leading-relaxed">You have the following rights regarding your personal data:</p>
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>Access: Request a copy of all personal data we hold about you</li>
                  <li>Correction: Update or correct any inaccurate information</li>
                  <li>Deletion: Request deletion of your personal data</li>
                  <li>Portability: Request your data in a machine-readable format</li>
                  <li>Objection: Object to certain types of data processing</li>
                  <li>Withdrawal: Withdraw consent for data processing at any time</li>
                </ul>
              </div>
            </div>

            <div className="luxury-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Contact Us</h2>
              <div className="text-[var(--text-primary)]">
                <p className="leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@raritone.in</p>
                  <p><strong>Phone:</strong> +91 98765 43210</p>
                  <p><strong>Address:</strong> RARITONE Fashion Technologies Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra 400050</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center luxury-card rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Questions About Privacy?</h2>
            <p className="text-[var(--accent-color)] mb-6 text-lg">
              Our privacy team is here to help you understand how we protect your data.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="btn-primary"
            >
              Contact Privacy Team
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;