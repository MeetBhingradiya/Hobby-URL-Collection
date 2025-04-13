'use client';

import { useState } from 'react';
import { FiEdit, FiTrash, FiLock, FiUsers } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { deleteList, getList, updateList } from '@/lib/actions/list-actions';
import toast from 'react-hot-toast';
import InviteManager from './InviteManager';

export default function ListActions({ slug }: { slug: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInviteManager, setShowInviteManager] = useState(false);
  const [listData, setListData] = useState<{ 
    title: string; 
    description: string; 
    slug: string;
    privacy: string;
  }>({
    title: '',
    description: '',
    slug: '',
    privacy: 'public',
  });
  const router = useRouter();
  // Fetch list data when editing
  const handleEditClick = async () => {
    try {
      const { success, list, error } = await getList(slug);
      if (success && list) {
        setListData({
          title: list.title,
          description: list.description || '',
          slug: list.slug,
          privacy: list.privacy || 'public',
        });
        setIsEditing(true);
      } else {
        toast.error(error || 'Failed to fetch list details');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setListData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateList = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', listData.title);
    form.append('description', listData.description);
    form.append('slug', listData.slug);
    form.append('privacy', listData.privacy);

    try {
      const { success, list, error } = await updateList(slug, form);
      if (success && list) {
        toast.success('List updated successfully');
        setIsEditing(false);
        
        // If the slug was changed, redirect to the new URL
        if (list.slug !== slug) {
          router.push(`/${list.slug}`);
        } else {
          // Refresh the page to show updated content
          router.refresh();
        }
      } else {
        toast.error(error || 'Failed to update list');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  const handleDeleteList = async () => {
    if (confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const { success, error } = await deleteList(slug);
        if (success) {
          toast.success('List deleted successfully');
          router.push('/');
        } else {
          toast.error(error || 'Failed to delete list');
          setIsDeleting(false);
        }
      } catch (error) {
        toast.error('An error occurred');
        console.error(error);
        setIsDeleting(false);
      }
    }
  };  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="glass p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-5 dark:text-gray-200">Edit List</h2>
          <form onSubmit={handleUpdateList}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"              name="title"
              value={listData.title}
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
              value={listData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200"
              rows={3}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="slug" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Custom URL
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-2">theurlist.com/</span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={listData.slug}
                onChange={handleChange}
                className="flex-1 px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200"
                pattern="[a-zA-Z0-9\-]+"
                title="Only letters, numbers, and hyphens are allowed"
                required
              />
            </div>          </div>
          <div className="mb-5">
            <label htmlFor="privacy" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Privacy Setting
            </label>
            <select
              id="privacy"
              name="privacy"
              value={listData.privacy}
              onChange={(e) => setListData({ ...listData, privacy: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200"
            >
              <option value="public">Public - Anyone can view</option>
              <option value="private">Private - Only you can view</option>
              <option value="invite-only">Invite Only - You and people with invite links can view</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-outline backdrop-blur-sm px-4 py-2 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800/50"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-glass px-4 py-2 shadow-md shadow-primary/20 dark:shadow-primary/10">
              Save Changes
            </button>          </div>
        </form>
      </div>
    </div>
    );
  }  return (
    <div className="flex space-x-3">
      <button
        onClick={handleEditClick}
        className="btn btn-glass btn-outline backdrop-blur-sm flex items-center gap-2 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
        aria-label="Edit list"
      >
        <FiEdit size={18} />
      </button>
      <button
        onClick={() => setShowInviteManager(true)}
        className="btn btn-glass btn-outline backdrop-blur-sm flex items-center gap-2 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
        aria-label="Manage invites"
      >
        <FiUsers size={18} />
      </button>
      <button
        onClick={handleDeleteList}
        className="btn btn-glass backdrop-blur-sm text-red-500 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-500 hover:text-white dark:hover:bg-red-500/80 flex items-center gap-2 transition-all duration-300 hover:scale-105"
        aria-label="Delete list"
        disabled={isDeleting}
      >
        <FiTrash size={18} className={isDeleting ? 'animate-pulse' : ''} />
      </button>
    </div>
  );
}
