import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Car, User, LegalPage, BookingDetails, Booking } from '../types';
import CameraIcon from './icons/CameraIcon';
import UploadIcon from './icons/UploadIcon';
import BookingContract from './BookingContract';
import PaymentForm from './PaymentForm';
import { STRIPE_PUBLISHABLE_KEY } from '../config';
import { createPaymentIntent, createBookingWithDocuments } from '../services/firebaseService';

interface BookingFlowProps {
    car: Car;
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onOpenLegalPage: (page: LegalPage) => void;
    initialDetails?: BookingDetails | null;
}

type DocumentKeys = 'licenseFront' | 'licenseBack' | 'proofOfAddress' | 'identity';

const DELIVERY_FEE = 30;
const DOWN_PAYMENT_AMOUNT = 50; // Acompte de 50€

// To enable Apple Pay and Google Pay, ensure you have:
// 1. Enabled them in your Stripe Dashboard under Settings > Payment Methods.
// 2. Verified your domain with Apple through the Stripe Dashboard for Apple Pay.
// The Payment Element will automatically display these options if they are available to the user.
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const BookingFlow: React.FC<BookingFlowProps> = ({ car, isOpen, onClose, user, onOpenLegalPage, initialDetails }) => {
    const [step, setStep] = useState(1);
    const [isExiting, setIsExiting] = useState(false);
    
    // Step 1 State
    const [startDate, setStartDate] = useState(initialDetails?.startDate || '');
    const [endDate, setEndDate] = useState(initialDetails?.endDate || '');
    const [durationInDays, setDurationInDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [includedKm, setIncludedKm] = useState(0);
    const [isDelivery, setIsDelivery] = useState(initialDetails?.isDelivery || false);
    const [deliveryAddress, setDeliveryAddress] = useState(initialDetails?.deliveryAddress || '');
    
    // Step 2 State
    const [documents, setDocuments] = useState<{[key in DocumentKeys]?: File}>({});
    const fileInputRefs: {[key in DocumentKeys]: React.RefObject<HTMLInputElement>} = {
        licenseFront: useRef<HTMLInputElement>(null),
        licenseBack: useRef<HTMLInputElement>(null),
        proofOfAddress: useRef<HTMLInputElement>(null),
        identity: useRef<HTMLInputElement>(null),
    };
    
    // Step 3 State
    const [paymentOption, setPaymentOption] = useState<'full' | 'down_payment'>('full');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
    const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    
    // General State
    const [isContractVisible, setIsContractVisible] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    
    const allDocumentsUploaded = Object.keys(documents).length === 4;

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
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
                let km = 0;
                let remainingDays = diffDays;
                
                const months = Math.floor(remainingDays / 30);
                if(months > 0) {
                    total += months * car.pricing.month.price;
                    km += months * car.pricing.month.km;
                    remainingDays %= 30;
                }
                const weeks = Math.floor(remainingDays / 7);
                if(weeks > 0) {
                    total += weeks * car.pricing.week.price;
                    km += weeks * car.pricing.week.km;
                    remainingDays %= 7;
                }
                total += remainingDays * car.pricing.day.price;
                km += remainingDays * car.pricing.day.km;

                setTotalPrice(isDelivery ? total + DELIVERY_FEE : total);
                setIncludedKm(km);
            } else {
                setDurationInDays(0);
                setTotalPrice(isDelivery ? DELIVERY_FEE : 0);
                setIncludedKm(0);
            }
        }
    }, [startDate, endDate, car, isDelivery]);

    const handleNextStep = async () => {
        setFormError(null);
        if (step === 1 && durationInDays <= 0) {
            setFormError("Veuillez sélectionner une plage de dates valide.");
            return;
        }
        if (step === 2 && !allDocumentsUploaded) {
            setFormError("Veuillez téléverser les 4 documents requis.");
            return;
        }

        if (step === 2) { // Moving to payment step
            setIsProcessingPayment(true);
            setFormError(null);
            const amountToPay = paymentOption === 'full' ? totalPrice : DOWN_PAYMENT_AMOUNT;
            const intent = await createPaymentIntent(amountToPay, user);
            
            if (intent && intent.clientSecret) {
                setClientSecret(intent.clientSecret);
                setPaymentIntentId(intent.paymentIntentId);
                setStripeCustomerId(intent.customerId);
                setStep(3);
            } else {
                setFormError("Impossible d'initialiser le paiement. Veuillez réessayer.");
            }
            setIsProcessingPayment(false);
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => setStep(prev => prev - 1);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: DocumentKeys) => {
        if (e.target.files && e.target.files[0]) {
            setDocuments(prev => ({...prev, [key]: e.target.files![0]}));
        }
    };
    
    const triggerFileInput = (key: DocumentKeys) => fileInputRefs[key].current?.click();
    
    const handlePaymentSuccess = async (stripePaymentIntentId: string) => {
        setIsProcessingPayment(true);
        setFormError(null);

        if (!stripeCustomerId) {
            setFormError("ID client Stripe manquant. Impossible de finaliser la réservation.");
            setIsProcessingPayment(false);
            return;
        }
        
        const bookingData = {
            userId: user.uid,
            car,
            startDate,
            endDate,
            durationInDays,
            totalPrice,
            includedKm,
            delivery: {
                enabled: isDelivery,
                address: deliveryAddress,
                fee: isDelivery ? DELIVERY_FEE : 0,
            },
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address || '',
            },
            status: 'pending' as const,
            paymentOption,
            downPayment: paymentOption === 'down_payment' ? DOWN_PAYMENT_AMOUNT : undefined,
            stripePaymentIntentId,
            stripeCustomerId,
        };

        const { error } = await createBookingWithDocuments(bookingData, documents as Record<DocumentKeys, File>);
        setIsProcessingPayment(false);

        if (error) {
            setFormError(`Erreur lors de la création de la réservation: ${error.message}`);
        } else {
            setStep(4); // Go to confirmation step
        }
    };
    
    const renderStep = () => {
        switch (step) {
            case 1: // Dates & Options
                return (
                    <div>
                        <h3 className="text-2xl font-display mb-6 text-white uppercase">Dates & <span className="text-brand-red">Options</span></h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-brand-gray mb-2">Date de début</label>
                                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required className="w-full bg-white/5 border-white/20 border rounded-md p-2 text-white focus:ring-brand-red focus:border-brand-red" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-brand-gray mb-2">Date de fin</label>
                                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} required className="w-full bg-white/5 border-white/20 border rounded-md p-2 text-white focus:ring-brand-red focus:border-brand-red" />
                            </div>
                        </div>
                        <div className="bg-brand-black/50 p-4 rounded-md mb-6">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" checked={isDelivery} onChange={() => setIsDelivery(!isDelivery)} className="form-checkbox h-5 w-5 text-brand-red bg-white/10 border-white/20 rounded focus:ring-brand-red" />
                                <span className="ml-3 text-white">Ajouter la livraison (+{DELIVERY_FEE}€)</span>
                            </label>
                            {isDelivery && (
                                <div className="mt-4">
                                     <label htmlFor="deliveryAddress" className="block text-sm font-medium text-brand-gray mb-2">Adresse de livraison (50km max)</label>
                                     <input type="text" id="deliveryAddress" placeholder="1 Rue de la République, 60000 Beauvais" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} required className="w-full bg-white/5 border-white/20 border rounded-md p-2 text-white focus:ring-brand-red focus:border-brand-red" />
                                </div>
                            )}
                        </div>
                        <div className="border-t border-white/10 pt-4">
                            <h4 className="font-bold text-lg text-white mb-2">Récapitulatif</h4>
                             <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-brand-gray">Durée:</span> <span className="text-white">{durationInDays > 0 ? `${durationInDays} jour(s)` : '-'}</span></div>
                                <div className="flex justify-between"><span className="text-brand-gray">Kilométrage inclus:</span> <span className="text-white">{includedKm > 0 ? `${includedKm} km` : '-'}</span></div>
                                <div className="flex justify-between"><span className="text-brand-gray">Livraison:</span> <span className="text-white">{isDelivery ? `${DELIVERY_FEE}€` : 'Non'}</span></div>
                                <div className="flex justify-between items-baseline mt-4 border-t border-white/10 pt-2"><span className="text-brand-gray font-bold">Total estimé:</span> <span className="text-2xl font-bold text-brand-red">{totalPrice.toFixed(2)}€</span></div>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Documents
                const DocumentUpload = ({id, label}: {id: DocumentKeys, label: string}) => (
                    <div className={`bg-brand-black/50 p-4 rounded-md border ${documents[id] ? 'border-green-500/50' : 'border-transparent'}`}>
                        <input type="file" accept="image/*,application/pdf" ref={fileInputRefs[id]} onChange={(e) => handleFileChange(e, id)} className="hidden"/>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{label}</p>
                                <p className={`text-xs ${documents[id] ? 'text-green-400' : 'text-brand-gray'}`}>{documents[id]?.name || "Aucun fichier sélectionné"}</p>
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => triggerFileInput(id)} className="p-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors" aria-label={`Téléverser ${label}`}>
                                    <UploadIcon className="w-5 h-5 text-white"/>
                                </button>
                                <button type="button" onClick={() => { fileInputRefs[id].current!.setAttribute('capture', 'environment'); triggerFileInput(id); }} className="p-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors" aria-label={`Prendre une photo pour ${label}`}>
                                    <CameraIcon className="w-5 h-5 text-white"/>
                                </button>
                            </div>
                        </div>
                    </div>
                )
                return (
                    <div>
                        <h3 className="text-2xl font-display mb-6 text-white uppercase">Vos <span className="text-brand-red">Documents</span></h3>
                        <div className="space-y-4">
                            <DocumentUpload id="licenseFront" label="Permis de conduire (Recto)"/>
                            <DocumentUpload id="licenseBack" label="Permis de conduire (Verso)"/>
                            <DocumentUpload id="identity" label="Pièce d'identité"/>
                            <DocumentUpload id="proofOfAddress" label="Justificatif de domicile"/>
                        </div>
                        <p className="text-xs text-brand-gray mt-4 text-center">Formats acceptés : JPG, PNG, PDF. Vos documents sont sécurisés.</p>
                    </div>
                );
            case 3: // Summary & Payment
                const amountToPay = paymentOption === 'full' ? totalPrice : DOWN_PAYMENT_AMOUNT;
                
                if (!clientSecret) {
                    return (
                         <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-brand-red"></div>
                            <p className="mt-4 text-brand-gray">Initialisation du paiement...</p>
                        </div>
                    );
                }

                return (
                    <div>
                        <h3 className="text-2xl font-display mb-2 text-white uppercase">Récapitulatif & <span className="text-brand-red">Paiement</span></h3>
                        <div className="space-y-3 text-sm bg-brand-black/50 p-4 rounded-md mb-4">
                             <div className="flex justify-between font-bold text-lg border-b border-white/10 pb-2 mb-2"><span className="text-white">{car.name}</span> <span className="text-brand-red">{totalPrice.toFixed(2)}€</span></div>
                            <div className="flex justify-between"><span className="text-brand-gray">Dates:</span> <span className="text-white">{new Date(startDate).toLocaleDateString()} au {new Date(endDate).toLocaleDateString()}</span></div>
                            <div className="flex justify-between"><span className="text-brand-gray">Client:</span> <span className="text-white">{user.firstName} {user.lastName}</span></div>
                        </div>
                        
                        <h4 className="font-bold text-white mb-3">Options de paiement</h4>
                         <div className="grid grid-cols-2 gap-2 mb-4">
                            <button type="button" onClick={() => setPaymentOption('full')} className={`p-3 text-center rounded-md border text-sm transition-colors ${paymentOption === 'full' ? 'bg-brand-red border-brand-red' : 'border-white/20 hover:bg-white/10'}`}>Payer {totalPrice.toFixed(2)}€ (Total)</button>
                            <button type="button" onClick={() => setPaymentOption('down_payment')} className={`p-3 text-center rounded-md border text-sm transition-colors ${paymentOption === 'down_payment' ? 'bg-brand-red border-brand-red' : 'border-white/20 hover:bg-white/10'}`}>Payer {DOWN_PAYMENT_AMOUNT}€ (Acompte)</button>
                        </div>
                        
                         <p className="text-xs text-brand-gray text-center mb-4 p-2 bg-yellow-500/10 rounded-md">
                            Une pré-autorisation de caution de <strong className="text-white">{car.deposit}€</strong> sera effectuée sur votre carte le jour de la location (non débitée).
                        </p>

                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', labels: 'floating' } }}>
                            <PaymentForm 
                                clientSecret={clientSecret} 
                                onPaymentSuccess={handlePaymentSuccess}
                                amount={amountToPay}
                                onProcessingChange={setIsProcessingPayment}
                            />
                        </Elements>
                    </div>
                );
            case 4: // Confirmation
                 return (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-2xl font-display mb-2 text-white uppercase">Demande de réservation reçue !</h3>
                        <p className="text-brand-gray mb-6">Merci {user.firstName} ! Votre demande pour la {car.name} a bien été enregistrée. Nous allons la vérifier et vous recevrez un email de confirmation très bientôt à <span className="text-white">{user.email}</span>.</p>
                        <button onClick={handleClose} className="w-full bg-brand-red text-white font-bold py-3 rounded-md hover:bg-white hover:text-brand-black transition-colors">
                            Terminer
                        </button>
                    </div>
                );
        }
    };

    const progressPercentage = useMemo(() => {
        if (step > 3) return 100;
        return (step - 1) / 2 * 100;
    }, [step]);
    
    if(!isOpen) return null;

    return (
        <div 
            onClick={handleClose}
            className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${!isExiting ? 'opacity-100' : 'opacity-0'}`}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`bg-brand-black text-white w-full max-w-2xl rounded-lg shadow-2xl transform transition-all duration-300 mx-4 ${!isExiting ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <div className="p-8 relative">
                    <button onClick={handleClose} className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-brand-red hover:text-white transition-colors" aria-label="Fermer">
                        &times;
                    </button>
                    
                     {step < 4 && (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-bold text-white">Étape {step} sur 3</p>
                                <p className="text-xs text-brand-gray">{['Dates & Options', 'Documents', 'Paiement & Validation'][step - 1]}</p>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5">
                                <div className="bg-brand-red h-1.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
                            </div>
                        </div>
                    )}

                    <div className="min-h-[450px]">
                        {renderStep()}
                    </div>

                    {formError && <p className="text-red-500 text-xs text-center mt-2">{formError}</p>}

                     {step < 3 && (
                        <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
                            <button type="button" onClick={handlePrevStep} disabled={step === 1 || isProcessingPayment} className="py-2 px-4 rounded-md text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Précédent</button>
                            <button type="button" onClick={handleNextStep} disabled={(step === 2 && !allDocumentsUploaded) || isProcessingPayment} className="bg-brand-red text-white font-bold py-2 px-6 rounded-md hover:bg-white hover:text-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-32">
                                {isProcessingPayment ? <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div> : 'Suivant'}
                            </button>
                        </div>
                    )}
                    {step === 3 && (
                         <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
                            <button type="button" onClick={handlePrevStep} disabled={isProcessingPayment} className="py-2 px-4 rounded-md text-white hover:bg-white/10 transition-colors disabled:opacity-50">Précédent</button>
                            {/* The submit button is now inside PaymentForm */}
                             <button type="button" onClick={() => setIsContractVisible(true)} className="text-center p-2 border border-white/20 rounded-md text-white text-sm hover:bg-white/10 transition-colors">
                                Consulter le contrat
                            </button>
                        </div>
                    )}
                </div>
            </div>
             {isContractVisible && (
                <BookingContract
                    car={car}
                    user={user}
                    startDate={startDate}
                    endDate={endDate}
                    durationInDays={durationInDays}
                    totalPrice={totalPrice}
                    includedKm={includedKm}
                    isDelivery={isDelivery}
                    deliveryAddress={deliveryAddress}
                    onClose={() => setIsContractVisible(false)}
                />
            )}
        </div>
    );
};

export default BookingFlow;