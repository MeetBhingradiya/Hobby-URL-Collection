'use client';

import { useState } from 'react';
import { FiShare2, FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ShareList({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
      console.error('Failed to copy:', error);
    }
  };
  return (
    <div className="inline-flex">
      <button
        onClick={handleCopyLink}
        className="btn btn-glass btn-secondary flex items-center gap-2 shadow-lg shadow-secondary/20 dark:shadow-secondary/10 transition-all duration-300 hover:scale-105"
        aria-label="Share list"
      >        {copied ? <FiCheck size={18} className="animate-pulse" /> : <FiShare2 size={18} />}
      </button>
    </div>
  );
}
