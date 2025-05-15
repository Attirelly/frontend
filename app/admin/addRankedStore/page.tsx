'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchableSelect from '@/components/SearchableSelect';

type Store = {
  id: number;
  store_name: string;
};

type Option = {
  label: string;
  value: string;
};

export default function AddStorePriorityPage() {
  const [selectedStore, setSelectedStore] = useState('');
  const [storeType, setStoreType] = useState('');
  const [location, setLocation] = useState('');
  const [subLocation, setSubLocation] = useState('');

  const [storeTypeOptions, setStoreTypeOptions] = useState<Option[]>([]);
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [subLocationOptions, setSubLocationOptions] = useState<Option[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/stores/store_types').then((res) => {
      console.log(res);
      const types = res.data.map((t: any) => ({
        label: t.store_type,
        value: t.id,
      }));
      setStoreTypeOptions(types);
    });
  }, []);

  useEffect(() => {
    if (storeType) {
      axios
        .get(`http://localhost:8000/homepage/cities_by_store_type/${storeType}`)
        .then((res) => {
          const locations = res.data.map((city: any) => ({
            label: city.name,
            value: city.id,
          }));
          setLocationOptions(locations);
        });
    }
  }, [storeType]);

  useEffect(() => {
  if (location) {
    axios
      .get(`http://localhost:8000/homepage/areas_by_city/${location}`)
      .then((res) => {
        const subs = res.data.map((area: any) => ({
          label: area.name,
          value: area.id,
        }));
        setSubLocationOptions(subs);
      });
  } else {
    setSubLocationOptions([]); // Clear if no location selected
  }
}, [location]);

  useEffect(() => {
    if (subLocation) {
      axios
        .get(`http://localhost:8000/homepage/stores_by_area/${subLocation}`)
        .then((res) => {
          const storesData = res.data.map((store: any) => ({
            id: store.id,
            store_name: store.store_name,
          }));
          setStores(storesData);
        });
    } else {
      setStores([]); // Clear if no sublocation selected
    }
  }, []);

  const storeOptions = stores.map((store) => ({
    label: store.store_name,
    value: store.id.toString(),
  }));


  const handleAdd = () => {
    console.log({
      selectedStore,
      storeType,
      location,
      subLocation,
    });
    // You can send this data to your backend API here
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Add Store Priority</h2>

      <SearchableSelect
        label="Store Type"
        options={storeTypeOptions}
        value={storeType}
        onChange={setStoreType}
      />

      <SearchableSelect
        label="Store Location"
        options={locationOptions}
        value={location}
        onChange={setLocation}
      />

      <SearchableSelect
        label="Store Sublocation"
        options={subLocationOptions}
        value={subLocation}
        onChange={setSubLocation}
      />

      <SearchableSelect
        label="Select Store"
        options={storeOptions}
        value={selectedStore}
        onChange={setSelectedStore}
      />

      <div className="text-center">
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}
