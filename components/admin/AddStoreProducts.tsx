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
import customStyles from '@/utils/selectStyles';

interface Store {
  store_id: string;
  store_name: string;
  city: City;
  area: Area;
}

interface Category {
  category_id: string;
  name: string;
  image_url: string;
  category_landing_url: string;
}

interface Product {
  product_id: string;
  product_name: string;
  store_id: string;
  images: Image[];
}

const TOTAL_INPUTS = 10;

export default function AddStoreProduct() {
  const searchParams = useSearchParams();
  const curation_type = searchParams.get('curation_type');
  const curation_number = searchParams.get('curation_number');
  const curation_id = searchParams.get('curation_id');
  const curation_name = searchParams.get('curation_name');
  const curation_url = searchParams.get('curation_url');

  const rows = Array.from({ length: TOTAL_INPUTS });
  const [stores, setStores] = useState<Store[]>([]);
  const [storeSelections, setStoreSelections] = useState<string[]>(Array(9).fill(''));
  const [products, setProducts] = useState<Product[]>([]);
  const [productsByStore, setProductsByStore] = useState<Record<string, Product[]>>({});
  const [productSelections, setProductSelections] = useState<string[]>(Array(9).fill(''));
  const [curationName, setCurationName] = useState('');
  const [viewAllUrl, setViewAllUrl] = useState('');
  const [storesFromSection, setStoresFromSection] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categorySelections, setCategorySelections] = useState<{ category_id: string, image_url: string, category_landing_url: string }[]>(Array(TOTAL_INPUTS).fill({ category_id: '', image_url: '', category_landing_url: '' }));

  const router = useRouter();


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

    const fetchCategoriesBySection = async () => {
      try {
        const response = await api.get(`/homepage/categories_by_section/${curation_id}`);
        const fetchedSelections: { category_id: string; image_url: string, category_landing_url: string }[] = response.data;
        console.log(fetchedSelections, "fetchedSelections");

        // preload into selections
        const updatedSelections = [...categorySelections];
        for (let i = 0; i < fetchedSelections.length && i < updatedSelections.length; i++) {
          updatedSelections[i] = fetchedSelections[i];
        }
        setCategorySelections(updatedSelections);
      } catch (error) {
        console.error('Error fetching categories by section:', error);
      }
    };

    if (curation_type === 'product') {
      fetchStoresAndProductsBySection();
    }
    else if (curation_type === 'store') {
      fetchStoresBySection();
    }
    else {
      fetchCategoriesBySection();
    }

  }, [curation_id]);
  console.log(categories, "categories");

  // useEffect(() => {
  //   api
  //     .get('/stores/')
  //     .then((response) => {
  //       setStores(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching stores:', error);
  //     });
  // }, []);

  useEffect(() => {

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

    const fetchStores = async () => {
      api
        .get('/stores/')
        .then((response) => {
          setStores(response.data);
        })
        .catch((error) => {
          console.error('Error fetching stores:', error);
        });

    };

    const fetchSubCat = async (level: number) => {
      try {
        const response = await api.get(`categories/get_category_by_level/${level}`);
        const fetchedOptions: Category[] = response.data;
        setCategoryOptions(fetchedOptions);   // 👈 separate options state
      } catch (error) {
        console.error('Error fetching sub categories', error);
      }
    };


    if (curation_type === 'product') {
      fetchStores();
      fetchProducts();
    }
    else if (curation_type === 'store') {
      fetchStores();
    }
    else if (curation_type === 'subcat 3') {
      fetchSubCat(3);
    }
    else {
      fetchSubCat(4);
    }


  }, [curation_type]);



  const handleEdit = async () => {
    if (!curationName.trim() || !viewAllUrl.trim()) {
      alert('Curation name and View All URL are required.');
      return;
    }

    const selectedStoreIds = storeSelections.filter((id) => id);
    if (curation_type === 'product' || curation_type === 'store') {
      if (selectedStoreIds.length === 0) {
        alert('At least one valid store must be selected.');
        return;
      }
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

    if (curation_type === 'subcat 3' || curation_type === 'subcat 4') {
      const validCategories = categorySelections.filter(c => c.category_id && c.image_url);
      if (validCategories.length === 0) {
        alert('At least one valid category with image must be selected.');
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
      categories: categorySelections.filter(c => c.category_id && c.image_url && c.category_landing_url)
    };

    try {
      await api.put(`/homepage/section/${curation_id}`, payload);
      toast.success("Curation submitted successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Failed to update section.');
    }
  };

  const handleCreate = async () => {
    if (!curationName.trim() || !viewAllUrl.trim()) {
      alert('Curation name and View All URL are required.');
      return;
    }

    const selectedStoreIds = storeSelections.filter((id) => id);
    if (curation_type === 'product' || curation_type === 'store') {
      if (selectedStoreIds.length === 0) {
        alert('At least one valid store must be selected.');
        return;
      }
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
    if (curation_type === 'subcat 3' || curation_type === 'subcat 4') {
      const validCategories = categorySelections.filter(c => c.category_id && c.image_url);
      if (validCategories.length === 0) {
        alert('At least one valid category with image must be selected.');
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
      categories: categorySelections.filter(c => c.category_id && c.image_url && c.category_landing_url)
    };

    // return;

    try {
      await api.post('/homepage/section', payload);
      toast.success("Curation submitted successfully!");
      router.replace("/admin/curationModule/createCuration");

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to create section.");
    }
  };



  const storeOptions = stores.map((store) => ({
    label: `${store.store_name} : ${store.city?.name}, ${store.area?.name} (ID: ${store.store_id.slice(0, 6)})`,
    value: store.store_id,
  }));


  const getProductOptions = (storeId: string) =>
    (productsByStore[storeId] || []).map((product) => ({
      label: product.product_name,
      value: product.product_id,          // include SKU
      image: product.images.length > 0 ? product.images[0].image_url : 'https://picsum.photos/200',      // include product image URL
    }));

  // ✅ Move this helper inside your component
  const uploadCategoryImage = async (file: File): Promise<string | null> => {
    try {
      const response = await api.post<{
        upload_url: string;
        file_url: string;
      }>("/stores/upload", {
        file_name: file.name,
      });

      const { upload_url, file_url } = response.data;

      await api.put(upload_url, file, {
        headers: { "Content-Type": file.type || "application/octet-stream" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // optional: add per-category progress state
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      });

      return file_url;
    } catch (err: any) {
      toast.error(err.message || "Image upload failed.");
      return null;
    }
  };

  async function deleteImageFromS3(imageUrl: string) {
      try {
        await api.delete(`/products/delete_image`, {
          data: { file_url: imageUrl },
        });
      } catch (error) {
        console.error("Error deleting image from S3:", error);
      }
    }


  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Curation Module</h1>

      <div className="flex flex-wrap gap-6 mb-10 items-center">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-black">Curation Name</label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-48 placeholder:text-gray-400 text-black"
            value={curationName}
            onChange={(e) => setCurationName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-black">View All URL Input</label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-64 placeholder:text-gray-400 text-black"
            value={viewAllUrl}
            onChange={(e) => setViewAllUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {rows.map((_, index) => {
          const storeId = storeSelections[index];
          const selectedProductId = productSelections[index];
          const categoryId = categorySelections?.[index]?.category_id || "";
          const categoryImage = categorySelections?.[index]?.image_url || "";
          const categoryLandingUrl = categorySelections?.[index]?.category_landing_url || "";

          return (
            <div key={index} className="flex gap-4 items-center">
              {/* Store / Product Section */}
              {curation_type === "store" || curation_type === "product" ? (
                <>
                  {/* Store Dropdown */}
                  <div className="w-64">
                    <Select
                      className={`border rounded w-64 ${storeId ? "border-green-400" : "border-gray-300"
                        } text-black`}
                      placeholder="Select Store"
                      styles={customStyles}
                      options={storeOptions}
                      isClearable
                      value={
                        storeOptions.find((opt) => opt.value === storeId) || null
                      }
                      onChange={(selectedOption) => {
                        const updatedStoreSelections = [...storeSelections];
                        const updatedProductSelections = [...productSelections];
                        updatedStoreSelections[index] = selectedOption?.value || "";
                        updatedProductSelections[index] = ""; // Reset product on store change
                        setStoreSelections(updatedStoreSelections);
                        setProductSelections(updatedProductSelections);
                      }}
                    />
                  </div>

                  {/* Product Dropdown */}
                  {curation_type === "product" && (
                    <Select
                      className="w-64 text-black"
                      options={getProductOptions(storeId)}
                      styles={customStyles}
                      isClearable
                      isDisabled={!storeId}
                      value={
                        getProductOptions(storeId).find(
                          (opt) => opt.value === selectedProductId
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        const updated = [...productSelections];
                        updated[index] = selectedOption?.value || "";
                        setProductSelections(updated);
                      }}
                      formatOptionLabel={(option) => (
                        <div className="flex items-center gap-2">
                          {option.image && (
                            <img
                              src={option.image}
                              alt={option.label}
                              className="w-8 h-8 object-cover rounded object-top"
                            />
                          )}
                          <span className="font-medium text-sm text-black">
                            {option.label}
                          </span>
                        </div>
                      )}
                    />
                  )}
                </>
              ) : null}

              {/* Category + Image Section + Landing URL */}
              {(curation_type === "subcat 3" || curation_type === "subcat 4") && (
                <>
                  {/* Category Dropdown */}
                  <div className="w-64">
                    <Select
                      className="w-64 text-black"
                      styles={customStyles}
                      placeholder="Select Category"
                      isClearable
                      options={categoryOptions.map((cat) => ({
                        label: cat.name,
                        value: cat.category_id,
                      }))}
                      value={
                        categoryOptions.find((c) => c.category_id === categorySelections[index]?.category_id)
                          ? {
                            label: categoryOptions.find(
                              (c) => c.category_id === categorySelections[index]?.category_id
                            )?.name,
                            value: categorySelections[index]?.category_id,
                          }
                          : null
                      }
                      onChange={(selectedOption) => {
                        const updated = [...categorySelections];
                        updated[index] = {
                          ...updated[index],
                          category_id: selectedOption?.value || "",
                        };
                        setCategorySelections(updated);
                      }}
                    />
                  </div>
                  {/* Image Upload */}
                  <div className="flex flex-col items-start gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const uploadedUrl = await uploadCategoryImage(file);
                        if (!uploadedUrl) return;

                        const updated = [...categorySelections];
                        updated[index] = {
                          ...updated[index],
                          image_url: uploadedUrl,
                        };
                        setCategorySelections(updated);

                        toast.success("Image uploaded successfully!");
                      }}
                    />

                    {categoryImage && (
                      <div className="flex items-center gap-2">
                        <img
                          src={categoryImage}
                          alt="Uploaded"
                          className="w-16 h-16 object-cover rounded border"
                        />
                        {/* Delete button */}
                        <button
                          className="text-red-500 text-sm underline"
                          onClick={async () => {
                            try {
                              // await api.delete("/s3/delete-file", {
                              //   data: { fileUrl: categoryImage },
                              // });
                              await deleteImageFromS3(categoryImage);

                              const updated = [...categorySelections];
                              updated[index] = {
                                ...updated[index],
                                image_url: "",
                              };
                              setCategorySelections(updated);

                              toast.success("Image deleted successfully!");
                            } catch (err: any) {
                              toast.error(err.message || "Failed to delete image");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      className="border rounded px-4 py-2 w-64 text-black placeholder:text-gray-400"
                      placeholder="Category Landing URL"
                      value={categoryLandingUrl}
                      onChange={(e) => {
                        const updated = [...categorySelections];
                        updated[index] = {
                          ...updated[index],
                          category_landing_url: e.target.value,
                        };
                        setCategorySelections(updated);
                      }}
                    />
                  </div>


                </>
              )}

              {/* Order Field */}
              <input
                type="text"
                className="border rounded px-4 py-2 w-32 text-black placeholder:text-gray-400"
                placeholder="Order"
              />
            </div>
          );
        })}
      </div>


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
