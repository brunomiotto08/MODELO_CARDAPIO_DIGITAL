export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  imagePosition?: string;
  imageKind?: 'real' | 'ilustrativa';
  price?: string;
  unit?: string;
  minQuantity?: number;
  maxQuantity?: number;
  notes?: string[];
  variants?: { label: string; price: string }[];
  featuredOnHome?: boolean;
  availableForDisplay: boolean;
  isDemonstration: boolean;
  tags?: string[];
};

export type OrderItem = {
  productId: string;
  productName: string;
};

export type BrandHours = {
  weekdays: string;
  saturday: string;
  note: string;
};

export type BrandConfig = {
  name: string;
  whatsapp: string;
  phoneDisplay: string;
  instagram: string;
  city: string;
  region: string;
  serviceArea: string[];
  hours: BrandHours;
  leadTimeHours: number;
  eventMinimumGuests: number;
  pickup?: string;
  paymentMethods: string[];
};
