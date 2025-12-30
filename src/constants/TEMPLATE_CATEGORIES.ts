type CategoryMap = {
  [category: string]: string[];
};

const TEMPLATE_CATEGORIES: Readonly<CategoryMap> = {
  Trade: [
    'General Dealer',
    'Spaza Shop',
    'Street Vendor',
    'Clothing & Fashion',
    'Electronics',
    'Mobile Airtime & Accessories',
    'Beauty Products',
    'General Trade',
    'Wholesale Trade',
    'Retail Trade',
    'Mobile Vending',
    'Other Trade Activities',
  ],
  'Production/Manufacturing': [
    'Food & Beverage Processing',
    'Textile & Clothing Manufacturing',
    'Handicraft Production',
    'Woodworking & Furniture',
    'Metal & Construction Materials',
    'Other Manufacturing',
  ],
  'Service Provision': [
    'Personal Services',
    'Repair Services',
    'Transport Services',
    'Hospitality & Food Services',
    'Beauty & Wellness',
    'Professional Services',
    'Other Services',
  ],
  Agriculture: [
    'Vegetable Gardening',
    'Poultry Farming (Chickens)',
    'Livestock Farming (Cattle, Goats, Sheep)',
    'Piggery',
    'Fish Farming (Aquaculture)',
    'Beekeeping (Honey Production)',
    'Dairy Farming',
    'Nursery & Plant Sales',
    'Other Agriculture',
  ],
  Other: [
    'Digital Services (Web Design, Social Media)',
    'Education & Training',
    'Health & Wellness',
    'Tourism & Hospitality',
    'Entertainment & Arts',
    'Other (Please Specify)',
  ],
} as const;

export default TEMPLATE_CATEGORIES;
