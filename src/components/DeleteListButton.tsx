'use client';

import { FiTrash } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface DeleteListButtonProps {
  slug: string;
}

export default function DeleteListButton({ slug }: DeleteListButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this list?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/lists/${slug}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('List deleted successfully');
        router.refresh(); // Refresh the page to show updated lists
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete list');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the list');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <button
      type="button"
      className="p-2 rounded-full text-red-500 dark:text-red-400 hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-red-500 dark:disabled:hover:text-red-400"
      title="Delete list"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <FiTrash size={18} className={isDeleting ? 'animate-pulse' : ''} />
    </button>
  );
}
