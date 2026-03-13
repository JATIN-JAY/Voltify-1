/**
 * Navigation Categories
 * Extracted from Navbar for reusability and maintainability
 */
export const NAV_CATEGORIES = [
  {
    name: 'Mobiles',
    items: [
      { name: 'Apple', path: '/category/Mobiles?brand=Apple' },
      { name: 'Samsung', path: '/category/Mobiles?brand=Samsung' },
      { name: 'Google Pixel', path: '/category/Mobiles?brand=Google Pixel' },
      { name: 'OnePlus', path: '/category/Mobiles?brand=OnePlus' },
      { name: 'Xiaomi', path: '/category/Mobiles?brand=Xiaomi' },
    ],
  },
  {
    name: 'Tablets',
    items: [
      { name: 'Apple iPad', path: '/category/Tablets?brand=Apple' },
      { name: 'Samsung Tab', path: '/category/Tablets?brand=Samsung' },
      { name: 'OnePlus Pad', path: '/category/Tablets?brand=OnePlus' },
    ],
  },
  {
    name: 'Audio',
    items: [
      { name: 'Apple AirPods', path: '/category/Audio?brand=Apple' },
      { name: 'Sony', path: '/category/Audio?brand=Sony' },
      { name: 'JBL', path: '/category/Audio?brand=JBL' },
      { name: 'Beats', path: '/category/Audio?brand=Beats' },
    ],
  },
  {
    name: 'Accessories',
    items: [
      { name: 'Chargers', path: '/category/Accessories?type=Chargers' },
      { name: 'Power Banks', path: '/category/Accessories?type=Power Banks' },
      { name: 'Phone Cases', path: '/category/Phone Case' },
    ],
  },
];

/**
 * Product Categories
 * Used in forms and filters
 */
export const PRODUCT_CATEGORIES = [
  'Mobiles',
  'Tablets',
  'Audio',
  'Phone Case',
  'Accessories',
];

/**
 * Brands by Category
 * Used in ProductForm for dynamic brand selection
 */
export const BRANDS_BY_CATEGORY = {
  Mobiles: [
    'Apple',
    'Samsung',
    'Google Pixel',
    'OnePlus',
    'Xiaomi',
    'iQOO',
    'Motorola',
  ],
  Tablets: ['Apple', 'Samsung', 'OnePlus', 'Lenovo', 'iPad', 'Huawei'],
  Audio: ['Apple', 'Samsung', 'Sony', 'JBL', 'Boat', 'Beats', 'Sennheiser'],
  'Phone Case': ['Spigen', 'OtterBox', 'Anker', 'Belkin', 'Samsung'],
  Accessories: ['Anker', 'Belkin', 'Samsung', 'Spigen', 'OtterBox'],
};
