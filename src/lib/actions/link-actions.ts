'use server';

import dbConnect from '../db/connect';
import { Link } from '../models/link';
import { List } from '../models/list';
import { extractMetadataFromUrl } from '../utils/helpers';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

export async function addLink(slug: string, formData: FormData) {
  try {
    await dbConnect();

    // Find the list by slug
    const list = await List.findOne({ slug });
    if (!list) {
      return { success: false, error: 'List not found' };
    }

    const url = formData.get('url') as string;
    let title = formData.get('title') as string;
    let description = formData.get('description') as string;
    let image = formData.get('image') as string;

    // If title, description or image are not provided, extract metadata from URL
    if (!title || !description || !image) {
      const metadata = await extractMetadataFromUrl(url);
      title = title || metadata.title;
      description = description || metadata.description;
      image = image || metadata.image;
    }

    // Create the link
    const link = await Link.create({
      title,
      description,
      url,
      image,
      list_id: list._id,
    });

    revalidatePath(`/${slug}`);

    return { success: true, link };
  } catch (error) {
    console.error('Error adding link:', error);
    return { success: false, error: 'Failed to add link' };
  }
}

export async function getLinks(slug: string) {
  try {
    await dbConnect();

    // Find the list by slug
    const list = await List.findOne({ slug });
    if (!list) {
      return { success: false, error: 'List not found' };
    }

    // Get all links for the list
    const links = await Link.find({ list_id: list._id }).sort({ createdAt: -1 });

    return { success: true, links };
  } catch (error) {
    console.error('Error fetching links:', error);
    return { success: false, error: 'Failed to fetch links' };
  }
}

export async function updateLink(linkId: string, formData: FormData) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(linkId)) {
      return { success: false, error: 'Invalid link ID' };
    }

    const url = formData.get('url') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;

    // Find the link to get its list_id for path revalidation
    const existingLink = await Link.findById(linkId);
    if (!existingLink) {
      return { success: false, error: 'Link not found' };
    }

    // Find the list to get the slug for path revalidation
    const list = await List.findById(existingLink.list_id);
    if (!list) {
      return { success: false, error: 'Associated list not found' };
    }

    // Update the link
    const updatedLink = await Link.findByIdAndUpdate(
      linkId,
      { title, description, url, image },
      { new: true }
    );

    revalidatePath(`/${list.slug}`);

    return { success: true, link: updatedLink };
  } catch (error) {
    console.error('Error updating link:', error);
    return { success: false, error: 'Failed to update link' };
  }
}

export async function deleteLink(linkId: string) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(linkId)) {
      return { success: false, error: 'Invalid link ID' };
    }

    // Find the link to get its list_id for path revalidation
    const link = await Link.findById(linkId);
    if (!link) {
      return { success: false, error: 'Link not found' };
    }

    // Find the list to get the slug for path revalidation
    const list = await List.findById(link.list_id);
    if (!list) {
      return { success: false, error: 'Associated list not found' };
    }

    // Delete the link
    await Link.findByIdAndDelete(linkId);

    revalidatePath(`/${list.slug}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting link:', error);
    return { success: false, error: 'Failed to delete link' };
  }
}
