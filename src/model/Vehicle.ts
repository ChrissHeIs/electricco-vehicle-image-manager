export interface Vehicle {
  brand: string;
  model: string;
  year: string;
  information: { brand: string; model: string }; // Information for image query
  imageUrls?: string[]; // Image URLs (optional at first)
}