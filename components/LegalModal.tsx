
import React from 'react';
import { LegalPage } from '../types';
import LegalNotice from './LegalNotice';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

interface LegalModalProps {
    page: LegalPage;
    onClose: () => void;
}

const legalContent = {
    notice: {
        title: "Mentions Légales",
        Component: LegalNotice,
    },
    privacy: {
        title: "Politique de Confidentialité",
        Component: PrivacyPolicy,
    },
    tos: {
        title: "Conditions Générales de Vente",
        Component: TermsOfService,
    }
};

const LegalModal: React.FC<LegalModalProps> = ({ page, onClose }) => {
    const { title, Component } = legalContent[page];

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
            <div className="bg-brand-black text-white w-full max-w-3xl h-[90vh] rounded-lg shadow-2xl flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-2xl font-display text-white">{title}</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-brand-red transition-colors" aria-label="Fermer">
                        &times;
                    </button>
                </div>
                <div className="flex-grow p-8 overflow-y-auto">
                    <div className="prose prose-invert prose-p:text-brand-gray prose-headings:text-white prose-strong:text-white">
                        <Component />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
