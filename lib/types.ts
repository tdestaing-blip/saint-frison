import type { HomeCopy } from "./home-copy";
export type Media = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number };
  asset?: { _ref: string };
};
export type Colourway = {
  name: string;
  swatch?: string;
  heroMedia?: Media;
  gallery?: Media[];
};
export type EditorialBlock = {
  _key: string;
  type:
    | "full"
    | "portrait"
    | "landscape"
    | "pair"
    | "imageText"
    | "process"
    | "note"
    | "spacer";
  images?: Media[];
  text?: string;
};
export type Entry = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  description: string;
  category?: string;
  textileGroup?: "collection" | "exception" | "research";
  typology?: string;
  baseDescription?: string;
  productionType?: string;
  priceLabel?: string;
  electricalInfo?: string;
  socketType?: string;
  recommendedBulb?: string;
  maxWattage?: string;
  cableDescription?: string;
  countryOfManufacture?: string;
  vintageNote?: string;
  lightingSlugs?: string[];
  projectSlugs?: string[];
  relatedTextileSlugs?: string[];
  heroMedia: Media;
  gallery: Media[];
  composition?: string;
  width?: string;
  weight?: string;
  collection?: string;
  dimensions?: string;
  colourNames?: string;
  colourways?: Colourway[];
  applications?: string[];
  performance?: string[];
  materials?: string[];
  minimumOrder?: string;
  leadTime?: string;
  madeToOrder?: boolean;
  customisation?: string;
  care?: string;
  technicalSheet?: string;
  year?: string;
  location?: string;
  credits?: string;
  clientOrCollaborator?: string;
  status?: string;
  shopifyHandle?: string;
  textileSlug?: string;
  textileSlugs?: string[];
  contentBlocks?: EditorialBlock[];
  metaTitle?: string;
  metaDescription?: string;
  sortOrder: number;
};
export type Settings = {
  professionalEmail?: string;
  instagramUrl?: string;
  studioLocationLabel?: string;
  availablePiecesEnabled?: boolean;
};
export type HomeContent = {
  copy?: Partial<HomeCopy>;
  exceptionFeature?: Entry;
  heroMedia?: Media;
  heroLine?: string;
  materialProcessMedia?: Media[];
  selectedTextiles?: Entry[];
  lightingFeature?: Entry;
  selectedProjects?: Entry[];
  closingContactCopy?: string;
};
