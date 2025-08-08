import React from 'react';
import { Service } from '../types';

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <div className="bg-white/5 p-8 rounded-lg transition-transform duration-300 hover:-translate-y-2 border border-transparent hover:border-white/10">
        <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-full bg-brand-black">
            {service.icon}
        </div>
        <h3 className="text-xl font-display text-white mb-3 uppercase">{service.title}</h3>
        <p className="text-brand-gray">{service.description}</p>
    </div>
);


const Services: React.FC = () => {

    const services: Service[] = [
        {
            id: 1,
            title: 'Livraison à la carte',
            description: "Recevez et rendez votre véhicule où vous le souhaitez dans un rayon de 50km. Nous sommes spécialisés dans la desserte de l'aéroport de Beauvais-Tillé, des gares et de votre domicile.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
        },
        {
            id: 2,
            title: 'Forfaits Flexibles',
            description: 'Que ce soit pour une journée, une semaine ou un mois, nous avons des forfaits adaptés à votre budget et vos besoins.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>
        },
        {
            id: 3,
            title: 'Location Événementielle',
            description: 'Besoin d\'une voiture pour un mariage, un anniversaire ou un autre événement ? Contactez-nous pour une offre sur mesure.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
        },
    ];

    return (
        <section id="services" className="bg-white/5 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Nos Services</h2>
                    <p className="text-lg text-brand-gray mt-4 max-w-2xl mx-auto">Des services de location de voiture pensés pour vous simplifier la vie à Beauvais et ses environs.</p>
                     <div className="h-1 w-20 bg-brand-red mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map(service => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;