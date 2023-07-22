export default interface DigitalDocument {
  "@type": string;
  "@context": string;
  name: string;
  author: string;
  url: string;
  encodingFormat: string;
  size: string;
  identifier: string;
  dateCreated?: string;
  dateModified?: string;
  datePublished: string;
  thumbnail?: Blob;
  thumbnailUrl?: string;
}
