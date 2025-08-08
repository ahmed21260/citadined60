import React, { useState } from 'react';
import { User } from '../types';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedUser: User) => void;
    user: User;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ isOpen, onClose, onUpdate, user }) => {
    const [phone, setPhone] = useState(user.phone || '');
    const [address, setAddress] = useState(user.address || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!phone.trim() || !address.trim()) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        
        try {
            const updatedUser = { ...user, phone, address };
            onUpdate(updatedUser);
            // The modal will be closed by the parent component after update logic
        } catch (err) {
            setError("Une erreur est survenue lors de la mise à jour.");
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={handleBackdropClick}
            className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className={`bg-brand-black text-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 mx-4 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-brand-red hover:text-white transition-colors" aria-label="Fermer la modale">
                    &times;
                </button>
                <div className="p-8">
                    <h3 className="text-2xl text-center font-display mb-2 text-white uppercase">Finaliser votre <span className="text-brand-red">Profil</span></h3>
                    <p className="text-center text-brand-gray mb-6 text-sm">Veuillez compléter vos informations pour pouvoir réserver.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="profilePhone" className="block text-sm font-medium text-brand-gray mb-2">Téléphone</label>
                            <input
                                id="profilePhone"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                type="tel"
                                placeholder="Votre numéro de téléphone"
                                required
                                className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red"
                            />
                        </div>
                        <div>
                            <label htmlFor="profileAddress" className="block text-sm font-medium text-brand-gray mb-2">Adresse Postale Complète</label>
                            <input
                                id="profileAddress"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                type="text"
                                placeholder="Votre adresse complète"
                                required
                                className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red"
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-red text-white font-bold py-3 rounded-md hover:bg-white hover:text-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? 'Enregistrement...' : "Enregistrer et continuer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;