import React, { useState, useMemo } from 'react';
import { Car } from '../types';
import VehicleCard from './VehicleCard';

interface VehicleListProps {
    vehicles: Car[];
    onSelectCar: (car: Car) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onSelectCar }) => {
    const [brandFilter, setBrandFilter] = useState<string>('all');
    const [gearboxFilter, setGearboxFilter] = useState<string>('all');

    const brands = useMemo(() => ['all', ...Array.from(new Set(vehicles.map(v => v.brand)))], [vehicles]);
    const gearboxes = useMemo(() => ['all', ...Array.from(new Set(vehicles.map(v => v.gearbox)))], [vehicles]);

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(car => {
            const brandMatch = brandFilter === 'all' || car.brand === brandFilter;
            const gearboxMatch = gearboxFilter === 'all' || car.gearbox === gearboxFilter;
            return brandMatch && gearboxMatch;
        });
    }, [vehicles, brandFilter, gearboxFilter]);
    
    const FilterButton: React.FC<{value: string; label: string; activeValue: string; setter: React.Dispatch<React.SetStateAction<string>>}> = ({ value, label, activeValue, setter }) => (
        <button
            onClick={() => setter(value)}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors duration-300 ${activeValue === value ? 'bg-brand-red text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
            {label}
        </button>
    );

    return (
        <div id="vehicles" className="bg-brand-black py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">Nos Véhicules</h2>
                    <p className="text-lg text-brand-gray mt-4 max-w-2xl mx-auto">Découvrez notre flotte de citadines disponibles à la location à Beauvais. Parfaites pour explorer l'Oise ou pour un trajet depuis l'aéroport de Beauvais-Tillé.</p>
                     <div className="h-1 w-20 bg-brand-red mx-auto mt-6"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="text-white font-medium mr-2">Marque:</span>
                        {brands.map(brand => <FilterButton key={brand} value={brand} label={brand === 'all' ? 'Toutes' : brand} activeValue={brandFilter} setter={setBrandFilter} />)}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="text-white font-medium mr-2">Boîte:</span>
                        {gearboxes.map(gearbox => <FilterButton key={gearbox} value={gearbox} label={gearbox === 'all' ? 'Toutes' : gearbox} activeValue={gearboxFilter} setter={setGearboxFilter} />)}
                    </div>
                     {(brandFilter !== 'all' || gearboxFilter !== 'all') && (
                        <button 
                            onClick={() => { setBrandFilter('all'); setGearboxFilter('all'); }} 
                            className="text-brand-red hover:text-white transition-colors text-sm">
                            Réinitialiser
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVehicles.map(car => (
                        <VehicleCard key={car.id} car={car} onSelectCar={onSelectCar} />
                    ))}
                </div>
                {filteredVehicles.length === 0 && (
                    <div className="text-center py-16 text-brand-gray">
                        <p>Aucun véhicule ne correspond à vos critères de recherche.</p>
                    </div>
                )}

                <div className="text-center mt-20">
                    <h3 className="text-2xl font-display text-white">🚗 Nouvelle collection de véhicules prochainement disponible !</h3>
                </div>
            </div>
        </div>
    );
};

export default VehicleList;
