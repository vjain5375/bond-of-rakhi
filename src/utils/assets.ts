/**
 * Utility functions for handling asset URLs in different environments
 */

/**
 * Get the correct asset URL for the current environment
 * This handles both development and production (GitHub Pages) deployments
 */
export function getAssetUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In development, use absolute paths
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  // In production, use the base URL
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${cleanPath}`;
}

/**
 * Get the correct URL for lovable uploads
 */
export function getLovableUploadUrl(filename: string): string {
  return getAssetUrl(`lovable-uploads/${filename}`);
}
