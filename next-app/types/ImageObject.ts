export default interface ImageObject {
  name: string;
  contentUrl: string;
  "@context": string;
  "@type": string;
  author: string;
  encodingFormat: string;
  uploadDate: string;
  identifier?: string;
}
