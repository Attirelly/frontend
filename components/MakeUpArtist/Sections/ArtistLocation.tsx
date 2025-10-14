"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";
import { State, City, Area, Pincode } from "@/types/utilityTypes";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const ArtistLocation: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { artistLocation, updateArtistLocation } = useMakeupArtistStore();

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch all location data
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [stateRes, cityRes, areaRes, pincodeRes] = await Promise.all([
          api.get("/location/states/"),
          api.get("/location/cities/"),
          api.get("/location/areas/"),
          api.get("/location/pincodes/"),
        ]);

        setStates(stateRes.data);
        setCities(cityRes.data);
        setAreas(areaRes.data);
        setPincodes(pincodeRes.data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, []);

  // Filter cities / areas / pincodes based on selection
  const filteredCities = cities.filter(
    (city) => city.state_id === artistLocation.state?.id
  );

  const filteredAreas = areas.filter(
    (area) => area.city_id === artistLocation.city?.id
  );

  const filteredPincodes = pincodes.filter(
    (pin) => pin.city_id === artistLocation.city?.id
  );

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!artistLocation.state) newErrors.state = "State is required.";
    if (!artistLocation.city) newErrors.city = "City is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Artist Location</h2>
      <p className="text-gray-500 mb-8">
        Provide your location so clients can find you easily.
      </p>

      <div className="space-y-6">
        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={artistLocation.state?.id || ""}
            onChange={(e) => {
              const state = states.find((s) => s.id === e.target.value) || null;
              updateArtistLocation({
                state,
                city: null,
                area: null,
                pincode: null,
              });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={artistLocation.city?.id || ""}
            onChange={(e) => {
              const city = cities.find((c) => c.id === e.target.value) || null;
              updateArtistLocation({
                city,
                area: null,
                pincode: null,
              });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a city</option>
            {filteredCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area (Optional)
          </label>
          <select
            value={artistLocation.area?.id || ""}
            onChange={(e) => {
              const area = areas.find((a) => a.id === e.target.value) || null;
              updateArtistLocation({ area });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select an area</option>
            {filteredAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode (Optional)
          </label>
          <select
            value={artistLocation.pincode?.id || ""}
            onChange={(e) => {
              const pin = pincodes.find((p) => p.id === e.target.value) || null;
              updateArtistLocation({ pincode: pin });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a pincode</option>
            {filteredPincodes.map((pin) => (
              <option key={pin.id} value={pin.id}>
                {pin.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
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

export default ArtistLocation;
