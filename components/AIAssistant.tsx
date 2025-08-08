import React, { useState } from 'react';
import { Car } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import { getCarSuggestion } from '../services/geminiService';

interface AIAssistantProps {
    vehicles: Car[];
    onSelectCar: (car: Car) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ vehicles, onSelectCar }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ carName: string; justification: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setResult(null);
        setError(null);

        const aiResult = await getCarSuggestion(prompt, vehicles);

        if (aiResult) {
            setResult(aiResult);
        } else {
            setError("L'assistant IA n'a pas pu trouver de suggestion. Veuillez réessayer.");
        }
        setIsLoading(false);
    };
    
    const suggestedCar = result ? vehicles.find(v => v.name === result.carName) : null;

    return (
        <section className="bg-white/5 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-display font-bold text-white flex items-center justify-center gap-4">
                        <SparklesIcon className="w-8 h-8 text-brand-gold"/>
                        Assistant de Location IA
                    </h2>
                    <p className="text-lg text-brand-gray mt-4">Décrivez votre besoin, et nous vous suggérons le véhicule parfait.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: 4 personnes, 3 valises, pour un week-end"
                        className="flex-grow bg-brand-carbon border-white/20 border rounded-sm p-3 text-white focus:ring-brand-gold focus:border-brand-gold transition placeholder:text-brand-gray"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-brand-gold text-brand-black font-bold py-3 px-6 rounded-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyse...
                            </>
                        ) : "Trouver mon véhicule"}
                    </button>
                </form>

                {error && <p className="text-center text-red-500">{error}</p>}
                
                {result && suggestedCar && (
                    <div className="bg-brand-carbon border border-brand-gold/50 rounded-lg p-6 animate-fade-in">
                        <p className="text-center text-brand-gray mb-4 italic">"{result.justification}"</p>
                        <div 
                            className="group bg-brand-black/50 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
                            onClick={() => onSelectCar(suggestedCar)}
                        >
                            <div className="flex items-center p-4">
                                <img src={suggestedCar.image} alt={suggestedCar.name} className="w-32 h-20 object-contain rounded-md bg-black/20" />
                                <div className="ml-4 flex-grow">
                                    <h4 className="font-display text-xl text-white">{suggestedCar.name}</h4>
                                    <p className="text-sm text-brand-gray">{suggestedCar.brand}</p>
                                </div>
                                 <button className="bg-transparent border border-brand-gold text-brand-gold py-2 px-4 rounded-sm text-sm font-semibold group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-300">
                                    Réserver
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AIAssistant;