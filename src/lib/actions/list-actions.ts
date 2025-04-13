'use server';

import dbConnect from '../db/connect';
import { List } from '../models/list';
import { Link } from '../models/link';
import { generateUniqueSlug } from '../utils/helpers';
import { revalidatePath } from 'next/cache';
import { getUserFromSession } from './auth-actions';
import crypto from 'crypto';
import sendEmail from '../utils/send-email';

export async function createList(formData: FormData) {
  try {
    await dbConnect();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const customSlug = formData.get('slug') as string;
    const privacy = formData.get('privacy') as string || 'public';
    
    // Get current user
    const user = await getUserFromSession();
    
    // Generate a unique slug
    const slug = await generateUniqueSlug(customSlug);

    // Create the list
    const list = await List.create({
      title,
      description,
      slug,
      privacy: ['public', 'private', 'invite-only'].includes(privacy) ? privacy : 'public',
      userId: user?._id || null,
    });

    revalidatePath('/');
    revalidatePath(`/${slug}`);
    revalidatePath('/lists');

    return { success: true, list };
  } catch (error) {
    console.error('Error creating list:', error);
    return { success: false, error: 'Failed to create list' };
  }
}

export async function getList(slug: string, inviteToken?: string) {
  try {
    await dbConnect();

    const list = await List.findOne({ slug });
    if (!list) {
      return { success: false, error: 'List not found' };
    }

    // Get current user
    const currentUser = await getUserFromSession();
    const isOwner = currentUser && list.userId && currentUser._id.toString() === list.userId.toString();
    
    // Check privacy settings
    if (list.privacy === 'public') {
      // Public lists are visible to everyone
      return { success: true, list, isOwner };
    } else if (list.privacy === 'private') {
      // Private lists are only visible to the owner
      if (isOwner) {
        return { success: true, list, isOwner: true };
      } else {
        return { success: false, error: 'You do not have permission to view this list' };
      }
    } else if (list.privacy === 'invite-only') {
      // Invite-only lists are visible to owner and people with valid invite links
      if (isOwner) {
        return { success: true, list, isOwner: true };
      } else if (inviteToken) {
        // Check if the invite token is valid and not expired
        const validInvite = list.inviteLinks.find(
          invite => invite.token === inviteToken && new Date(invite.expiresAt) > new Date()
        );
        
        if (validInvite) {
          return { success: true, list, isOwner: false };
        }
      }
      return { success: false, error: 'You do not have permission to view this list' };
    }

    // Default fallback - shouldn't reach here with proper enum validation
    return { success: false, error: 'Invalid list privacy setting' };
  } catch (error) {
    console.error('Error fetching list:', error);
    return { success: false, error: 'Failed to fetch list' };
  }
}

export async function getAllLists() {
  try {
    await dbConnect();

    // Get current user
    const currentUser = await getUserFromSession();
    
    let query = {};
    
    if (currentUser) {
      // For logged-in users, show:
      // 1. All their own lists regardless of privacy
      // 2. Public lists from other users
      query = {
        $or: [
          { userId: currentUser._id }, // All lists owned by the current user
          { privacy: 'public' } // Public lists from any user
        ]
      };
    } else {
      // For non-logged-in users, only show public lists
      query = { privacy: 'public' };
    }

    const lists = await List.find(query).sort({ createdAt: -1 });
    
    // Mark which lists are owned by the current user
    const listsWithOwnership = lists.map(list => {
      const rawList = list.toObject();
      const isOwner = currentUser && 
                      list.userId && 
                      currentUser._id.toString() === list.userId.toString();
      return { ...rawList, isOwner };
    });
    
    return { success: true, lists: listsWithOwnership };
  } catch (error) {
    console.error('Error fetching lists:', error);
    return { success: false, error: 'Failed to fetch lists' };
  }
}

export async function updateList(slug: string, formData: FormData) {
  try {
    await dbConnect();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const newSlug = formData.get('slug') as string;

    // Check if the new slug is different and needs to be unique
    let slugToUse = slug;
    if (newSlug && newSlug !== slug) {
      slugToUse = await generateUniqueSlug(newSlug);
    }

    const updatedList = await List.findOneAndUpdate(
      { slug },
      { title, description, slug: slugToUse },
      { new: true }
    );

    revalidatePath('/');
    revalidatePath(`/${slug}`);
    if (slugToUse !== slug) {
      revalidatePath(`/${slugToUse}`);
    }

    return { success: true, list: updatedList };
  } catch (error) {
    console.error('Error updating list:', error);
    return { success: false, error: 'Failed to update list' };
  }
}

export async function deleteList(slug: string) {
  try {
    await dbConnect();

    // Find the list
    const list = await List.findOne({ slug });
    if (!list) {
      return { success: false, error: 'List not found' };
    }

    // Delete all links associated with the list
    await Link.deleteMany({ list_id: list._id });

    // Delete the list
    await List.deleteOne({ slug });

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting list:', error);
    return { success: false, error: 'Failed to delete list' };
  }
}

// Generate a magic invite link for a list
export async function generateInviteLink(listSlug: string, email?: string, expirationDays = 7) {
  try {
    await dbConnect();
    
    // Get current user
    const currentUser = await getUserFromSession();
    
    // Find the list
    const list = await List.findOne({ slug: listSlug });
    if (!list) {
      return { success: false, error: 'List not found' };
    }
    
    // Check if user is the owner of the list
    if (!currentUser || !list.userId || currentUser._id.toString() !== list.userId.toString()) {
      return { success: false, error: 'Only the list owner can generate invite links' };
    }
    
    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);
    
    // Add to invite links array
    list.inviteLinks.push({
      token,
      email: email || null,
      expiresAt,
      createdAt: new Date()
    });
    
    await list.save();
    
    // Construct the invite URL
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${listSlug}?invite=${token}`;
    
    // If email is provided, send invitation email
    if (email) {
      await sendInviteEmail(email, inviteUrl, list.title, currentUser.name);
    }
    
    return { 
      success: true, 
      inviteUrl,
      token,
      expiresAt
    };
  } catch (error) {
    console.error('Error generating invite link:', error);
    return { success: false, error: 'Failed to generate invite link' };
  }
}

// Send invitation email
async function sendInviteEmail(email: string, inviteUrl: string, listTitle: string, ownerName: string) {
  try {
    await sendEmail({
      to: email,
      subject: `${ownerName} has invited you to view a list on The Urlist`,
      text: `Hello,

${ownerName} has invited you to view their list "${listTitle}" on The Urlist.

You can access the list using this link: ${inviteUrl}

This link will expire in 7 days.

Best regards,
The Urlist Team`,
      html: `
        <p>Hello,</p>
        <p><strong>${ownerName}</strong> has invited you to view their list "<strong>${listTitle}</strong>" on The Urlist.</p>
        <p>You can access the list by clicking the button below:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View List</a>
        </p>
        <p>Or copy and paste this link into your browser: <a href="${inviteUrl}">${inviteUrl}</a></p>
        <p>This link will expire in 7 days.</p>
        <p>Best regards,<br>The Urlist Team</p>
      `
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending invite email:', error);
    return { success: false, error: 'Failed to send invite email' };
  }
}

// Get all invite links for a list
export async function getInviteLinks(listSlug: string) {
  try {
    await dbConnect();
    
    // Get current user
    const currentUser = await getUserFromSession();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to view invite links' };
    }
    
    // Find the list
    const list = await List.findOne({ slug: listSlug });
    if (!list) {
      return { success: false, error: 'List not found' };
    }
    
    // Check if user is the owner of the list
    if (!list.userId || currentUser._id.toString() !== list.userId.toString()) {
      return { success: false, error: 'Only the list owner can view invite links' };
    }
    
    // Filter out expired invites
    const currentDate = new Date();
    const activeInvites = list.inviteLinks.filter(invite => 
      new Date(invite.expiresAt) > currentDate
    );
    
    return { 
      success: true, 
      invites: activeInvites,
      baseUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${listSlug}?invite=`
    };
  } catch (error) {
    console.error('Error fetching invite links:', error);
    return { success: false, error: 'Failed to fetch invite links' };
  }
}

// Delete an invite link
export async function deleteInviteLink(listSlug: string, token: string) {
  try {
    await dbConnect();
    
    // Get current user
    const currentUser = await getUserFromSession();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to manage invite links' };
    }
    
    // Find the list
    const list = await List.findOne({ slug: listSlug });
    if (!list) {
      return { success: false, error: 'List not found' };
    }
    
    // Check if user is the owner of the list
    if (!list.userId || currentUser._id.toString() !== list.userId.toString()) {
      return { success: false, error: 'Only the list owner can manage invite links' };
    }
    
    // Remove the invite link with the given token
    list.inviteLinks = list.inviteLinks.filter(invite => invite.token !== token);
    
    await list.save();
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting invite link:', error);
    return { success: false, error: 'Failed to delete invite link' };
  }
}
