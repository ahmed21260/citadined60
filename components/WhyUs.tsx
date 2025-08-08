import React from 'react';

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="text-center p-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border border-brand-red/30">
            {icon}
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2 uppercase">{title}</h3>
        <p className="text-brand-gray">{children}</p>
    </div>
);

const WhyUs: React.FC = () => {
    return (
        <section id="about" className="bg-brand-black py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Pourquoi <span className="text-brand-red">CITADINE D'60</span> ?</h2>
                    <p className="text-lg text-brand-gray mt-4 max-w-2xl mx-auto">Plus qu'une location de voiture, une solution simple et efficace pour tous vos déplacements dans l'Oise, y compris depuis l'aéroport de Beauvais-Tillé.</p>
                    <div className="h-1 w-20 bg-brand-red mx-auto mt-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Feature
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Simplicité"
                    >
                        Réservez votre voiture en quelques clics, sans paperasse inutile.
                    </Feature>
                    <Feature
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 013.375-3.375h9.75a3.375 3.375 0 013.375 3.375v1.875" /></svg>}
                        title="Flotte Récente"
                    >
                        Conduisez des citadines modernes, parfaitement entretenues et bien équipées.
                    </Feature>
                     <Feature
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Réactivité"
                    >
                        Notre service client est à votre écoute pour répondre à toutes vos demandes.
                    </Feature>
                    <Feature
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Prix Justes"
                    >
                        Profitez de tarifs compétitifs et transparents, sans frais cachés.
                    </Feature>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;