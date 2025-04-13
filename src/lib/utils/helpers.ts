import { customAlphabet } from 'nanoid';
import { List } from '../models/list';

// Create a custom nanoid with a specified alphabet (lowercase, uppercase, numbers)
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

/**
 * Generates a unique slug for a list
 * If a custom slug is provided, it checks if it's available
 * If not provided or not available, it generates a random one
 */
export async function generateUniqueSlug(customSlug?: string): Promise<string> {
  // If a custom slug is provided, check if it's available
  if (customSlug) {
    const slugExists = await List.findOne({ slug: customSlug });
    if (!slugExists) {
      return customSlug;
    }
  }

  // Generate a random slug
  let isUnique = false;
  let randomSlug = '';

  while (!isUnique) {
    randomSlug = nanoid();
    // Check if the slug already exists
    const slugExists = await List.findOne({ slug: randomSlug });
    if (!slugExists) {
      isUnique = true;
    }
  }

  return randomSlug;
}

/**
 * Extracts metadata from a URL
 * This is a placeholder function that would typically fetch title, description, and image from a URL
 */
export async function extractMetadataFromUrl(url: string) {
  try {
    // In a real application, you would use a library like 'metascraper' or similar
    // to extract metadata from the URL
    // For now, we'll just return a placeholder
    return {
      title: url,
      description: 'No description available',
      image: `/favicon.ico`
    };
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return {
      title: url,
      description: 'No description available',
      image: `/favicon.ico`
    };
  }
}
