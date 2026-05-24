// User credentials
export interface TestDataUser {
  email: string;
  password: string;
}

// User registration data
export interface TestDataRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  wrongConfirmPassword: string;
}

// Delivery address
export interface TestDataDelivery {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  suburb: string;
  city: string;
  postcode: string;
  instructions: string;
}

// Payment information
export interface TestDataPayment {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
}

// Checkout data
export interface TestDataCheckout {
  delivery: TestDataDelivery;
  payment: TestDataPayment;
}

// Menu options
export interface TestDataMenu {
  categories: string[];
  searchTerms: string[];
  invalidSearch: string;
}

// Contact form data
export interface TestDataContact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Delivery zones
export interface TestDataDeliveryZones {
  validPostcode: string;
  invalidPostcode: string;
}

// Promo codes
export interface TestDataPromoCode {
  valid: string;
  invalid: string;
}

// Navigation links
export interface TestDataNavigation {
  links: string[];
  footerLinks: string[];
}

// Timeouts
export interface TestDataTimeouts {
  pageLoad: number;
  element: number;
  animation: number;
}

// Complete test data structure
export interface TestData {
  baseUrl: string;
  users: {
    valid: TestDataUser;
    invalid: TestDataUser;
    lockedOut: TestDataUser;
  };
  registration: TestDataRegistration;
  checkout: TestDataCheckout;
  menu: TestDataMenu;
  contact: TestDataContact;
  deliveryZones: TestDataDeliveryZones;
  promoCode: TestDataPromoCode;
  navigation: TestDataNavigation;
  timeouts: TestDataTimeouts;
}
