

import React, { useState, useEffect, useMemo } from 'react';
import { Booking } from '../types';
import AdminBookingDetailModal from './AdminBookingDetailModal';
import { getAllBookings, updateBookingStatus } from '../services/firebaseService';

const AdminDashboard: React.FC<{ onExitAdminView: () => void }> = ({ onExitAdminView }) => {
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [filter, setFilter] = useState<'pending' | 'confirmed' | 'rejected' | 'completed' | 'all'>('pending');

    const fetchBookings = async () => {
        setIsLoading(true);
        const bookingsFromDb = await getAllBookings();
        setAllBookings(bookingsFromDb);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);
    
    const filteredBookings = useMemo(() => {
        if (filter === 'all') {
            return allBookings;
        }
        return allBookings.filter(b => b.status === filter);
    }, [filter, allBookings]);


    const handleUpdateStatus = async (bookingId: string, status: 'confirmed' | 'rejected' | 'completed') => {
        await updateBookingStatus(bookingId, status);
        await fetchBookings(); // Re-fetch to get the updated list
        setSelectedBooking(null); // Close modal after action
        alert(`Statut de la réservation ${bookingId} mis à jour à ${status}.`);
    };
    
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-300';
            case 'confirmed': return 'bg-green-500/20 text-green-300';
            case 'rejected': return 'bg-red-500/20 text-red-300';
            case 'completed': return 'bg-blue-500/20 text-blue-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    return (
        <div className="bg-brand-black min-h-screen text-white">
            <header className="bg-brand-carbon p-4 flex justify-between items-center">
                <h1 className="text-2xl font-display">Tableau de Bord <span className="text-brand-red">Admin</span></h1>
                <button onClick={onExitAdminView} className="text-sm text-brand-gray hover:text-white">Retour au site</button>
            </header>
            <main className="p-8">
                <div className="mb-6 flex gap-2 flex-wrap">
                    <button onClick={() => setFilter('pending')} className={`px-4 py-2 text-sm rounded-md ${filter === 'pending' ? 'bg-brand-red' : 'bg-white/10'}`}>En attente</button>
                    <button onClick={() => setFilter('confirmed')} className={`px-4 py-2 text-sm rounded-md ${filter === 'confirmed' ? 'bg-brand-red' : 'bg-white/10'}`}>Confirmées</button>
                    <button onClick={() => setFilter('rejected')} className={`px-4 py-2 text-sm rounded-md ${filter === 'rejected' ? 'bg-brand-red' : 'bg-white/10'}`}>Rejetées</button>
                    <button onClick={() => setFilter('completed')} className={`px-4 py-2 text-sm rounded-md ${filter === 'completed' ? 'bg-brand-red' : 'bg-white/10'}`}>Terminées</button>
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm rounded-md ${filter === 'all' ? 'bg-brand-red' : 'bg-white/10'}`}>Toutes</button>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                         <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-brand-red mx-auto"></div>
                         <p className="mt-4 text-brand-gray">Chargement des réservations...</p>
                    </div>
                ) : (
                    <div className="bg-brand-carbon rounded-lg overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[860px]">
                            <thead className="bg-white/5 uppercase text-xs text-brand-gray">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Client</th>
                                    <th className="p-4">Véhicule</th>
                                    <th className="p-4">Période</th>
                                    <th className="p-4 text-right">Prix</th>
                                    <th className="p-4">Type Paiement</th>
                                    <th className="p-4 text-center">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? filteredBookings.map(booking => (
                                    <tr key={booking.id} onClick={() => setSelectedBooking(booking)} className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                                        <td className="p-4">{booking.createdAt.toDate().toLocaleDateString('fr-FR')}</td>
                                        <td className="p-4">{booking.user.firstName} {booking.user.lastName}</td>
                                        <td className="p-4">{booking.car.name}</td>
                                        <td className="p-4">{booking.durationInDays} jours</td>
                                        <td className="p-4 text-right">{booking.totalPrice.toFixed(2)}€</td>
                                        <td className="p-4 capitalize">{booking.paymentOption === 'down_payment' ? 'Acompte' : 'Total'}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="text-center p-8 text-brand-gray">Aucune réservation trouvée pour ce filtre.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            {selectedBooking && (
                <AdminBookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default AdminDashboard;