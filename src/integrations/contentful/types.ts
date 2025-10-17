import { Asset, Entry, EntryCollection, EntrySkeletonType } from 'contentful';

/**
 * Contentful Content Types
 *
 * Define your content model types here to get full TypeScript support.
 * Update these interfaces to match your Contentful content model.
 */

// Hero Banner Content Type
export interface HeroBannerSkeleton extends EntrySkeletonType {
  contentTypeId: 'heroBanner';
  fields: {
    cta: string;
    images?: Asset[];
  };
}

export type HeroBanner = Entry<HeroBannerSkeleton>;
export type HeroBannerCollection = EntryCollection<HeroBannerSkeleton>;

// Example: Blog Post Content Type
export interface BlogPostSkeleton extends EntrySkeletonType {
  contentTypeId: 'blogPost';
  fields: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: Asset;
    author?: Entry<AuthorSkeleton>;
    category?: Entry<CategorySkeleton>;
    tags?: string[];
    publishedDate: string;
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
    };
  };
}

export type BlogPost = Entry<BlogPostSkeleton>;
export type BlogPostCollection = EntryCollection<BlogPostSkeleton>;

// Example: Author Content Type
export interface AuthorSkeleton extends EntrySkeletonType {
  contentTypeId: 'author';
  fields: {
    name: string;
    bio?: string;
    avatar?: Asset;
    email?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
}

export type Author = Entry<AuthorSkeleton>;

// Example: Category Content Type
export interface CategorySkeleton extends EntrySkeletonType {
  contentTypeId: 'category';
  fields: {
    name: string;
    slug: string;
    description?: string;
  };
}

export type Category = Entry<CategorySkeleton>;

// Example: Space Highlight Content Type (specific to Keysely)
export interface SpaceHighlightSkeleton extends EntrySkeletonType {
  contentTypeId: 'spaceHighlight';
  fields: {
    title: string;
    description: string;
    space?: {
      spaceId: string;
      spaceName: string;
    };
    images?: Asset[];
    featured: boolean;
    displayOrder?: number;
  };
}

export type SpaceHighlight = Entry<SpaceHighlightSkeleton>;
export type SpaceHighlightCollection = EntryCollection<SpaceHighlightSkeleton>;

// Example: Marketing Banner Content Type
export interface MarketingBannerSkeleton extends EntrySkeletonType {
  contentTypeId: 'marketingBanner';
  fields: {
    title: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: Asset;
    active: boolean;
    startDate?: string;
    endDate?: string;
  };
}

export type MarketingBanner = Entry<MarketingBannerSkeleton>;

// Example: FAQ Content Type
export interface FAQSkeleton extends EntrySkeletonType {
  contentTypeId: 'faq';
  fields: {
    question: string;
    answer: string;
    category?: string;
    order?: number;
  };
}

export type FAQ = Entry<FAQSkeleton>;
export type FAQCollection = EntryCollection<FAQSkeleton>;

// Generic helper types
export interface ContentfulImage {
  url: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
}

export interface ContentfulLink {
  text: string;
  url: string;
  openInNewTab?: boolean;
}
