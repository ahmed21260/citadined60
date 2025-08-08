
import React, { useState } from 'react';
import { User, Booking, LegalPage } from '../types';
import UserIcon from './icons/UserIcon';
import CarIcon from './icons/CarIcon';
import LogoutIcon from './icons/LogoutIcon';
import InfoIcon from './icons/InfoIcon';
import BookingContract from './BookingContract';

interface UserDashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    bookings: Booking[];
    onLogout: () => void;
    onOpenLegalPage: (page: LegalPage) => void;
}

type ActiveTab = 'profile' | 'bookings' | 'info';

const UserDashboardModal: React.FC<UserDashboardModalProps> = ({ isOpen, onClose, user, bookings, onLogout, onOpenLegalPage }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [selectedBookingForContract, setSelectedBookingForContract] = useState<Booking | null>(null);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
            case 'confirmed': return 'border-green-500/50 bg-green-500/10 text-green-400';
            case 'rejected': return 'border-red-500/50 bg-red-500/10 text-red-400';
            case 'completed': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
            default: return 'border-gray-500/50 bg-gray-500/10 text-gray-400';
        }
    };
    
    if (!isOpen) return null;

    return (
        <>
            <div
                onClick={handleBackdropClick}
                className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className={`bg-brand-carbon text-white w-full max-w-4xl h-[90vh] rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 mx-4 flex flex-col md:flex-row ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <button onClick={onClose} className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-brand-red hover:text-white transition-colors" aria-label="Fermer la modale">
                        &times;
                    </button>
                    
                    {/* Sidebar */}
                    <nav className="w-full md:w-64 bg-brand-black/50 p-6 flex flex-col flex-shrink-0">
                        <h2 className="text-2xl font-display mb-8 text-white">Mon Espace</h2>
                        <div className="space-y-2 flex-grow">
                             <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === 'profile' ? 'bg-brand-red text-white' : 'hover:bg-white/10'}`}>
                                <UserIcon className="w-5 h-5" />
                                <span>Mon Profil</span>
                            </button>
                            <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === 'bookings' ? 'bg-brand-red text-white' : 'hover:bg-white/10'}`}>
                                <CarIcon className="w-5 h-5" />
                                <span>Mes Réservations</span>
                            </button>
                             <button onClick={() => setActiveTab('info')} className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${activeTab === 'info' ? 'bg-brand-red text-white' : 'hover:bg-white/10'}`}>
                                <InfoIcon className="w-5 h-5" />
                                <span>Infos Utiles</span>
                            </button>
                        </div>
                        <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-md text-left text-brand-gray hover:bg-red-800/50 hover:text-white transition-colors">
                            <LogoutIcon className="w-5 h-5" />
                            <span>Déconnexion</span>
                        </button>
                    </nav>

                    {/* Main Content */}
                    <main className="flex-1 p-8 overflow-y-auto">
                        {activeTab === 'profile' && (
                            <div className="animate-fade-in">
                                <h3 className="text-3xl font-display mb-6 text-white uppercase">Mon <span className="text-brand-red">Profil</span></h3>
                                <div className="bg-white/5 p-6 rounded-lg space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-brand-gray">Prénom</label>
                                            <p className="text-lg text-white">{user.firstName}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-brand-gray">Nom</label>
                                            <p className="text-lg text-white">{user.lastName}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-brand-gray">Email</label>
                                        <p className="text-lg text-white">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-brand-gray">Téléphone</label>
                                        <p className="text-lg text-white">{user.phone || "Non renseigné"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-brand-gray">Adresse</label>
                                        <p className="text-lg text-white">{user.address || "Non renseignée"}</p>
                                    </div>
                                </div>
                                <button className="mt-6 bg-brand-red text-white font-bold py-2 px-6 rounded-md hover:bg-white hover:text-brand-black transition-colors" onClick={() => alert("La modification du profil sera bientôt disponible.")}>
                                    Modifier mes informations
                                </button>
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="animate-fade-in">
                                <h3 className="text-3xl font-display mb-6 text-white uppercase">Mes <span className="text-brand-red">Réservations</span></h3>
                                {bookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {bookings.map(booking => (
                                            <div key={booking.id} className={`p-4 rounded-lg border flex flex-col sm:flex-row items-start gap-4 ${getStatusClass(booking.status)}`}>
                                                <img src={booking.car.image} alt={booking.car.name} className="w-full sm:w-32 h-24 object-cover rounded-md bg-brand-black" />
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-white text-lg">{booking.car.name}</h4>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusClass(booking.status)}`}>{booking.status}</span>
                                                    </div>
                                                    <p className="text-sm text-brand-gray">Du {new Date(booking.startDate).toLocaleDateString()} au {new Date(booking.endDate).toLocaleDateString()}</p>
                                                    <p className="font-bold text-white mt-1">{booking.totalPrice}€</p>
                                                </div>
                                                <div className="w-full sm:w-auto flex-shrink-0">
                                                    <button onClick={() => setSelectedBookingForContract(booking)} className="w-full sm:w-auto border border-white/20 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-white/10 transition-colors">
                                                        Voir le contrat
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white/5 rounded-lg">
                                        <p className="text-brand-gray">Vous n'avez aucune réservation pour le moment.</p>
                                        <a href="#vehicles" onClick={onClose} className="mt-4 inline-block bg-brand-red text-white font-bold py-2 px-6 rounded-md hover:bg-white hover:text-brand-black transition-colors">
                                            Louer un véhicule
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'info' && (
                             <div className="animate-fade-in">
                                <h3 className="text-3xl font-display mb-6 text-white uppercase">Informations <span className="text-brand-red">Utiles</span></h3>
                                <div className="space-y-6">

                                    <div className="bg-white/5 p-6 rounded-lg">
                                        <h4 className="font-bold text-lg text-white mb-4 text-center">Numéros d'urgence</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center"><p className="text-sm text-brand-gray">Police</p><p className="text-2xl font-bold text-white">17</p></div>
                                            <div className="text-center"><p className="text-sm text-brand-gray">Pompiers</p><p className="text-2xl font-bold text-white">18</p></div>
                                            <div className="text-center"><p className="text-sm text-brand-gray">SAMU</p><p className="text-2xl font-bold text-white">15</p></div>
                                            <div className="text-center"><p className="text-sm text-brand-gray">N° Européen</p><p className="text-2xl font-bold text-white">112</p></div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-6 rounded-lg">
                                        <h4 className="font-bold text-lg text-white mb-2">Assistance CITADINE D'60</h4>
                                        <p className="text-brand-gray mb-2">En cas de panne ou d'accident, contactez-nous immédiatement. Nous organiserons le dépannage et la suite des procédures.</p>
                                        <p className="text-lg font-bold text-white">📞 <a href="tel:+33759511443" className="hover:text-brand-red transition-colors">+33 7 59 51 14 43 (24/7)</a></p>
                                    </div>

                                    <div className="bg-white/5 p-6 rounded-lg">
                                        <h4 className="font-bold text-lg text-white mb-3">Conseils de conduite en France</h4>
                                        <ul className="list-disc list-inside space-y-2 text-brand-gray">
                                            <li><span className="font-semibold text-white">Limitations de vitesse :</span> Ville 50km/h, Route 80km/h, Voie rapide 110km/h, Autoroute 130km/h (110km/h si pluie).</li>
                                            <li><span className="font-semibold text-white">Priorité à droite :</span> Attention à cette règle fréquente en l'absence de signalisation contraire.</li>
                                            <li><span className="font-semibold text-white">Alcoolémie :</span> La limite légale est de 0,5g/L. Ne prenez pas le volant si vous avez bu.</li>
                                        </ul>
                                    </div>
                                    
                                     <div className="bg-white/5 p-6 rounded-lg">
                                        <h4 className="font-bold text-lg text-white mb-3">En cas de sinistre (accident, panne)</h4>
                                        <ol className="list-decimal list-inside space-y-2 text-brand-gray">
                                            <li><span className="font-semibold text-white">Sécurisez la zone</span> (gilet jaune, triangle de pré-signalisation).</li>
                                            <li>Si nécessaire, <span className="font-semibold text-white">appelez les secours</span> (15, 17, 18 ou 112).</li>
                                            <li>Remplissez un <span className="font-semibold text-white">constat amiable</span> avec le tiers impliqué, même pour des dégâts mineurs. Prenez des photos.</li>
                                            <li><span className="font-semibold text-white">Contactez notre assistance</span> pour nous déclarer le sinistre.</li>
                                        </ol>
                                    </div>

                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
            {selectedBookingForContract && (
                <BookingContract
                    car={selectedBookingForContract.car}
                    user={user}
                    startDate={selectedBookingForContract.startDate}
                    endDate={selectedBookingForContract.endDate}
                    durationInDays={selectedBookingForContract.durationInDays}
                    totalPrice={selectedBookingForContract.totalPrice}
                    includedKm={selectedBookingForContract.includedKm}
                    isDelivery={selectedBookingForContract.delivery.enabled}
                    deliveryAddress={selectedBookingForContract.delivery.address}
                    onClose={() => setSelectedBookingForContract(null)}
                />
            )}
        </>
    );
};

export default UserDashboardModal;