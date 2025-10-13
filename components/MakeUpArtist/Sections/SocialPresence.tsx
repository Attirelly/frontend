"use client";

import React, { useState, useEffect } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";
import { api } from "@/lib/axios";
import { State, City, Area, Pincode } from "@/types/utilityTypes"; // Ensure these types are correctly defined

// Main Component
interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const LocationAndAvailability: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { locationAndAvailability, updateLocationAndAvailability } = useMakeupArtistStore();

  // Local state for dropdown options
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [pincodes, setPincodes] = useState<Pincode[]>([]);

  // Loading states
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isLoadingPincodes, setIsLoadingPincodes] = useState(false);
  
  // Fetch all states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/states');
        setStates(response.data);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when a state is selected
  useEffect(() => {
    const selectedStateId = locationAndAvailability.state?.id;
    if (selectedStateId) {
      const fetchCities = async () => {
        setIsLoadingCities(true);
        setCities([]); setAreas([]); setPincodes([]); // Reset dependent dropdowns
        try {
          const response = await api.get(`/cities?stateId=${selectedStateId}`);
          setCities(response.data);
        } catch (error) {
          console.error("Failed to fetch cities:", error);
        } finally {
          setIsLoadingCities(false);
        }
      };
      fetchCities();
    }
  }, [locationAndAvailability.state]);
  
  // Fetch areas when a city is selected
  useEffect(() => {
    const selectedCityId = locationAndAvailability.city?.id;
    if (selectedCityId) {
        const fetchAreas = async () => {
            setIsLoadingAreas(true);
            setAreas([]); setPincodes([]); // Reset dependent dropdowns
            try {
                const response = await api.get(`/areas?cityId=${selectedCityId}`);
                setAreas(response.data);
            } catch(error) {
                console.error("Failed to fetch areas:", error);
            } finally {
                setIsLoadingAreas(false);
            }
        }
        fetchAreas();
    }
  }, [locationAndAvailability.city]);

  // Fetch pincodes when an area is selected
  useEffect(() => {
    const selectedAreaId = locationAndAvailability.area?.id;
    if (selectedAreaId) {
        const fetchPincodes = async () => {
            setIsLoadingPincodes(true);
            setPincodes([]); // Reset dependent dropdown
            try {
                const response = await api.get(`/pincodes?areaId=${selectedAreaId}`);
                setPincodes(response.data);
            } catch(error) {
                console.error("Failed to fetch pincodes:", error);
            } finally {
                setIsLoadingPincodes(false);
            }
        }
        fetchPincodes();
    }
  }, [locationAndAvailability.area]);


  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationAndAvailability.state || !locationAndAvailability.city || !locationAndAvailability.area || !locationAndAvailability.pincode) {
      alert("Please complete your full location details.");
      return;
    }
    onNext();
  };
  
  const travelReadinessOptions: typeof locationAndAvailability.travelReadiness[] = ["Local Only", "State-wide", "Pan-India"];

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Location & Availability</h2>
      <p className="text-gray-500 mb-8">
        Let clients know where you are based and how far you're willing to travel.
      </p>

      <div className="space-y-6">
        {/* Location Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput label="State" value={locationAndAvailability.state?.id} loading={isLoadingStates} options={states} onChange={(id) => updateLocationAndAvailability({ state: states.find(s=>s.id === id) || null, city: null, area: null, pincode: null })} />
          <SelectInput label="City" value={locationAndAvailability.city?.id} loading={isLoadingCities} disabled={!locationAndAvailability.state} options={cities} onChange={(id) => updateLocationAndAvailability({ city: cities.find(c=>c.id === id) || null, area: null, pincode: null })} />
          <SelectInput label="Area" value={locationAndAvailability.area?.id} loading={isLoadingAreas} disabled={!locationAndAvailability.city} options={areas} onChange={(id) => updateLocationAndAvailability({ area: areas.find(a=>a.id === id) || null, pincode: null })} />
          <SelectInput label="Pincode" value={locationAndAvailability.pincode?.id} loading={isLoadingPincodes} disabled={!locationAndAvailability.area} options={pincodes} onChange={(id) => updateLocationAndAvailability({ pincode: pincodes.find(p=>p.id === id) || null })} />
        </div>

        {/* Travel Toggles & Options */}
        <div className="pt-4 space-y-6">
            <ToggleSwitch label="Willing to Travel to Venue?" enabled={locationAndAvailability.travelAvailable} setEnabled={(val) => updateLocationAndAvailability({ travelAvailable: val })} />
            
            {/* Conditional Travel Readiness */}
            {locationAndAvailability.travelAvailable && (
                <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Travel Readiness</label>
                    <div className="flex flex-wrap gap-4">
                        {travelReadinessOptions.map((option) => (
                        <button
                            type="button"
                            key={option}
                            onClick={() => updateLocationAndAvailability({ travelReadiness: option })}
                            className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                            locationAndAvailability.travelReadiness === option
                                ? "border-black bg-gray-50 font-semibold"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                        >
                            {option}
                        </button>
                        ))}
                    </div>
                </div>
            )}
            
            <ToggleSwitch label="Available for Destination Weddings?" enabled={locationAndAvailability.availableForDestination} setEnabled={(val) => updateLocationAndAvailability({ availableForDestination: val })} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-12 pt-6 border-t">
        <div></div> {/* Back button placeholder */}
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? "Submit" : "Next →"}
        </button>
      </div>
    </form>
  );
};

// Helper component for Select inputs
const SelectInput = ({ label, value, loading, disabled, options, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading || disabled || options.length === 0}
      className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
    >
      <option value="" disabled>{loading ? `Loading ${label}s...` : `Select a ${label}`}</option>
      {options.map((option: any) => (
        <option key={option.id} value={option.id}>
            {option.name || option.pincode_value /* Adjust based on your type properties */}
        </option>
      ))}
    </select>
  </div>
);

// Helper component for Toggle switches
const ToggleSwitch = ({ label, enabled, setEnabled }: { label: string; enabled: boolean; setEnabled: (val: boolean) => void }) => (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`${enabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
        >
            <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
        </button>
    </div>
);

export default LocationAndAvailability;