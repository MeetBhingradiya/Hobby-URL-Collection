'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createList } from '../lib/actions/list-actions';
import toast from 'react-hot-toast';

export default function CreateListForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const { success, list, error } = await createList(formData);

      if (success && list) {
        toast.success('List created successfully!');
        router.push(`/${list.slug}`);
      } else {
        toast.error(error || 'Failed to create list');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 sm:mb-5">
        <label htmlFor="title" className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium dark:text-gray-300">
          List Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200 text-sm sm:text-base"
          placeholder="My Awesome Link Collection"
          required
        />
      </div>

      <div className="mb-4 sm:mb-5">
        <label htmlFor="description" className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200 text-sm sm:text-base"
          placeholder="A brief description of what this list contains"
          rows={3}
        />
      </div>      <div className="mb-5 sm:mb-6">
        <label htmlFor="slug" className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium dark:text-gray-300">
          Custom URL (optional)
        </label>
        <div className="flex items-center">
          <span className="text-gray-500 dark:text-gray-400 mr-2 text-sm sm:text-base">theurlist.com/</span>
          <input
            type="text"
            id="slug"
            name="slug"
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200 text-sm sm:text-base"
            placeholder="my-awesome-list"
            pattern="[a-zA-Z0-9\-]+"
            title="Only letters, numbers, and hyphens are allowed"
          />
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2">
          Leave blank for an auto-generated URL
        </p>
      </div>

      <div className="mb-5 sm:mb-6">
        <label htmlFor="privacy" className="block mb-1.5 sm:mb-2 text-sm sm:text-base font-medium dark:text-gray-300">
          Privacy Setting
        </label>
        <select
          id="privacy"
          name="privacy"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200 text-sm sm:text-base"
        >
          <option value="public">Public - Anyone can view</option>
          <option value="private">Private - Only you can view</option>
          <option value="invite-only">Invite Only - You and people with invite links can view</option>
        </select>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2">
          Control who can access your list
        </p>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-glass w-full py-2.5 sm:py-3 text-sm sm:text-base font-medium shadow-lg shadow-primary/20 dark:shadow-primary/10"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create List'}
      </button>
    </form>
  );
}
