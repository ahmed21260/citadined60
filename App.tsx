
import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import VehicleList from './components/VehicleList';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import VehicleDetailModal from './components/VehicleDetailModal';
import BookingFlow from './components/BookingFlow';
import AccountModal from './components/AccountModal';
import AdminDashboard from './components/AdminDashboard';
import ProfileCompletionModal from './components/ProfileCompletionModal';
import { Car, User, LegalPage, BookingDetails, Booking } from './types';
import { vehicles } from './constants';
import AIAssistant from './components/AIAssistant';
import LegalModal from './components/LegalModal';
import UserDashboardModal from './components/UserDashboardModal';
import { onAuthStateChanged, getUserProfile, logout, getBookingsForUser, updateUserProfile, createUserProfile } from './services/firebaseService';

// Define admin emails here. Any user logging in with one of these emails will be granted admin access.
const ADMIN_EMAILS = ['contact@citadined60.com'];

const WhatsAppButton: React.FC = () => (
    <a
        href="https://wa.me/33759511443"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 text-white fill-current">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-114.7-68.2-157.8zM223.9 448c-34.8 0-68.5-9.1-98.3-25.7l-7.2-4.3-72.7 19.1 19.4-70.9-4.8-7.6C44.6 324.9 32 287.1 32 248.9c0-106.2 85.9-192.1 191.9-192.1 52.4 0 101.5 20.6 137.9 57.1 36.4 36.4 57.1 85.5 57.1 137.9-.1 106.2-86 192.1-192.1 192.1zm84.4-120.3c-4.9-2.5-29.2-14.4-33.7-16.1-4.5-1.7-7.8-2.5-11.1 2.5-3.3 5-12.7 16.1-15.6 19.3-2.9 3.3-5.8 3.7-10.7 1.2-22.1-11.3-36.6-20.2-48.9-38.3-9.9-14.6-2.5-22.3 2.2-29.9 1.5-2.3 3-3.8 4.5-5.6 1.5-1.8 2.2-3.3 3.3-5.6 1.1-2.2.5-4.2-1.3-6.6-1.7-2.5-11.1-26.6-15.2-36.4-4.1-9.8-8.2-8.5-11.1-8.5h-9.7c-3.3 0-8.6 1.2-13.1 6.2-4.5 5-17.3 16.9-17.3 41.2 0 24.3 17.7 47.8 20.2 51.1 2.5 3.3 34.8 53.1 84.4 74.2 11.9 5.1 21.2 8.1 28.4 10.4 13.7 4.4 26.2 3.8 36.1 2.2 11.1-1.7 33.7-13.8 38.5-27.1 4.8-13.3 4.8-24.6 3.3-27.1-1.5-2.5-4.8-3.9-9.7-6.4z" />
        </svg>
    </a>
);


const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

    const [isVehicleDetailModalOpen, setIsVehicleDetailModalOpen] = useState(false);
    const [isBookingFlowOpen, setIsBookingFlowOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
    const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);
    
    const [legalPage, setLegalPage] = useState<LegalPage>('notice');
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

    const [isAdminView, setIsAdminView] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    let userProfile = await getUserProfile(firebaseUser.uid);

                    if (!userProfile) {
                        const newUser: User = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            firstName: firebaseUser.displayName?.split(' ')[0] || '',
                            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                            phone: firebaseUser.phoneNumber || '',
                            address: '',
                            isAdmin: ADMIN_EMAILS.includes(firebaseUser.email || '')
                        };
                        await createUserProfile(newUser);
                        userProfile = newUser;
                    }

                    const finalUser = { ...userProfile, isAdmin: ADMIN_EMAILS.includes(userProfile.email) };
                    setCurrentUser(finalUser);

                    // Fetch bookings in a separate try/catch block to avoid logging out on failure
                    try {
                        const userBookings = await getBookingsForUser(firebaseUser.uid);
                        setBookings(userBookings);
                    } catch (bookingError) {
                        console.error("Failed to fetch bookings, but user will remain logged in. This is likely due to a missing Firestore index. Please create it in your Firebase console.", bookingError);
                        setBookings([]); // Set bookings to empty array on error
                    }

                    if (!finalUser.phone || !finalUser.address) {
                        setShowProfileCompletionModal(true);
                    }

                } else {
                    // User is signed out
                    setCurrentUser(null);
                    setBookings([]);
                }
            } catch (error) {
                console.error("Critical error during user profile handling:", error);
                await logout(); // Only logout on critical profile errors
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSelectCar = (car: Car) => {
        setSelectedCar(car);
        setIsVehicleDetailModalOpen(true);
    };
    
    const handleStartBooking = (car: Car, details: BookingDetails) => {
        setSelectedCar(car);
        setBookingDetails(details);
        setIsVehicleDetailModalOpen(false);

        if (currentUser) {
            if (!currentUser.phone || !currentUser.address) {
                setShowProfileCompletionModal(true);
            } else {
                setIsBookingFlowOpen(true);
            }
        } else {
            setIsAccountModalOpen(true);
        }
    };

    const handleAccountClick = () => {
        if (currentUser) {
            setIsUserDashboardOpen(true);
        } else {
            setIsAccountModalOpen(true);
        }
    };
    
    const handleLogout = async () => {
        await logout();
        setCurrentUser(null);
        setIsUserDashboardOpen(false);
    };
    
    const handleUpdateProfile = async (updatedUser: User) => {
        if (currentUser) {
            await updateUserProfile(currentUser.uid, updatedUser);
            setCurrentUser(updatedUser);
            setShowProfileCompletionModal(false);
            // If booking flow was waiting, open it now
            if(bookingDetails) {
                setIsBookingFlowOpen(true);
            }
        }
    };

    const handleLegalLinkClick = (page: LegalPage) => {
        setLegalPage(page);
        setIsLegalModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-brand-black flex flex-col items-center justify-center text-white">
                <img src="https://i.postimg.cc/gJkzbYTX/Design-sans-titre-7.png" alt="Logo" className="h-24 w-auto mb-4 animate-pulse" />
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-brand-red"></div>
                <p className="mt-4 text-brand-gray">Chargement de l'application...</p>
            </div>
        );
    }

    if (currentUser?.isAdmin && isAdminView) {
        return <AdminDashboard onExitAdminView={() => setIsAdminView(false)} />;
    }

    return (
        <div className="bg-brand-black text-white">
            <Header onAccountClick={handleAccountClick} currentUser={currentUser} />
            <main>
                <Hero />
                <VehicleList vehicles={vehicles} onSelectCar={handleSelectCar} />
                <AIAssistant vehicles={vehicles} onSelectCar={handleSelectCar} />
                <WhyUs />
                <Services />
                <Testimonials />
                <Faq />
                <Contact />
            </main>
            <Footer onLegalLinkClick={handleLegalLinkClick} currentUser={currentUser} onAdminClick={() => setIsAdminView(true)} />
            <WhatsAppButton />

            {selectedCar && (
                 <VehicleDetailModal
                    car={selectedCar}
                    isOpen={isVehicleDetailModalOpen}
                    onClose={() => setIsVehicleDetailModalOpen(false)}
                    onStartBooking={handleStartBooking}
                />
            )}
            
            {isAccountModalOpen && <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />}
            
            {currentUser && isUserDashboardOpen && (
                 <UserDashboardModal
                    isOpen={isUserDashboardOpen}
                    onClose={() => setIsUserDashboardOpen(false)}
                    user={currentUser}
                    bookings={bookings}
                    onLogout={handleLogout}
                    onOpenLegalPage={handleLegalLinkClick}
                />
            )}

            {currentUser && showProfileCompletionModal && (
                <ProfileCompletionModal
                    isOpen={showProfileCompletionModal}
                    user={currentUser}
                    onClose={() => setShowProfileCompletionModal(false)}
                    onUpdate={handleUpdateProfile}
                />
            )}

            {currentUser && isBookingFlowOpen && selectedCar && (
                <BookingFlow
                    isOpen={isBookingFlowOpen}
                    onClose={() => {setIsBookingFlowOpen(false); setBookingDetails(null);}}
                    car={selectedCar}
                    user={currentUser}
                    initialDetails={bookingDetails}
                    onOpenLegalPage={handleLegalLinkClick}
                />
            )}

            {isLegalModalOpen && <LegalModal page={legalPage} onClose={() => setIsLegalModalOpen(false)} />}
        </div>
    );
};

export default App;
