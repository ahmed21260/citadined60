

import React, { useState, useEffect } from 'react';
import { Car, BookingDetails } from '../types';

const DELIVERY_FEE = 30;

type PricingFormula = 'day' | 'week' | 'month';

interface ImageLightboxProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full text-white text-2xl hover:bg-brand-red transition-colors"
                aria-label="Fermer l'aperçu"
            >
                &times;
            </button>
            <div className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
                <img
                    src={imageUrl}
                    alt="Aperçu en grand"
                    className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
                />
            </div>
        </div>
    );
};


interface VehicleDetailModalProps {
    car: Car;
    isOpen: boolean;
    onClose: () => void;
    onStartBooking: (car: Car, details: BookingDetails) => void;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ car, isOpen, onClose, onStartBooking }) => {
    const [activeImage, setActiveImage] = useState(car.gallery[0]);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const [selectedFormula, setSelectedFormula] = useState<PricingFormula | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isDelivery, setIsDelivery] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [durationInDays, setDurationInDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const handleFormulaSelect = (formula: PricingFormula) => {
        setSelectedFormula(formula);
        const start = new Date();
        const end = new Date();

        switch(formula) {
            case 'day':
                end.setDate(start.getDate() + 1);
                break;
            case 'week':
                end.setDate(start.getDate() + 7);
                break;
            case 'month':
                end.setMonth(start.getMonth() + 1);
                break;
        }
        setStartDate(formatDate(start));
        setEndDate(formatDate(end));
    };

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end > start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDurationInDays(diffDays);

                let total = 0;
                let remainingDays = diffDays;
                
                const months = Math.floor(remainingDays / 30);
                if(months > 0) {
                    total += months * car.pricing.month.price;
                    remainingDays %= 30;
                }
                const weeks = Math.floor(remainingDays / 7);
                if(weeks > 0) {
                    total += weeks * car.pricing.week.price;
                    remainingDays %= 7;
                }
                total += remainingDays * car.pricing.day.price;


                setTotalPrice(isDelivery ? total + DELIVERY_FEE : total);
                setError(null);
            } else {
                setDurationInDays(0);
                setTotalPrice(isDelivery ? DELIVERY_FEE : 0);
                if (startDate && endDate) {
                    setError('La date de fin doit être après la date de début.');
                }
            }
        } else {
            setDurationInDays(0);
            setTotalPrice(isDelivery ? DELIVERY_FEE : 0);
        }
    }, [startDate, endDate, car, isDelivery]);

    useEffect(() => {
        if (isOpen) {
            setActiveImage(car.gallery[0]);
            setStartDate('');
            setEndDate('');
            setIsDelivery(false);
            setDeliveryAddress('');
            setError(null);
            setSelectedFormula(null);
        }
    }, [isOpen, car]);


    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const handleBookingSubmit = () => {
        if (!startDate || !endDate) {
            setError('Veuillez sélectionner une date de début et de fin.');
            return;
        }
        if (durationInDays <= 0) {
            setError('Veuillez sélectionner une plage de dates valide.');
            return;
        }
        if (isDelivery && !deliveryAddress.trim()) {
            setError('Veuillez entrer une adresse de livraison.');
            return;
        }
        onStartBooking(car, { startDate, endDate, isDelivery, deliveryAddress });
    }
    
    return (
        <>
            <div 
                onClick={handleBackdropClick}
                className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className={`bg-brand-black text-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 flex flex-col lg:flex-row ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-brand-red hover:text-white transition-colors" aria-label="Fermer la modale">
                        &times;
                    </button>
                    
                    <div className="w-full lg:w-1/2 overflow-y-auto p-8">
                        <div 
                            onClick={() => setLightboxImage(activeImage)}
                            className="w-full h-64 rounded-md mb-4 flex items-center justify-center bg-black/20 overflow-hidden relative group cursor-zoom-in"
                            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05), transparent 80%), #0B0B0B' }}
                        >
                          <img src={activeImage} alt={car.name} className="w-full h-full object-contain drop-shadow-lg scale-125" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                              </svg>
                          </div>
                        </div>
                        {car.gallery.length > 1 && (
                            <div className="grid grid-cols-3 gap-2">
                                {car.gallery.map((img, index) => (
                                     <div 
                                        key={index}
                                        onClick={() => setActiveImage(img)}
                                        className={`w-full h-20 bg-black/20 rounded-md cursor-pointer transition-all flex items-center justify-center p-1 ${activeImage === img ? 'border-2 border-brand-red' : 'opacity-70 hover:opacity-100'}`}
                                     >
                                        <img
                                            src={img}
                                            alt={`${car.name} gallery image ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <h2 className="text-3xl font-display mt-6 mb-2 uppercase">{car.name}</h2>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mt-4 text-brand-gray">
                            <span><strong className="text-white block">{car.gearbox}</strong> Boîte</span>
                            <span><strong className="text-white block">{car.fuel}</strong> Carburant</span>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 bg-white/5 p-8 flex flex-col justify-center">
                         <div>
                            <h3 className="text-2xl font-display mb-4 text-white uppercase">Choisir une <span className="text-brand-red">Formule</span></h3>
                             <div className="grid grid-cols-3 gap-2 mb-4">
                                {(['day', 'week', 'month'] as const).map(f => (
                                    <button 
                                        key={f} 
                                        onClick={() => handleFormulaSelect(f)}
                                        className={`p-3 text-center rounded-md border text-xs transition-colors ${selectedFormula === f ? 'bg-brand-red border-brand-red' : 'border-white/20 hover:bg-white/10'}`}
                                    >
                                        <span className="font-bold text-white block uppercase">{f === 'day' ? 'Jour' : f === 'week' ? 'Semaine' : 'Mois'}</span>
                                        <span className="text-white/80">{car.pricing[f].price}€</span>
                                    </button>
                                ))}
                             </div>

                             <h3 className="text-xl font-display mt-6 mb-4 text-white uppercase">...ou vos <span className="text-brand-red">Dates</span></h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="startDateModal" className="block text-sm font-medium text-brand-gray mb-2">Début</label>
                                    <input type="date" id="startDateModal" value={startDate} onChange={e => {setStartDate(e.target.value); setSelectedFormula(null);}} min={new Date().toISOString().split('T')[0]} required className="w-full bg-white/5 border-white/20 border rounded-md p-2 text-white focus:ring-2 focus:ring-brand-red focus:border-brand-red" />
                                </div>
                                <div>
                                    <label htmlFor="endDateModal" className="block text-sm font-medium text-brand-gray mb-2">Fin</label>
                                    <input type="date" id="endDateModal" value={endDate} onChange={e => {setEndDate(e.target.value); setSelectedFormula(null);}} min={startDate || new Date().toISOString().split('T')[0]} required className="w-full bg-white/5 border-white/20 border rounded-md p-2 text-white focus:ring-2 focus:ring-brand-red focus:border-brand-red" />
                                </div>
                            </div>
                            <div className="bg-brand-black/50 p-4 rounded-md mb-4">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" checked={isDelivery} onChange={() => setIsDelivery(!isDelivery)} className="form-checkbox h-5 w-5 text-brand-red bg-white/10 border-white/20 rounded focus:ring-brand-red" />
                                    <span className="ml-3 text-white">Ajouter la livraison (+{DELIVERY_FEE}€)</span>
                                </label>
                                {isDelivery && (
                                    <div className="mt-4">
                                         <label htmlFor="deliveryAddressModal" className="block text-sm font-medium text-brand-gray mb-2">Adresse de livraison (50km max)</label>
                                         <input type="text" id="deliveryAddressModal" placeholder="1 Rue de la République, 60000 Beauvais" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} required className="w-full bg-white/5 border-white/20 border rounded-md p-2 text-white focus:ring-2 focus:ring-brand-red focus:border-brand-red" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="border-t border-white/10 pt-4 mt-4">
                                <div className="space-y-1 text-sm mb-4">
                                    <div className="flex justify-between"><span className="text-brand-gray">Durée:</span> <span className="text-white">{durationInDays > 0 ? `${durationInDays} jour(s)` : '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-brand-gray">Livraison:</span> <span className="text-white">{isDelivery ? `${DELIVERY_FEE}€` : 'Non'}</span></div>
                                </div>
                                <div className="flex justify-between items-baseline mt-4 border-t border-white/10 pt-4">
                                    <span className="text-white font-bold text-lg">Total estimé:</span> 
                                    <span className="text-3xl font-bold text-brand-red">{totalPrice > 0 ? `${totalPrice}€` : '-'}</span>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                 {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
                                <button onClick={handleBookingSubmit} className="w-full bg-brand-red text-white font-bold py-4 rounded-md hover:bg-white hover:text-brand-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-brand-red/40">
                                    Continuer la réservation
                                </button>
                                 <p className="text-xs text-brand-gray mt-2 text-center">Vous serez invité à vous connecter ou créer un compte.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {lightboxImage && (
                <ImageLightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
            )}
        </>
    );
};

export default VehicleDetailModal;