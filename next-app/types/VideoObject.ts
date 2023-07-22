export default interface VideoObject {
  "@context": string;
  "@type": string;
  name: string;
  size: string;
  identifier: string;
  url: string;
  embedUrl?: string;
  duration?: number;
  encodingFormat: string;
  uploadDate?: string;
  dateCreated?: string;
  dateModified?: string;
  datePublished?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  recordId?: string;
}
