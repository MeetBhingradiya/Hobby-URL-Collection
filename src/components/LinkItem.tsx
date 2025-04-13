'use client';

import { useState } from 'react';
import { FiEdit, FiTrash, FiExternalLink } from 'react-icons/fi';
import { updateLink, deleteLink } from '@/lib/actions/link-actions';
import toast from 'react-hot-toast';
import Image from 'next/image';

type LinkItemProps = {
  link: any;
  slug: string;
};

export default function LinkItem({ link, slug }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: link.title || '',
    description: link.description || '',
    url: link.url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('url', formData.url);
    form.append('image', link.image || '');

    try {
      const { success, error } = await updateLink(link._id, form);
      if (success) {
        toast.success('Link updated successfully');
        setIsEditing(false);
      } else {
        toast.error(error || 'Failed to update link');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { success, error } = await deleteLink(link._id);
      if (success) {
        toast.success('Link deleted successfully');
      } else {
        toast.error(error || 'Failed to delete link');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="glass p-5 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-5 dark:text-gray-200">Edit Link</h2>
          <form onSubmit={handleEdit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-2 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-2 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200"
                rows={2}
              />
            </div>
            <div className="mb-5">
              <label htmlFor="url" className="block text-sm font-medium mb-2 dark:text-gray-300">
                URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-outline backdrop-blur-sm px-5 py-2 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800/50"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-glass px-5 py-2 shadow-md shadow-primary/20 dark:shadow-primary/10">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="glass p-5 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
      <div className="flex gap-5">        {link.image && (
          <div className="flex-shrink-0">
            <div className="w-16 h-16 relative overflow-hidden rounded-lg shadow-md">
              <Image 
                src={link.image} 
                alt={link.title || "Link thumbnail"} 
                fill
                className="object-cover" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  // Fallback to a default image if loading fails
                  const target = e.target as HTMLImageElement;
                  target.src = '/favicon.ico'; // Using our favicon as fallback
                  target.onerror = null; // Prevent infinite loop if fallback also fails
                }}
              />
            </div>
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-lg font-medium mb-1.5 dark:text-gray-200">{link.title}</h3>
          {link.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {link.description}
            </p>
          )}          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1.5 text-sm font-mono transition-colors"
          >
            <FiExternalLink size={14} />
            {link.url}
          </a>
        </div>
        <div className="flex-shrink-0 flex flex-col gap-3">          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-colors"
            aria-label="Edit link"
          >
            <FiEdit size={18} />
          </button>          <button
            onClick={handleDelete}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-colors"
            aria-label="Delete link"
            disabled={isDeleting}
          >
            <FiTrash size={18} className={isDeleting ? 'animate-pulse' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
