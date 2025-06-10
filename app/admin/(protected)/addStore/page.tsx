'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchableSelect from '@/components/SearchableSelect';

type Store = {
  store_id: string;
  store_name: string;
};

type StoreType = {
  id: string;
  store_type: string;
};

type Section = {
  description: string;
  section_id: string;
};

type Option = {
  label: string;
  value: string;
};

type City = {
  name: string;
  id: string;
};

type Area = {
  name: string;
  id: string;
};

export default function AddStorePriorityPage() {
  const [selectedStore, setSelectedStore] = useState('');
  const [storeType, setStoreType] = useState('');
  const [location, setLocation] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [section, setSection] = useState('');

  const [storeTypeOptions, setStoreTypeOptions] = useState<Option[]>([]);
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [subLocationOptions, setSubLocationOptions] = useState<Option[]>([]);
  const [storeOptions, setStoreOptions] = useState<Option[]>([]);
  const [sectionOptions, setSectionOptions] = useState<Option[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/homepage/section').then((response) =>{
      console.log(response);
        const sections = response.data.map((section: Section) => ({
          label: section.description,
          value: section.section_id,
        }));
        setSectionOptions(sections);
    })
  }, []);
  useEffect(() => {
    axios.get('http://localhost:8000/stores/store_types').then((res) => {
      console.log(res);
      const types = res.data.map((t: StoreType) => ({
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
          const locations = res.data.map((city: City) => ({
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
        const subs = res.data.map((area: Area) => ({
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
      console.log('Fetching stores for subLocation:', subLocation);
      axios
        .get(`http://localhost:8000/homepage/stores_by_area/${subLocation}`)
        .then((res) => {
          console.log(res);
          const storesData = res.data.map((store: Store) => ({
            label: store.store_name,
            value: store.store_id,
          }));
          setStoreOptions(storesData);
        });
    } else {
      setStoreOptions([]); // Clear if no sublocation selected
    }
  }, [subLocation]);


  const handleAdd = async () => {
    // console.log({
    //   section,
    //   selectedStore,
    //   storeType,
    //   location,
    //   subLocation,
    // });

    if (!section || !selectedStore || !storeType || !location || !subLocation){
      alert('Please fill all fields')
      return
    }
    try{
      await axios.post('http://localhost:8000/homepage/section_store', null ,{ 
        params : {section_id: section, store_id: selectedStore}
      });
      alert('Store added successfully!');
      setSelectedStore(''); // Clear the store selection
    }
    catch (error) {
      console.error(error);
      alert('Failed to add store to section');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Add Stores</h2>

      <SearchableSelect
        label="Select Section"
        options={sectionOptions}
        value={section}
        onChange={setSection}
        />

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
