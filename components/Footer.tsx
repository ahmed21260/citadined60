import React from 'react';
import { LegalPage, User } from '../types';

const FooterNavLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <a href={href} onClick={handleClick} className="relative text-brand-gray hover:text-white transition-colors duration-300 group">
            {children}
            <span className="absolute bottom-0 left-0 h-0.5 bg-brand-red w-full transition-transform duration-300 origin-left transform scale-x-0 group-hover:scale-x-100"></span>
        </a>
    );
};

interface FooterProps {
    onLegalLinkClick: (page: LegalPage) => void;
    currentUser: User | null;
    onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLegalLinkClick, currentUser, onAdminClick }) => {
    
    const handleBookClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.querySelector('#vehicles')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <section className="relative bg-cover bg-center py-20" style={{ backgroundImage: "url('https://i.postimg.cc/RFXB52Jj/t-l-charger.jpg')" }}>
                <div className="absolute inset-0 bg-brand-black/80"></div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Prêt à prendre la <span className="text-brand-red">route ?</span></h2>
                    <p className="text-lg text-brand-gray mt-4 max-w-2xl mx-auto">Votre prochaine aventure commence ici. Réservez votre voiture dès maintenant.</p>
                    <button
                        onClick={handleBookClick}
                        className="mt-8 bg-brand-red text-white font-bold py-3 px-8 rounded-sm hover:bg-white hover:text-brand-black transition-all duration-300 text-lg transform hover:scale-105 animate-pulse-glow-red"
                    >
                        Réserver mon véhicule
                    </button>
                </div>
            </section>
            
            <footer className="relative bg-brand-carbon text-white overflow-hidden">
                 <div 
                    className="absolute inset-0 opacity-20 animate-aurora"
                    style={{
                        backgroundImage: 'radial-gradient(at 27% 37%, hsla(21, 98%, 45%, 1) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(11, 97%, 52%, 1) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(355, 96%, 53%, 1) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 53%, 1) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 1) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 73%, 1) 0px, transparent 50%)',
                        backgroundSize: '200% 200%',
                    }}
                ></div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="md:col-span-2">
                             <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center space-x-2 mb-4 group w-fit">
                                <img src="https://i.postimg.cc/gJkzbYTX/Design-sans-titre-7.png" alt="CITADINE D'60 Logo" className="h-12 w-auto transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-display text-2xl font-extrabold text-white">CITADINE <span className="text-brand-red">D'60</span></span>
                            </a>
                            <p className="text-brand-gray max-w-md">
                               Votre spécialiste de la location de voitures citadines à Beauvais et dans l'Oise (60). Service simple, rapide et économique, avec livraison disponible à l'aéroport de Beauvais-Tillé.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold uppercase tracking-wider mb-4">Navigation</h3>
                            <nav className="flex flex-col space-y-3">
                                <FooterNavLink href="#vehicles">Véhicules</FooterNavLink>
                                <FooterNavLink href="#services">Services</FooterNavLink>
                                <FooterNavLink href="#about">À Propos</FooterNavLink>
                                <FooterNavLink href="#faq">FAQ</FooterNavLink>
                                <FooterNavLink href="#contact">Contact</FooterNavLink>
                            </nav>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-bold uppercase tracking-wider mb-4">Suivez-nous</h3>
                             <div className="flex space-x-4">
                                <a href="#" aria-label="Instagram" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-brand-gray hover:text-white hover:bg-brand-red transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-brand-red/40">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.442c-3.142 0-3.504.012-4.73.068-2.694.123-3.999 1.433-4.122 4.122-.056 1.226-.067 1.586-.067 4.73s.011 3.504.067 4.73c.123 2.689 1.428 3.999 4.122 4.122 1.226.056 1.588.067 4.73.067s3.504-.011 4.73-.067c2.694-.123 3.999-1.433 4.122-4.122.056-1.226.067-1.586.067-4.73s-.011-3.504-.067-4.73c-.123-2.689-1.428-3.999-4.122-4.122-1.226-.056-1.588-.067-4.73-.067zM12 7.29a4.71 4.71 0 100 9.42 4.71 4.71 0 000-9.42zm0 7.978a3.27 3.27 0 110-6.54 3.27 3.27 0 010 6.54zm5.83-8.87a1.15 1.15 0 100-2.3 1.15 1.15 0 000 2.3z"></path></svg>
                                </a>
                                 <a href="#" aria-label="Facebook" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-brand-gray hover:text-white hover:bg-brand-red transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-brand-red/40">
                                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10 text-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <p className="text-brand-gray mb-4 sm:mb-0">&copy; {new Date().getFullYear()} CITADINE D'60. Tous droits réservés.</p>
                             <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                                <button onClick={() => onLegalLinkClick('notice')} className="text-brand-gray hover:text-white transition-colors duration-300">Mentions Légales</button>
                                <button onClick={() => onLegalLinkClick('privacy')} className="text-brand-gray hover:text-white transition-colors duration-300">Confidentialité</button>
                                <button onClick={() => onLegalLinkClick('tos')} className="text-brand-gray hover:text-white transition-colors duration-300">CGV</button>
                                {currentUser?.isAdmin && (
                                     <button onClick={onAdminClick} className="text-brand-gold hover:text-white transition-colors duration-300">Admin</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;