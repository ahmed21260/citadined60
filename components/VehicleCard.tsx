import React from 'react';
import { Car } from '../types';

interface VehicleCardProps {
    car: Car;
    onSelectCar: (car: Car) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ car, onSelectCar }) => {
    return (
        <div 
            className="group relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-brand-red/20 transform hover:-translate-y-2 cursor-pointer h-96"
            onClick={() => onSelectCar(car)}
            aria-label={`Voir les détails pour ${car.name}`}
        >
            {/* Background Image */}
            <img 
                src={car.image} 
                alt={car.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 scale-110 group-hover:scale-125 drop-shadow-lg" 
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <div>
                    <h3 className="text-2xl lg:text-3xl font-display font-bold text-white uppercase drop-shadow-md leading-tight">{car.name}</h3>
                    
                    {/* Details visible on hover */}
                    <div className="overflow-hidden transition-all duration-500 ease-out-expo max-h-0 group-hover:max-h-40">
                         <div className="grid grid-cols-3 gap-4 text-center my-4 pt-4 border-t border-white/20">
                            <div>
                                <p className="text-xs text-brand-gray uppercase">Carburant</p>
                                <p className="font-bold text-white text-lg">{car.fuel}</p>
                            </div>
                            <div>
                                <p className="text-xs text-brand-gray uppercase">Boîte</p>
                                <p className="font-bold text-white text-lg">{car.gearbox}</p>
                            </div>
                            <div>
                                <p className="text-xs text-brand-gray uppercase">Inclus/jour</p>
                                <p className="font-bold text-white text-lg">{car.pricing.day.km} km</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Price and CTA */}
                    <div className="mt-4 flex justify-between items-center">
                        <div>
                            <span className="text-sm text-brand-gray">dès</span>
                            <p className="text-3xl font-bold text-white drop-shadow-md">{car.pricing.day.price}€<span className="text-base font-normal text-brand-gray">/j</span></p>
                        </div>
                        <button className="bg-brand-red text-white font-bold py-2 px-5 rounded-sm text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            Réserver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;