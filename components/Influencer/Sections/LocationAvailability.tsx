"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useInfluencerStore } from "@/store/influencerStore";
import { City, Area, Pincode, State } from "@/types/utilityTypes";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const travelOptions = ["Local Only", "State-wide", "Pan-India"] as const;

const LocationAvailability: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { locationAndAvailability, updateLocationAndAvailability } = useInfluencerStore();

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [pincodes, setPincodes] = useState<Pincode[]>([]);

  // === Fetch all location data ===
  useEffect(() => {
    const fetchLocationData = async () => {
      console.log(1)
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

  // === Derived filtered data ===
  const filteredCities = cities.filter(
    (city) => city.state_id === locationAndAvailability.state?.id
  );

  const filteredAreas = areas.filter(
    (area) => area.city_id === locationAndAvailability.city?.id
  );

  const filteredPincodes = pincodes.filter(
    (pin) => pin.city_id === locationAndAvailability.city?.id
  );

  // === Form handling ===
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !locationAndAvailability.state ||
      !locationAndAvailability.city ||
      !locationAndAvailability.travelReadiness
    ) {
      alert("Please fill out all mandatory fields marked with *");
      return;
    }
    onNext();
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Location & Availability</h2>
      <p className="text-gray-500 mb-8">
        Let brands know where you are based and your availability.
      </p>

      <div className="space-y-6">
        {/* --- State --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={locationAndAvailability.state?.id || ""}
            onChange={(e) => {
              const state = states.find((s) => s.id === e.target.value) || null;
              updateLocationAndAvailability({
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
        </div>

        {/* --- City --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={locationAndAvailability.city?.id || ""}
            onChange={(e) => {
              const city = cities.find((c) => c.id === e.target.value) || null;
              updateLocationAndAvailability({
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
        </div>

        {/* --- Area --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area (Optional)
          </label>
          <select
            value={locationAndAvailability.area?.id || ""}
            onChange={(e) => {
              const area = areas.find((a) => a.id === e.target.value) || null;
              updateLocationAndAvailability({ area });
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

        {/* --- Pincode --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode (Optional)
          </label>
          <select
            value={locationAndAvailability.pincode?.id || ""}
            onChange={(e) => {
              const pin = pincodes.find((p) => p.id === e.target.value) || null;
              updateLocationAndAvailability({ pincode: pin });
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

        {/* --- Travel Readiness --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Readiness <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {travelOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() =>
                  updateLocationAndAvailability({ travelReadiness: option })
                }
                className={`p-3 border rounded-lg text-center transition-all duration-200 ${
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

        {/* --- Attend Events --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Willingness to attend events / shoots{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                updateLocationAndAvailability({ attendEvents: true })
              }
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                locationAndAvailability.attendEvents
                  ? "border-black bg-gray-50 font-semibold"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() =>
                updateLocationAndAvailability({ attendEvents: false })
              }
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                !locationAndAvailability.attendEvents
                  ? "border-black bg-gray-50 font-semibold"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* --- Navigation Button --- */}
      {/* <div className="flex justify-end mt-12 pt-6">
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? "Submit" : "Next →"}
        </button>
      </div> */}
    </form>
  );
};

export default LocationAvailability;
