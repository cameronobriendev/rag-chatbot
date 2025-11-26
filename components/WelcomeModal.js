'use client';

import { useEffect, useState } from 'react';
import Lock from './icons/Lock';
import MenuBook from './icons/MenuBook';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem('rag_welcome_seen');
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('rag_welcome_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-xl max-w-lg w-full p-8 relative animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-400/40 mb-4">
            <MenuBook className="w-8 h-8 text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to RAG Chatbot</h2>
          <p className="text-sm opacity-90">Your intelligent document assistant</p>
        </div>

        {/* Getting Started */}
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MenuBook className="w-5 h-5" /> Getting Started
          </h3>
          <p className="text-sm opacity-90 mb-2">
            To begin, upload your documents (PDF or TXT files). The chatbot will analyze them and answer your questions based on the content.
          </p>
          <p className="text-sm opacity-80">
            <strong>Tip:</strong> Upload multiple documents to build a comprehensive knowledge base!
          </p>
        </div>

        {/* Privacy & Security */}
        <div className="mb-6 p-4 bg-green-900/20 border border-green-700/40 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-300" /> Your Data is Secure
          </h3>
          <ul className="text-sm opacity-90 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span><strong>Private Session:</strong> Your data is isolated and only visible to you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span><strong>Full Control:</strong> Delete all your data anytime with one click</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span><strong>Encrypted:</strong> All communications are secured with HTTPS</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClose}
          className="glass-button w-full py-3 rounded-lg font-semibold transition-all hover:scale-[1.02]"
        >
          Get Started
        </button>

        {/* Small print */}
        <p className="text-xs text-center opacity-60 mt-4">
          Session data is stored locally and on secure servers
        </p>
      </div>
    </div>
  );
}
