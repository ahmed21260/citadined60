import React, { useState } from 'react';
import { Booking, AIVerificationResult } from '../types';
import DocumentTextIcon from './icons/DocumentTextIcon';
import SparklesIcon from './icons/SparklesIcon';
import { verifyDocumentsWithAI } from '../services/geminiService';

interface AdminBookingDetailModalProps {
    booking: Booking;
    onClose: () => void;
    onUpdateStatus: (bookingId: string, status: 'confirmed' | 'rejected' | 'completed') => void;
}

const AdminBookingDetailModal: React.FC<AdminBookingDetailModalProps> = ({ booking, onClose, onUpdateStatus }) => {
    
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<AIVerificationResult | null>(null);
    const [verificationError, setVerificationError] = useState<string | null>(null);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const handleAIVerify = async () => {
        setIsVerifying(true);
        setVerificationResult(null);
        setVerificationError(null);
        const result = await verifyDocumentsWithAI(booking);
        if (result) {
            setVerificationResult(result);
        } else {
            setVerificationError("L'assistant IA n'a pas pu vérifier les documents.");
        }
        setIsVerifying(false);
    };

    const VerificationStatusIcon: React.FC<{match: boolean}> = ({ match }) => (
         match ? 
            <span className="text-green-500">✓ Correspond</span> : 
            <span className="text-yellow-500">✗ Discrepance</span>
    );

    const amountPaid = booking.paymentOption === 'down_payment' ? booking.downPayment : booking.totalPrice;

    return (
        <div 
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
            <div className="bg-brand-carbon text-white w-full max-w-3xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
                <header className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-2xl font-display text-white">Détails Réservation #{booking.id.substring(0, 7)}</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-brand-red transition-colors" aria-label="Fermer">
                        &times;
                    </button>
                </header>

                <main className="flex-grow p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div>
                            <h3 className="font-bold text-lg text-brand-red mb-3">Informations Client</h3>
                            <div className="space-y-1 text-sm">
                                <p><strong>Nom:</strong> {booking.user.firstName} {booking.user.lastName}</p>
                                <p><strong>Email:</strong> {booking.user.email}</p>
                                <p><strong>Téléphone:</strong> {booking.user.phone}</p>
                                <p><strong>Adresse:</strong> {booking.user.address}</p>
                            </div>

                            <h3 className="font-bold text-lg text-brand-red mt-6 mb-3">Détails Location</h3>
                             <div className="space-y-1 text-sm">
                                <p><strong>Véhicule:</strong> {booking.car.name}</p>
                                <p><strong>Début:</strong> {new Date(booking.startDate).toLocaleString('fr-FR')}</p>
                                <p><strong>Fin:</strong> {new Date(booking.endDate).toLocaleString('fr-FR')}</p>
                                <p><strong>Durée:</strong> {booking.durationInDays} jours</p>
                                 {booking.delivery.enabled && <p><strong>Livraison:</strong> {booking.delivery.address}</p>}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <h3 className="font-bold text-lg text-brand-red mb-3">Documents & Vérification</h3>
                             <div className="grid grid-cols-2 gap-3 mb-4">
                                {Object.entries(booking.documents).map(([key, url]) => (
                                    <a href={url} target="_blank" rel="noopener noreferrer" key={key} className="bg-white/5 p-3 rounded-md flex items-center gap-3 hover:bg-white/10 transition-colors">
                                        <DocumentTextIcon className="w-6 h-6 text-brand-gray flex-shrink-0" />
                                        <span className="text-sm truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </a>
                                ))}
                            </div>
                            
                            <button onClick={handleAIVerify} disabled={isVerifying} className="w-full flex items-center justify-center gap-2 bg-brand-gold/10 border border-brand-gold/50 text-brand-gold font-semibold py-2 rounded-md hover:bg-brand-gold/20 disabled:opacity-50 transition-colors">
                                {isVerifying ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span>Vérification...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5"/>
                                        <span>Vérifier avec l'IA</span>
                                    </>
                                )}
                            </button>
                             {verificationError && <p className="text-red-500 text-xs text-center mt-2">{verificationError}</p>}
                             {verificationResult && (
                                <div className="mt-4 bg-white/5 p-4 rounded-lg space-y-2 text-sm animate-fade-in">
                                    <p><strong>Nom:</strong> <VerificationStatusIcon match={verificationResult.nameMatch} /></p>
                                    <p><strong>Adresse:</strong> <VerificationStatusIcon match={verificationResult.addressMatch} /></p>
                                    <p className="pt-2 border-t border-white/10 mt-2"><strong>Résumé IA:</strong> <em className="text-brand-gray">{verificationResult.summary}</em></p>
                                </div>
                             )}

                             <h3 className="font-bold text-lg text-brand-red mt-6 mb-3">Financier</h3>
                              <div className="space-y-1 text-sm">
                                <p><strong>Prix Total:</strong> {booking.totalPrice.toFixed(2)}€</p>
                                <p><strong>Dépôt de garantie:</strong> {booking.car.deposit.toFixed(2)}€</p>
                                <p><strong>Option de paiement:</strong> <span className="capitalize font-semibold">{booking.paymentOption === 'down_payment' ? `Acompte (${booking.downPayment}€)` : 'Total'}</span></p>
                                <p><strong>Montant payé:</strong> <span className="font-bold">{amountPaid?.toFixed(2)}€</span></p>
                                <p><strong>Statut:</strong> <span className="font-bold">{booking.status}</span></p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-4">
                    {booking.status === 'pending' && (
                        <>
                            <button onClick={() => onUpdateStatus(booking.id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Rejeter</button>
                            <button onClick={() => onUpdateStatus(booking.id, 'confirmed')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Valider la réservation</button>
                        </>
                    )}
                     {booking.status === 'confirmed' && (
                        <button onClick={() => onUpdateStatus(booking.id, 'completed')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Marquer comme Terminée</button>
                    )}
                    <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Fermer</button>
                </footer>
            </div>
        </div>
    );
};

export default AdminBookingDetailModal;