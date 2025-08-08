
import React, { useState } from 'react';
import { faqItems } from '../constants';
import { FaqItem } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';


const FaqAccordionItem: React.FC<{ item: FaqItem, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-white/10">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-6"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-medium text-white">{item.question}</span>
                <ChevronDownIcon className={`w-6 h-6 text-brand-red transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                     <p className="pb-6 text-brand-gray pr-6">{item.answer}</p>
                </div>
            </div>
        </div>
    );
};

const Faq: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="bg-white/5 py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Questions fréquentes</h2>
                     <p className="text-lg text-brand-gray mt-4 max-w-2xl mx-auto">Trouvez ici les réponses à vos questions sur la location de voiture chez CITADINE D'60.</p>
                    <div className="h-1 w-20 bg-brand-red mx-auto mt-6"></div>
                </div>
                <div className="max-w-3xl mx-auto">
                    {faqItems.map((item, index) => (
                        <FaqAccordionItem 
                            key={index} 
                            item={item} 
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;