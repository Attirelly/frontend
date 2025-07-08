'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { City, Area } from '@/types/SellerTypes';
import { Image } from '@/types/ProductTypes';

interface Store {
  store_id: string;
  store_name: string;
  city: City;
  area: Area;
}

interface Product {
  product_id: string;
  product_name: string;
  store_id: string;
  images: Image[];
}

export default function AddStoreProduct() {
  const searchParams = useSearchParams();
  const curation_type = searchParams.get('curation_type');
  const curation_number = searchParams.get('curation_number');
  const curation_id = searchParams.get('curation_id');
  const curation_name = searchParams.get('curation_name');
  const curation_url = searchParams.get('curation_url');

  const rows = Array.from({ length: 9 });
  const [stores, setStores] = useState<Store[]>([]);
  const [storeSelections, setStoreSelections] = useState<string[]>(Array(9).fill(''));
  const [products, setProducts] = useState<Product[]>([]);
  const [productsByStore, setProductsByStore] = useState<Record<string, Product[]>>({});
  const [productSelections, setProductSelections] = useState<string[]>(Array(9).fill(''));
  const [curationName, setCurationName] = useState('');
  const [viewAllUrl, setViewAllUrl] = useState('');
  const [storesFromSection, setStoresFromSection] = useState<Store[]>([]);
  const router = useRouter();
  console.log(productsByStore);

  useEffect(() => {
    if (!curation_id) return;
    setViewAllUrl(curation_url || '');
    setCurationName(curation_name || '');

    const fetchStoresBySection = async () => {
      try {
        const response = await api.get(`/homepage/stores_by_section/${curation_id}`);
        const fetchedStores: Store[] = response.data;

        setStoresFromSection(fetchedStores);

        const updatedSelections = [...storeSelections];
        for (let i = 0; i < fetchedStores.length && i < updatedSelections.length; i++) {
          updatedSelections[i] = fetchedStores[i].store_id;
        }
        setStoreSelections(updatedSelections);
      } catch (error) {
        console.error('Error fetching stores by section:', error);
      }
    };

    const fetchStoresAndProductsBySection = async () => {
      try {
        const response = await api.get(`/homepage/stores_and_products_by_section/${curation_id}`);
        const storeProductPairs: { store_id: string; product_id?: string }[] = response.data;

        // Set dropdown values row-wise
        const updatedStoreSelections = storeProductPairs.map((pair) => pair.store_id);
        const updatedProductSelections = storeProductPairs.map((pair) => pair.product_id || '');

        setStoreSelections(updatedStoreSelections);
        setProductSelections(updatedProductSelections);
      } catch (error) {
        console.error('Error fetching stores and products by section:', error);
      }
    };

    if (curation_type === 'product') {
      fetchStoresAndProductsBySection();
    }
    else {
      fetchStoresBySection();
    }

  }, [curation_id]);

   useEffect(() => {
    api
      .get('/stores/')
      .then((response) => {
        setStores(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stores:', error);
      });
  }, []);

  useEffect(() => {
    if (curation_type === 'product') {
      const fetchProducts = async () => {
        try {
          const response = await api.get('/products/');
          const fetchedProducts: Product[] = response.data;
          setProducts(fetchedProducts);
          const grouped = fetchedProducts.reduce<Record<string, Product[]>>((acc, product) => {
            if (!acc[product.store_id]) acc[product.store_id] = [];
            acc[product.store_id].push(product);
            return acc;
          }, {});
          setProductsByStore(grouped);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };

      fetchProducts();
    }
  }, [curation_type]);

 

  const handleEdit = async () => {
    if (!curationName.trim() || !viewAllUrl.trim()) {
      alert('Curation name and View All URL are required.');
      return;
    }

    const selectedStoreIds = storeSelections.filter((id) => id);
    if (selectedStoreIds.length === 0) {
      alert('At least one valid store must be selected.');
      return;
    }
    const selectedProductIds = productSelections.filter((id) => id);
    if (curation_type === 'product') {
      if (selectedProductIds.length === 0) {
        alert('At least one valid product must be selected.');
        return;
      }
      if (selectedStoreIds.length !== selectedProductIds.length) {
        alert('Please select a product for each store.');
        return;
      }

    }
    const payload = {
      section_name: curationName,
      section_number: Number(curation_number) || 1,
      section_type: curation_type,
      section_url: viewAllUrl,
      store_ids: storeSelections.filter((id) => id),
      product_ids: productSelections.filter((id) => id),
    };

    try {
      await api.put(`/homepage/section/${curation_id}`, payload);
      // alert('Section Updated successfully!');
      toast.success("Curation submitted successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error('Failed to update section:', error);
      toast.error(err.response?.data?.message || 'Failed to update section.');
      // alert(err.response?.data?.message || 'Failed to update section.');
    }
  };

  const handleCreate = async () => {
    if (!curationName.trim() || !viewAllUrl.trim()) {
      alert('Curation name and View All URL are required.');
      return;
    }

    const selectedStoreIds = storeSelections.filter((id) => id);
    if (selectedStoreIds.length === 0) {
      alert('At least one valid store must be selected.');
      return;
    }
    const selectedProductIds = productSelections.filter((id) => id);
    if (curation_type === 'product') {
      if (selectedProductIds.length === 0) {
        alert('At least one valid product must be selected.');
        return;
      }
      if (selectedStoreIds.length !== selectedProductIds.length) {
        alert('Please select a product for each store.');
        return;
      }

    }

    const payload = {
      section_name: curationName,
      section_number: Number(curation_number) || 1,
      section_type: curation_type,
      section_url: viewAllUrl,
      store_ids: selectedStoreIds,
      product_ids: productSelections.filter((id) => id),
    };
    console.log('Payload:', payload);
    // return;

    try {
      const response = await api.post('/homepage/section', payload);
      // alert('Section created successfully!');
      toast.success("Curation submitted successfully!");
      router.replace("/admin/curationModule/createCuration");
      console.log('Created:', response.data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error('Failed to create section:', error);
      toast.error(err.response?.data?.message || "Failed to create section.");
      // alert(err.response?.data?.message || 'Failed to create section.');
    }
  };

  const handleStoreChange = (index: number, value: string) => {
    const match = value.match(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/);
    const storeId = match ? match[0] : '';
    const found = stores.find((store) => store.store_id === storeId);
    const updatedStoreSelections = [...storeSelections];
    updatedStoreSelections[index] = found ? found.store_id : '';

    const updatedProductSelections = [...productSelections];
    // Reset the product field for this index whenever store changes
    updatedProductSelections[index] = '';

    setStoreSelections(updatedStoreSelections);
    setProductSelections(updatedProductSelections);
    // const updated = [...storeSelections];
    // updated[index] = found ? found.store_id : '';
    // console.log
    // setStoreSelections(updated);
  };

  const handleProductChange = (index: number, value: string) => {
    // console.log(value)
    const match = value.match(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/);
    const productId = match ? match[0] : '';
    const selectedStoreId = storeSelections[index];
    const productList = productsByStore[selectedStoreId] || [];
    const found = productList.find((product) => product.product_id === productId);
    const updated = [...productSelections];
    console.log('Product ID:', productId);
    updated[index] = found ? found.product_id : '';
    setProductSelections(updated);
    console.log('updated:', updated);
  };

  const storeOptions = stores.map((store) => ({
    label: `${store.store_name} : ${store.city.name}, ${store.area.name} (ID: ${store.store_id.slice(0, 6)})`,
    value: store.store_id,
  }));

  console.log(products);

  // const getProductOptions = (storeId: string) =>
  //   (productsByStore[storeId] || []).map((product) => ({
  //     label: product.product_name,
  //     value: product.product_id,
  //   }));

  const getProductOptions = (storeId: string) =>
    (productsByStore[storeId] || []).map((product) => ({
      label: product.product_name,
      value: product.product_id,          // include SKU
      image: product.images ? product.images[0].image_url : 'https://picsum.photos/200',      // include product image URL
    }));

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Curation Module</h1>

      <div className="flex flex-wrap gap-6 mb-10 items-center">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Curation Name</label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-48"
            value={curationName}
            onChange={(e) => setCurationName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">View All URL Input</label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-64"
            value={viewAllUrl}
            onChange={(e) => setViewAllUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {rows.map((_, index) => {
          const storeId = storeSelections[index];
          // console.log('Store ID:', storeId);
          const storeName = stores.find((s) => s.store_id === storeId)?.store_name;
          const selectedStoreId = storeSelections[index];
          const productList = productsByStore[selectedStoreId] || [];
          const selectedProductId = productSelections[index];
          const productName = products.find((p) => p.product_id === selectedProductId)?.product_name;

          return (
            <div key={index} className="flex gap-4">
              <div className="w-64">
                {/* <input
                  list="store-options"
                  placeholder="Select or type store"
                  className={`border rounded px-4 py-2 w-full ${storeId ? 'border-green-400' : 'border-gray-300'}`}
                  // value={storeId ? `${storeName} (ID: ${storeId})` : ''}
                  value={storeName}
                  id={storeId}
                  onChange={(e) => handleStoreChange(index, e.target.value)}
                /> */}
                <Select
                  className={`border rounded w-64 ${storeId ? 'border-green-400' : 'border-gray-300'}`}
                  placeholder="Select Store"
                  options={storeOptions}
                  isClearable
                  value={storeOptions.find(opt => opt.value === storeSelections[index]) || null}
                  onChange={(selectedOption) => {
                    const updatedStoreSelections = [...storeSelections];
                    const updatedProductSelections = [...productSelections];
                    updatedStoreSelections[index] = selectedOption?.value || '';
                    updatedProductSelections[index] = ''; // Reset product on store change
                    setStoreSelections(updatedStoreSelections);
                    setProductSelections(updatedProductSelections);
                  }}
                />
              </div>

              {/* {curation_type === 'product' ? (
                <input
                  list={`product-options-${index}`}
                  placeholder="Select or type product"
                  className={`border rounded px-4 py-2 w-64 ${!storeId ? 'opacity-50 cursor-not-allowed' : ''} ${selectedProductId ? 'border-green-400' : 'border-gray-300'}`}
                  disabled={!storeId}
                  value={productName}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                />
              ) : (
                <input
                  className="border rounded px-4 py-2 w-64 opacity-50"
                  disabled
                  style={{ visibility: 'hidden' }}
                  placeholder="Select Product"
                />
              )} */}
              {curation_type === 'product' ? (
                <Select
                  className="w-64"
                  options={getProductOptions(storeSelections[index])}
                  isClearable
                  isDisabled={!storeSelections[index]}
                  value={getProductOptions(storeSelections[index]).find(opt => opt.value === productSelections[index]) || null}
                  onChange={(selectedOption) => {
                    const updated = [...productSelections];
                    updated[index] = selectedOption?.value || '';
                    setProductSelections(updated);
                  }}
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2">
                      {option.image && (
                        <img
                          src={option.image}
                          alt={option.label}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{option.label}</span>
                        {/* <span className="text-xs text-gray-500">{option.sku}</span> */}
                      </div>
                    </div>
                  )}
                />
              ) : (
                <input
                  className="border rounded px-4 py-2 w-64 opacity-50"
                  disabled
                  style={{ visibility: 'hidden' }}
                  placeholder="Select Product"
                />
              )}

              <input
                type="text"
                className="border rounded px-4 py-2 w-64"
                placeholder="Order"
              />
            </div>
          );
        })}
      </div>

      {/* <datalist id="store-options">
        {stores.map((store) => (
          <option key={store.store_id} value={`${store.store_name} (ID: ${store.store_id})`} />
        ))}
      </datalist>

      {rows.map((_, index) => {
        const selectedStoreId = storeSelections[index];
        const productList = productsByStore[selectedStoreId] || [];
        return (
          <datalist id={`product-options-${index}`} key={`product-list-${index}`}>
            {productList.map((product: Product) => (
              <option key={product.product_id} value={`${product.product_name} (ID: ${product.product_id})`} />
            ))}
          </datalist>
        );
      })} */}

      <div className="flex justify-between">
        <button className="bg-gray-300 text-black rounded-full px-6 py-2">Back</button>

        <div className="flex gap-4">
          <button
            onClick={handleEdit}
            disabled={!curation_id}
            className={`rounded-full px-6 py-2 ${curation_id ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Update
          </button>

          <button
            onClick={handleCreate}
            disabled={!!curation_id}
            className={`rounded-full px-6 py-2 ${!curation_id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
