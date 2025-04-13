'use client';

import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { addLink } from '@/lib/actions/link-actions';
import toast from 'react-hot-toast';

export default function AddLinkForm({ slug }: { slug: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [url, setUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const { success, error } = await addLink(slug, formData);

      if (success) {
        toast.success('Link added to the list!');
        setUrl(''); // Clear the input field
        setIsModalOpen(false); // Close the modal after successful submission
      } else {
        toast.error(error || 'Failed to add link');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary btn-glass flex items-center gap-2 shadow-lg shadow-primary/20 dark:shadow-primary/10 transition-all duration-300 hover:scale-105"
        aria-label="Add new link"
      >
        <FiPlus size={18} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-5 dark:text-gray-200">Add a New Link</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <input
                  type="url"
                  name="url"
                  className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200"
                  placeholder="Enter a URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  autoFocus
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Title and description will be automatically extracted from the URL
                </p>
                <div className="flex justify-end space-x-3 mt-2">
                  <button
                    type="button"
                    className="btn btn-outline backdrop-blur-sm px-5 py-2 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800/50"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-glass whitespace-nowrap px-5 py-2 shadow-lg shadow-primary/20 dark:shadow-primary/10"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Link'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
