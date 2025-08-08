

import { Car, GearboxType, Testimonial, FaqItem, Booking } from './types';

export const vehicles: Car[] = [
  {
    id: 1,
    name: 'CLIO RS Line (2021)',
    brand: 'Renault',
    brandLogo: 'https://cdn.worldvectorlogo.com/logos/renault-2.svg',
    image: 'https://i.postimg.cc/W1XtZ6H1/RENAUT-CLIO-RS-LINE.png',
    gearbox: GearboxType.Automatic,
    fuel: 'Essence',
    pricing: { 
      day: { price: 80, km: 200 },
      week: { price: 470, km: 1400 },
      month: { price: 1650, km: 4200 },
    },
    extraKmPrice: 0.25,
    deposit: 800,
    gallery: [
      'https://i.postimg.cc/W1XtZ6H1/RENAUT-CLIO-RS-LINE.png',
      'https://i.postimg.cc/dQTwKTxc/Design-sans-titre-1.png',
      'https://i.postimg.cc/9fL2pdgs/IMG-20250721-WA0006.jpg',
    ],
  },
  {
    id: 2,
    name: 'CLIO Intense (2021)',
    brand: 'Renault',
    brandLogo: 'https://cdn.worldvectorlogo.com/logos/renault-2.svg',
    image: 'https://i.postimg.cc/mrdv7VMV/black-and-yellow-futuristic-gaming-desktop-backgrounds.png',
    gearbox: GearboxType.Manual,
    fuel: 'Essence',
    pricing: { 
      day: { price: 80, km: 200 },
      week: { price: 470, km: 1400 },
      month: { price: 1650, km: 4200 },
    },
    extraKmPrice: 0.25,
    deposit: 800,
    gallery: [
      'https://i.postimg.cc/mrdv7VMV/black-and-yellow-futuristic-gaming-desktop-backgrounds.png',
    ],
  },
  {
    id: 3,
    name: 'Peugeot 208 GT Line (2016)',
    brand: 'Peugeot',
    brandLogo: 'https://cdn.worldvectorlogo.com/logos/peugeot-208.svg',
    image: 'https://i.postimg.cc/G2h2zMHf/208-GT-LINE-2.png',
    gearbox: GearboxType.Manual,
    fuel: 'Essence',
    pricing: { 
      day: { price: 60, km: 200 },
      week: { price: 400, km: 1400 },
      month: { price: 1000, km: 4200 },
    },
    extraKmPrice: 0.25,
    deposit: 800,
    gallery: [
      'https://i.postimg.cc/G2h2zMHf/208-GT-LINE-2.png',
    ],
  },
  {
    id: 7,
    name: 'Peugeot 208 Féline (2014)',
    brand: 'Peugeot',
    brandLogo: 'https://cdn.worldvectorlogo.com/logos/peugeot-208.svg',
    image: 'https://i.postimg.cc/C1j3BYhT/Peugeot-208.png',
    gearbox: GearboxType.Manual,
    fuel: 'Essence',
    pricing: {
      day: { price: 60, km: 200 },
      week: { price: 400, km: 1400 },
      month: { price: 1000, km: 4200 },
    },
    extraKmPrice: 0.25,
    deposit: 800,
    gallery: [
      'https://i.postimg.cc/C1j3BYhT/Peugeot-208.png',
    ],
  },
  {
    id: 4,
    name: 'Volkswagen Polo GTI (2019)',
    brand: 'Volkswagen',
    brandLogo: 'https://cdn.worldvectorlogo.com/logos/volkswagen-3.svg',
    image: 'https://i.postimg.cc/bJfgthMP/black-and-yellow-futuristic-gaming-desktop-backgrounds-6.png',
    gearbox: GearboxType.Manual,
    fuel: 'Essence',
    pricing: { 
      day: { price: 80, km: 200 },
      week: { price: 470, km: 1400 },
      month: { price: 1650, km: 4200 },
    },
    extraKmPrice: 0.25,
    deposit: 800,
    gallery: [
      'https://i.postimg.cc/bJfgthMP/black-and-yellow-futuristic-gaming-desktop-backgrounds-6.png',
    ],
  },
  {
    id: 5,
    name: 'Fiat 500X (2016)',
    brand: 'Fiat',
    brandLogo: 'https://cdn.worldvectorlogo.com/logos/fiat-4.svg',
    image: 'https://i.postimg.cc/RZThx55F/black-and-yellow-futuristic-gaming-desktop-backgrounds-4.png',
    gearbox: GearboxType.Manual,
    fuel: 'Essence',
    pricing: { 
      day: { price: 60, km: 200 },
      week: { price: 400, km: 1400 },
      month: { price: 1000, km: 4200 },
    },
    extraKmPrice: 0.25,
    deposit: 800,
    gallery: [
      'https://i.postimg.cc/RZThx55F/black-and-yellow-futuristic-gaming-desktop-backgrounds-4.png',
    ],
  },
   {
    id: 6,
    name: 'Peugeot 308 GT Line (2018)',
    brand: 'Peugeot',
    brandLogo: 'https://cdn.worldvectorlogo.com/logos/peugeot-208.svg',
    image: 'https://i.postimg.cc/xjGQqG8J/308-GT.png',
    gearbox: GearboxType.Manual,
    fuel: 'Essence',
    pricing: { 
      day: { price: 80, km: 200 },
      week: { price: 470, km: 1400 },
      month: { price: 1650, km: 4200 },
    },
    extraKmPrice: 0.25,
    deposit: 800,
    gallery: [
      'https://i.postimg.cc/xjGQqG8J/308-GT.png',
    ],
  },
];

export const testimonials: Testimonial[] = [
    { id: 1, name: 'Laura P.', location: 'Beauvais (60)', comment: "Super pratique pour un week-end ! La Clio était propre, économique et facile à garer. Processus de réservation ultra simple.", avatar: 'https://placehold.co/100x100/E91E63/FFFFFF?text=LP' },
    { id: 2, name: 'Kevin D.', location: 'Compiègne (60)', comment: "J'ai loué une voiture pour une surprise, elle a fait son effet ! Véhicule nerveux et fun à conduire. Service client au top.", avatar: 'https://placehold.co/100x100/2196F3/FFFFFF?text=KD' },
    { id: 3, name: 'Sarah & Tom', location: 'Aéroport de Beauvais', comment: "Service de livraison à l'aéroport parfait. A peine sortis de l'avion, la voiture nous attendait. Super pratique et gain de temps énorme.", avatar: 'https://placehold.co/100x100/4CAF50/FFFFFF?text=ST' },
    { id: 4, name: 'Marc A.', location: 'Creil (60)', comment: "Location pour le travail, véhicule impeccable et conforme à la description. Communication facile avec l'équipe.", avatar: 'https://placehold.co/100x100/FF9800/FFFFFF?text=MA' },
];

export const faqItems: FaqItem[] = [
    {
        question: "Quels documents sont nécessaires pour louer une voiture ?",
        answer: "Vous aurez besoin de votre permis de conduire original (pas de photocopie), d'une pièce d'identité en cours de validité (carte d'identité ou passeport) et d'un justificatif de domicile de moins de 3 mois (facture d'électricité, de téléphone, etc.)."
    },
    {
        question: "Puis-je louer si je suis un jeune conducteur ?",
        answer: "Oui, les jeunes conducteurs sont acceptés sous certaines conditions. Un supplément peut s'appliquer et une durée de détention du permis minimale est requise. Contactez-nous pour plus de détails."
    },
    {
        question: "Comment fonctionne le dépôt de garantie (caution) ?",
        answer: "Le dépôt de garantie est une somme d'argent bloquée sur votre carte de crédit (pré-autorisation) mais non débitée. Elle sert à couvrir d'éventuels dommages sur le véhicule. Elle est restituée intégralement si le véhicule est rendu dans le même état."
    },
    {
        question: "Que se passe-t-il si je dépasse le kilométrage inclus ?",
        answer: "Chaque kilomètre supplémentaire au-delà du forfait inclus sera facturé au tarif indiqué sur la page du véhicule. Le total sera calculé lors de la restitution du véhicule."
    },
    {
        question: "Proposez-vous des sièges pour enfants ou des GPS ?",
        answer: "Nous prévoyons d'offrir ces options prochainement. Pour le moment, nous vous conseillons d'apporter votre propre équipement si nécessaire."
    }
];