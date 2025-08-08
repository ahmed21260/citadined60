import React from 'react';

const Hero: React.FC = () => {
    const handleScrollDown = () => {
        document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' });
    };

    const line1 = "Location de voiture à Beauvais";
    const line2 = "Simple & Rapide";

    return (
        <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-black z-10 opacity-60"></div>
            <div 
                className="absolute z-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('https://i.postimg.cc/Rh1dvDVR/0e2f12af-6f42-48b1-ba13-7e5de029e9d9.png')" }}
            ></div>
            <div className="relative z-20 px-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-4 uppercase drop-shadow-lg">
                    <span>{line1}</span>
                    <br/>
                    <span className="text-brand-red">{line2}</span>
                </h1>
                <p className="text-lg md:text-xl text-brand-gray max-w-2xl mx-auto mb-8">
                    Votre citadine dès 60€/jour. Idéal pour vos déplacements dans l'Oise et depuis l'aéroport de Beauvais-Tillé.
                </p>
                <button
                    onClick={handleScrollDown}
                    className="bg-brand-red text-white font-bold py-3 px-8 rounded-sm hover:bg-white hover:text-brand-black transition-all duration-300 text-lg transform hover:scale-105 animate-pulse-glow-red"
                >
                    Voir les véhicules
                </button>
            </div>
        </section>
    );
};

export default Hero;