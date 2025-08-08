import { Timestamp } from 'firebase/firestore';

export enum GearboxType {
  Automatic = "Automatique",
  Manual = "Manuelle",
}

export interface Car {
  id: number;
  name: string;
  brand: string;
  brandLogo: string;
  image: string;
  gearbox: GearboxType;
  fuel: string;
  pricing: {
    day: { price: number; km: number };
    week: { price: number; km: number };
    month: { price: number; km: number };
  };
  extraKmPrice: number;
  deposit: number;
  gallery: string[];
}

export interface Testimonial {
  id: number;
  name:string;
  location: string;
  comment: string;
  avatar: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  isAdmin?: boolean;
  stripeCustomerId?: string;
}

export interface BookingDetails {
    startDate: string;
    endDate: string;
    isDelivery: boolean;
    deliveryAddress: string;
}

export interface Booking {
  id: string;
  userId: string;
  car: Car;
  startDate: string;
  endDate: string;
  durationInDays: number;
  totalPrice: number;
  includedKm: number;
  delivery: {
    enabled: boolean;
    address: string;
    fee: number;
  };
  user: {
     firstName: string;
     lastName: string;
     email: string;
     phone: string;
     address: string;
  };
  documents: {
    licenseFront: string;
    licenseBack: string;
    proofOfAddress: string;
    identity: string;
  };
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  createdAt: Timestamp;
  paymentOption: 'full' | 'down_payment';
  downPayment?: number;
  stripePaymentIntentId: string;
  stripeCustomerId: string;
}

export interface AIVerificationResult {
    nameMatch: boolean;
    addressMatch: boolean;
    summary: string;
}


export type LegalPage = 'notice' | 'privacy' | 'tos';