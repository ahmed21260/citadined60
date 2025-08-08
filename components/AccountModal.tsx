import React, { useState } from 'react';
import GoogleIcon from './icons/GoogleIcon';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../services/firebaseService';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Adresse e-mail invalide.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Email ou mot de passe incorrect.';
        case 'auth/email-already-in-use':
            return 'Cette adresse e-mail est déjà utilisée.';
        case 'auth/weak-password':
            return 'Le mot de passe doit contenir au moins 6 caractères.';
        case 'auth/popup-closed-by-user':
            return 'La fenêtre de connexion a été fermée.';
        case 'auth/unauthorized-domain':
             return "Erreur d'authentification : ce domaine n'est pas autorisé. Veuillez contacter le support.";
        default:
            return 'Une erreur est survenue. Veuillez réessayer.';
    }
};

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        setError(null);
        const { error } = await signInWithGoogle();
        setIsSubmitting(false);
        if (error) {
            setError(getFirebaseErrorMessage(error.code));
        } else {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        let result;
        if (authMode === 'signup') {
            result = await signUpWithEmail(email, password, firstName, lastName, phone);
        } else {
            result = await signInWithEmail(email, password);
        }

        setIsSubmitting(false);
        if (result.error) {
            setError(getFirebaseErrorMessage(result.error.code));
        } else {
            onClose();
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
                     <h3 className="text-2xl text-center font-display mb-6 text-white uppercase">Mon <span className="text-brand-red">Compte</span></h3>
                     <div className="flex border-b border-white/10 mb-6">
                        <button onClick={() => { setAuthMode('signup'); setError(null); }} className={`flex-1 py-2 px-4 transition-colors text-center ${authMode === 'signup' ? 'text-white border-b-2 border-brand-red' : 'text-brand-gray'}`}>Créer un compte</button>
                        <button onClick={() => { setAuthMode('login'); setError(null); }} className={`flex-1 py-2 px-4 transition-colors text-center ${authMode === 'login' ? 'text-white border-b-2 border-brand-red' : 'text-brand-gray'}`}>Se connecter</button>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Chargement...
                            </>
                        ) : (
                            <>
                                <GoogleIcon className="w-6 h-6" />
                                Continuer avec Google
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-white/20"></div>
                        <span className="flex-shrink mx-4 text-brand-gray text-sm">OU</span>
                        <div className="flex-grow border-t border-white/20"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {authMode === 'signup' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <input value={firstName} onChange={e => setFirstName(e.target.value)} name="firstName" placeholder="Prénom" required className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red" />
                                    <input value={lastName} onChange={e => setLastName(e.target.value)} name="lastName" placeholder="Nom" required className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red" />
                                </div>
                                <input value={email} onChange={e => setEmail(e.target.value)} name="email" type="email" placeholder="Email" required className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red" />
                                <input value={phone} onChange={e => setPhone(e.target.value)} name="phone" type="tel" placeholder="Téléphone" required className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red" />
                                <input value={password} onChange={e => setPassword(e.target.value)} name="password" type="password" placeholder="Mot de passe (6+ caractères)" required className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red" />
                            </>
                        )}
                         {authMode === 'login' && (
                             <>
                                <input value={email} onChange={e => setEmail(e.target.value)} name="email" type="email" placeholder="Email" required className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red" />
                                <input value={password} onChange={e => setPassword(e.target.value)} name="password" type="password" placeholder="Mot de passe" required className="w-full bg-white/5 border-white/20 border rounded-md p-3 text-white focus:ring-brand-red focus:border-brand-red" />
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => alert('Cette fonctionnalité sera bientôt disponible.')}
                                        className="text-sm text-brand-gray hover:text-white transition-colors"
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                        <div className="pt-2">
                             <button type="submit" disabled={isSubmitting} className="w-full bg-brand-red text-white font-bold py-3 rounded-md hover:bg-white hover:text-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Chargement...
                                    </>
                                ) : (authMode === 'login' ? 'Se connecter' : "Créer le compte")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountModal;