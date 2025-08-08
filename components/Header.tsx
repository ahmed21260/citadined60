
import React, { useState, useEffect } from 'react';
import UserIcon from './icons/UserIcon';
import { User } from '../types';

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick?: () => void }> = ({ href, children, onClick }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        if (onClick) onClick();
    };

    return (
        <a href={href} onClick={handleClick} className="text-white hover:text-brand-red transition-colors duration-300 py-2">
            {children}
        </a>
    );
};

interface HeaderProps {
    onAccountClick: () => void;
    currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ onAccountClick, currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '#vehicles', label: 'Véhicules' },
        { href: '#about', label: 'À Propos' },
        { href: '#services', label: 'Services' },
        { href: '#testimonials', label: 'Avis' },
        { href: '#faq', label: 'FAQ' },
        { href: '#contact', label: 'Contact' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-brand-black/90 backdrop-blur-sm' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="#" className="flex items-center space-x-4">
                        <img src="https://i.postimg.cc/gJkzbYTX/Design-sans-titre-7.png" alt="CITADINE D'60 Logo" className="h-12 w-auto" />
                        <span className="hidden sm:inline font-display text-3xl font-extrabold text-white">CITADINE <span className="text-brand-red">D'60</span></span>
                    </a>
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <a href="#vehicles" onClick={(e) => { e.preventDefault(); document.querySelector('#vehicles')?.scrollIntoView({ behavior: 'smooth' });}} className="hidden lg:inline-block bg-brand-red text-white font-bold py-2 px-6 rounded-sm hover:bg-white hover:text-brand-black transition-all duration-300 transform hover:scale-105">
                            Réserver
                        </a>
                         <button onClick={onAccountClick} className="hidden lg:inline-block text-white hover:text-brand-red transition-colors" aria-label={currentUser ? "Mon Compte" : "Mon Compte"}>
                            {currentUser ? (
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-6 h-6" />
                                    <span className="text-sm">Bonjour, {currentUser.firstName}</span>
                                </div>
                            ) : (
                                <UserIcon className="w-6 h-6" />
                            )}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white z-50">
                            <div className="w-6 h-6 flex flex-col justify-around">
                                <span className={`block w-full h-0.5 bg-white transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
                                <span className={`block w-full h-0.5 bg-white transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-full h-0.5 bg-white transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-brand-black transition-transform duration-500 ease-out-expo transform ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                 <div className="flex flex-col items-center justify-center h-full pt-20">
                    <nav className="flex flex-col items-center justify-center space-y-8">
                        {navLinks.map(link => (
                            <NavLink key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                <span className="text-3xl font-display">{link.label}</span>
                            </NavLink>
                        ))}
                        <button
                            onClick={() => {
                                onAccountClick();
                                setIsOpen(false);
                            }}
                            className="text-white hover:text-brand-red transition-colors duration-300 py-2"
                        >
                            <span className="text-3xl font-display">{currentUser ? 'Mon Compte' : 'Connexion'}</span>
                        </button>
                    </nav>
                    <a href="#vehicles" onClick={(e) => { e.preventDefault(); document.querySelector('#vehicles')?.scrollIntoView({ behavior: 'smooth' }); setIsOpen(false);}} className="mt-8 bg-brand-red text-white font-bold py-3 px-8 rounded-sm hover:bg-white hover:text-brand-black transition-all duration-300">
                        Réserver un véhicule
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
