import React, { useState } from 'react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState<{status: 'idle' | 'success' | 'error', message: string}>({ status: 'idle', message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setFormStatus({ status: 'error', message: 'Veuillez remplir tous les champs.' });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setFormStatus({ status: 'error', message: 'Veuillez entrer une adresse email valide.' });
            return;
        }

        setIsSubmitting(true);
        setFormStatus({ status: 'idle', message: '' });
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setFormStatus({ status: 'success', message: 'Votre message a bien été envoyé ! Nous vous répondrons bientôt.' });
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setFormStatus({ status: 'idle', message: '' }), 5000); // Reset status after 5s
        }, 1500);
    };

    return (
        <section id="contact" className="bg-brand-black py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Contact & <span className="text-brand-red">Localisation</span></h2>
                    <p className="text-lg text-brand-gray mt-4 max-w-2xl mx-auto">Contactez-nous pour toute question sur votre future location de voiture à Beauvais.</p>
                    <div className="h-1 w-20 bg-brand-red mx-auto mt-6"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
                    {/* Contact Form */}
                    <div className="lg:w-1/2">
                        <h3 className="text-2xl font-display text-white mb-6">Envoyez-nous un message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="sr-only">Nom</label>
                                <input type="text" id="name" placeholder="Votre Nom" value={formData.name} onChange={handleChange} required className="w-full bg-white/5 border-white/20 border rounded-sm p-3 text-white focus:ring-brand-red focus:border-brand-red transition" />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input type="email" id="email" placeholder="Votre Email" value={formData.email} onChange={handleChange} required className="w-full bg-white/5 border-white/20 border rounded-sm p-3 text-white focus:ring-brand-red focus:border-brand-red transition" />
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea id="message" rows={5} placeholder="Votre Message" value={formData.message} onChange={handleChange} required className="w-full bg-white/5 border-white/20 border rounded-sm p-3 text-white focus:ring-brand-red focus:border-brand-red transition"></textarea>
                            </div>
                             <div className="h-10">
                                {formStatus.status === 'success' && <p className="text-green-500 text-center">{formStatus.message}</p>}
                                {formStatus.status === 'error' && <p className="text-red-500 text-center">{formStatus.message}</p>}
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-red text-white font-bold py-3 rounded-sm hover:bg-white hover:text-brand-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : "Envoyer le message"}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="lg:w-1/2">
                         <h3 className="text-2xl font-display text-white mb-6">Nos Coordonnées</h3>
                        <div className="space-y-4 text-brand-gray">
                            <p><strong>Adresse :</strong> 4 Rue Jean Rebour, 60000 Beauvais, France</p>
                            <p><strong>Téléphone :</strong> <a href="tel:+33759511443" className="text-white hover:text-brand-red transition-colors">+33 7 59 51 14 43</a></p>
                            <p><strong>Email :</strong> <a href="mailto:contact@citadined60.com" className="text-white hover:text-brand-red transition-colors">contact@citadined60.com</a></p>
                            <p className="pt-2 italic">Notre agence de Beauvais est idéalement située pour servir toute la ville et l'aéroport de Beauvais-Tillé.</p>
                        </div>
                        <div className="mt-8 h-64 bg-white/5 rounded-lg flex items-center justify-center text-brand-gray overflow-hidden">
                           <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2602.66874279095!2d2.083759876935265!3d49.43419996025686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e70417b7ff3b93%3A0x5a23a3e6f966c882!2s4%20Rue%20Jean%20Rebour%2C%2060000%20Beauvais%2C%20France!5e0!3m2!1sfr!2sfr!4v1689874561234"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Emplacement de CITADINE D'60"
                           ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;