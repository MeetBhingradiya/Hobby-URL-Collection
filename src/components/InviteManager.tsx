'use client';

import { useState, useEffect } from 'react';
import { generateInviteLink, getInviteLinks, deleteInviteLink } from '@/lib/actions/list-actions';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck, FiTrash, FiMail } from 'react-icons/fi';

interface InviteManagerProps {
  listSlug: string;
}

export default function InviteManager({ listSlug }: InviteManagerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [invites, setInvites] = useState<any[]>([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch existing invite links
  useEffect(() => {
    async function fetchInvites() {
      setIsLoading(true);
      try {
        const result = await getInviteLinks(listSlug);
        if (result.success) {
          setInvites(result.invites || []);
          setBaseUrl(result.baseUrl || '');
        } else {
          toast.error(result.error || 'Failed to fetch invite links');
        }
      } catch (error) {
        console.error('Error fetching invites:', error);
        toast.error('An error occurred while fetching invite links');
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvites();
  }, [listSlug]);

  // Generate a new invite link
  const handleGenerateInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const result = await generateInviteLink(listSlug, email || undefined);
      
      if (result.success) {
        // Add the new invite to the list
        const newInvite = {
          token: result.token,
          email: email || null,
          expiresAt: result.expiresAt,
          createdAt: new Date()
        };
        
        setInvites([...invites, newInvite]);
        setEmail('');
        
        if (email) {
          toast.success(`Invite sent to ${email}`);
        } else {
          toast.success('Invite link generated');
          // Copy to clipboard
          await navigator.clipboard.writeText(result.inviteUrl);
          toast.success('Invite link copied to clipboard');
        }
      } else {
        toast.error(result.error || 'Failed to generate invite link');
      }
    } catch (error) {
      console.error('Error generating invite:', error);
      toast.error('An error occurred while generating invite link');
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete an invite link
  const handleDeleteInvite = async (token: string) => {
    try {
      const result = await deleteInviteLink(listSlug, token);
      
      if (result.success) {
        // Remove the deleted invite from the list
        setInvites(invites.filter(invite => invite.token !== token));
        toast.success('Invite link deleted');
      } else {
        toast.error(result.error || 'Failed to delete invite link');
      }
    } catch (error) {
      console.error('Error deleting invite:', error);
      toast.error('An error occurred while deleting invite link');
    }
  };

  // Copy invite link to clipboard
  const copyToClipboard = async (token: string) => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}${token}`);
      setCopied(token);
      setTimeout(() => setCopied(null), 2000);
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-2">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-medium mb-4 dark:text-white">Generate Invite Link</h3>
        
        <form onSubmit={handleGenerateInvite} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address (Optional)
            </label>
            <div className="flex">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="flex-1 px-3 py-2 rounded-l-lg border dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all dark:text-gray-200"
              />
              <button
                type="submit"
                className="btn btn-primary rounded-l-none flex items-center gap-2"
                disabled={isGenerating}
              >
                <FiMail className="h-4 w-4" />
                <span>{isGenerating ? 'Generating...' : email ? 'Send Invite' : 'Generate Link'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {email 
                ? 'An email will be sent with the invite link' 
                : 'Leave blank to just generate a link without sending an email'}
            </p>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-medium mb-4 dark:text-white">Active Invite Links</h3>
        
        {invites.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No active invite links</p>
        ) : (
          <div className="space-y-3">
            {invites.map((invite) => (
              <div 
                key={invite.token} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border dark:border-gray-700 rounded-lg gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {invite.email && (
                      <span className="text-sm font-medium dark:text-gray-300">{invite.email}</span>
                    )}
                    {!invite.email && (
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">General invite link</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Expires on {formatDate(invite.expiresAt)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => copyToClipboard(invite.token)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors rounded-full"
                    title="Copy link"
                  >
                    {copied === invite.token ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteInvite(invite.token)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full"
                    title="Delete invite"
                  >
                    <FiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
