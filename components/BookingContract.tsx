import React from 'react';
import { User, Car } from '../types';

interface BookingContractProps {
    car: Car;
    user: User;
    startDate: string;
    endDate: string;
    durationInDays: number;
    totalPrice: number;
    includedKm: number;
    isDelivery: boolean;
    deliveryAddress: string;
    onClose: () => void;
}

const BookingContract: React.FC<BookingContractProps> = ({ car, user, startDate, endDate, durationInDays, totalPrice, includedKm, isDelivery, deliveryAddress, onClose }) => {

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .printable-contract, .printable-contract * {
                            visibility: visible;
                        }
                        .printable-contract {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            margin: 0;
                            padding: 20px;
                            border: none;
                        }
                         .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
            <div className="bg-white text-brand-black w-full max-w-4xl h-[90vh] rounded-lg shadow-2xl flex flex-col printable-contract">
                <div className="p-8 flex-grow overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                        <div>
                            <img src="https://i.postimg.cc/gJkzbYTX/Design-sans-titre-7.png" alt="CITADINE D'60 Logo" className="h-16 w-auto" />
                            <h2 className="font-display text-2xl font-extrabold text-brand-black mt-2">CITADINE <span className="text-brand-red">D'60</span></h2>
                            <p className="text-sm text-gray-600">1 Rue de la République, 60000 Beauvais</p>
                            <p className="text-sm text-gray-600">contact@citadined60.com | +33 7 59 51 14 43</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-display font-bold uppercase">Contrat de Location</h1>
                            <p className="text-gray-600">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-8 my-8">
                        <div>
                            <h3 className="font-bold text-lg mb-2 border-b border-gray-200 pb-1">Le Loueur</h3>
                            <p><strong>CITADINE D'60</strong></p>
                            <p>1 Rue de la République</p>
                            <p>60000 Beauvais, France</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 border-b border-gray-200 pb-1">Le Locataire</h3>
                            <p><strong>{user.firstName} {user.lastName}</strong></p>
                            <p>{user.email}</p>
                            <p>{user.phone}</p>
                            <p>{user.address}</p>
                        </div>
                    </div>
                    
                    {/* Booking Details */}
                    <div className="my-8">
                         <h3 className="font-bold text-lg mb-2 border-b border-gray-200 pb-1">Détails de la Location</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                            <div><strong className="block text-gray-500">Véhicule</strong> {car.name}</div>
                            <div><strong className="block text-gray-500">Début</strong> {startDate ? new Date(startDate).toLocaleString('fr-FR') : 'N/A'}</div>
                            <div><strong className="block text-gray-500">Fin</strong> {endDate ? new Date(endDate).toLocaleString('fr-FR') : 'N/A'}</div>
                            <div><strong className="block text-gray-500">Durée</strong> {durationInDays} jours</div>
                            <div><strong className="block text-gray-500">Forfait KM</strong> {includedKm} km</div>
                            <div><strong className="block text-gray-500">KM Sup.</strong> {car.extraKmPrice}€/km</div>
                        </div>
                        {isDelivery && (
                            <div className="mt-4 text-sm"><strong className="text-gray-500">Livraison: </strong> {deliveryAddress}</div>
                        )}
                    </div>
                    
                    {/* Pricing */}
                     <div className="my-8">
                         <h3 className="font-bold text-lg mb-2 border-b border-gray-200 pb-1">Détails Financiers</h3>
                        <div className="space-y-2 max-w-sm ml-auto text-sm">
                            <div className="flex justify-between"><span className="text-gray-600">Sous-total location:</span> <span>{(totalPrice - (isDelivery ? 30 : 0)).toFixed(2)}€</span></div>
                            {isDelivery && <div className="flex justify-between"><span className="text-gray-600">Frais de livraison:</span> <span>30.00€</span></div>}
                            <div className="flex justify-between font-bold border-t pt-2 mt-2"><span >Total TTC:</span> <span>{totalPrice.toFixed(2)}€</span></div>
                            <div className="flex justify-between font-bold text-brand-red"><span>Payé (demande de réservation):</span> <span>{totalPrice.toFixed(2)}€</span></div>
                             <div className="flex justify-between text-gray-600 text-xs pt-4"><span >Dépôt de garantie (pré-autorisation):</span> <span className="font-semibold">{car.deposit.toFixed(2)}€</span></div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="my-8 text-xs text-gray-500">
                        <h3 className="font-bold text-base mb-2 text-black border-b border-gray-200 pb-1">Conditions Générales</h3>
                        <p className="mb-2">Le locataire certifie être titulaire d'un permis de conduire valide et disposer des capacités physiques et légales pour conduire. Le véhicule est loué en parfait état de marche et de propreté. Le locataire s'engage à le restituer dans le même état. Tout dommage constaté au retour sera facturé sur la base du devis d'un réparateur et déduit du dépôt de garantie. Le locataire est responsable des infractions au code de la route commises durant la location.</p>
                        <p>Le dépôt de garantie n'est pas encaissé mais pré-autorisé. Il est libéré intégralement au retour si aucune dégradation n'est constatée. En cas de dépassement kilométrique, le tarif de {car.extraKmPrice}€ par kilomètre supplémentaire sera appliqué.</p>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-8 pt-12 mt-12 border-t-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <div className="w-full h-12 border-b border-gray-400"></div>
                            <p className="mt-2 text-sm">Signature du Loueur (CITADINE D'60)</p>
                        </div>
                        <div className="text-center">
                            <div className="w-full h-12 border-b border-gray-400"></div>
                            <p className="mt-2 text-sm">Signature du Locataire (précédée de "lu et approuvé")</p>
                        </div>
                    </div>
                </div>
                 {/* Action Buttons */}
                <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end gap-4 no-print">
                    <button onClick={onClose} className="py-2 px-5 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">Fermer</button>
                    <button onClick={handlePrint} className="py-2 px-5 rounded-md text-white bg-brand-red hover:bg-red-700 transition-colors">Imprimer / PDF</button>
                </div>
            </div>
        </div>
    );
};

export default BookingContract;