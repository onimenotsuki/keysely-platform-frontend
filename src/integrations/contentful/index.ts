/**
 * Contentful CMS Integration
 *
 * Centralized exports for Contentful integration.
 * Import everything you need from this single file.
 */

// Clients
export { contentfulClient, contentfulPreviewClient, getContentfulClient } from './client';

// Types
export type {
  Author,
  AuthorSkeleton,
  BlogPost,
  BlogPostCollection,
  BlogPostSkeleton,
  Category,
  CategorySkeleton,
  FAQ,
  FAQCollection,
  FAQSkeleton,
  HeroBanner,
  HeroBannerCollection,
  HeroBannerSkeleton,
  MarketingBanner,
  MarketingBannerSkeleton,
  SpaceHighlight,
  SpaceHighlightCollection,
  SpaceHighlightSkeleton,
} from './types';

// Services
export { getHeroBanner } from './services';
