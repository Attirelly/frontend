"use client";
import { api } from "@/lib/axios";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
}
interface StoreType {
  id: string;
  store_type: string;
}

interface Outfit {
  id: string;
  name: string;
}

interface Gender {
  id: string;
  gender_value: string;
}

interface PriceRange {
  id: string;
  label: string;
}

interface AgeGroup {
  id: string;
  label: string;
  active: boolean;
}

interface LocationField {
  id: string;
  name: string;
}

interface StoreOptions {
  store_types: StoreType[];
  outfits: Outfit[];
  genders: Gender[];
  price_ranges: PriceRange[];
  age_groups: AgeGroup[];
  areas: LocationField[];
  cities: LocationField[];
  states: LocationField[];
  countries: LocationField[];
}

interface FormData {
  // Basic info
  store_owner_id: string;
  qr_id: string | null;
  store_name: string;
  store_address: string | null;
  rental: boolean;
  registered_email: string | null;
  mobile: string | null;
  latitude: number | null;
  longitude: number | null;
  active: boolean;

  // Social/URL fields
  shopify_url: string | null;
  instagram_link: string | null;
  facebook_link: string | null;
  whatsapp_number: string | null;

  // Image fields
  listing_page_image: string | null;
  profile_image: string | null;
  home_page_image: string | null;

  // Pricing
  average_price_min: number | null;
  average_price_max: number | null;

  // Relationships
  seller: User | null;
  store_types: StoreType[];
  outfits: Outfit[];
  genders: Gender[];
  price_ranges: PriceRange[];
  age_groups: AgeGroup[];

  // Location
  area: LocationField | null;
  city: LocationField | null;
  state: LocationField | null;
  country: LocationField | null;
}

export default function StoreFormPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [storeOptions, setStoreOptions] = useState<StoreOptions | null>(null);
  const [formData, setFormData] = useState<FormData>({
    store_owner_id: "",
    qr_id: null,
    store_name: "",
    store_address: null,
    rental: false,
    registered_email: null,
    mobile: null,
    latitude: null,
    longitude: null,
    active: true,
    shopify_url: null,
    instagram_link: null,
    facebook_link: null,
    whatsapp_number: null,
    listing_page_image: null,
    profile_image: null,
    home_page_image: null,
    average_price_min: null,
    average_price_max: null,
    seller: null,
    store_types: [],
    outfits: [],
    genders: [],
    price_ranges: [],
    age_groups: [],
    area: null,
    city: null,
    state: null,
    country: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, optionsRes] = await Promise.all([
          api.get(`/stores/${id}`),
          api.get("/stores/all_store_options/"),
        ]);

        console.log("store_data", storeRes.data);

        setStoreOptions(optionsRes.data);

        // Set form data from API response
        if (storeRes.data) {
          setFormData({
            store_owner_id: storeRes.data.store_owner_id || "",
            qr_id: storeRes.data.qr_id || null,
            store_name: storeRes.data.store_name || "",
            store_address: storeRes.data.store_address || null,
            rental: storeRes.data.rental ?? false, // Using nullish coalescing
            registered_email: storeRes.data.registered_email || null,
            mobile: storeRes.data.mobile || null,
            latitude: storeRes.data.latitude ?? null,
            longitude: storeRes.data.longitude ?? null,
            active: storeRes.data.active ?? true, // Using nullish coalescing
            shopify_url: storeRes.data.shopify_url || null,
            instagram_link: storeRes.data.instagram_link || null,
            facebook_link: storeRes.data.facebook_link || null,
            whatsapp_number: storeRes.data.whatsapp_number || null,
            listing_page_image: storeRes.data.listing_page_image || null,
            profile_image: storeRes.data.profile_image || null,
            home_page_image: storeRes.data.home_page_image || null,
            average_price_min: storeRes.data.average_price_min ?? null,
            average_price_max: storeRes.data.average_price_max ?? null,
            seller: storeRes.data.seller || null,
            store_types: storeRes.data.store_types || [],
            outfits: storeRes.data.outfits || [],
            genders: storeRes.data.genders || [],
            price_ranges: storeRes.data.price_ranges || [],
            age_groups: storeRes.data.age_groups || [],
            area: storeRes.data.area || null,
            city: storeRes.data.city || null,
            state: storeRes.data.state || null,
            country: storeRes.data.country || null,
          });
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    if (!storeOptions) return;

    // Handle location fields differently

    if (["areas", "cities", "states", "countries"].includes(field)) {
      const options = storeOptions[
        `${field}` as keyof StoreOptions
      ] as LocationField[];
      const selectedOption = options.find((opt) => opt.id === value) || null;
      let formField = "";
      if (field === "countries") formField = "country";
      else if (field === "states") formField = "state";
      else if (field === "cities") formField = "city";
      else formField = "area";

      setFormData((prev) => ({
        ...prev,

        [formField]: selectedOption,
      }));
      return;
    }

    // Handle multi-select fields (store_types, outfits, etc.)

    const options = storeOptions[field as keyof StoreOptions] as Array<{
      id: string;
    }>;
    const selectedOption = options.find((opt) => opt.id === value);

    if (
      selectedOption &&
      !formData[field].some((item: any) => item.id === value)
    ) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], selectedOption],
      }));
    }
  };

  const handleRemoveTag = (field: string, id: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item: any) => item.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log("submit form data", formData);

      await api.put(`/stores/${id}`, formData);
      setMode("view");
      toast.success("Store updated successfully")
    } catch (err) {
      setError("Failed to save changes");
      toast.error("Store not successful")
      console.error("Error saving data:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Re-fetch original data
    api.get(`/stores/${id}`).then((res) => {
      setFormData(res.data);
      setMode("view");
    });
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  if (loading)
    return <div className="text-center py-8">Loading store data...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!storeOptions)
    return <div className="text-center py-8">No store options available</div>;

  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          {mode === "view" ? "Store Details" : "Edit Store"}
          <span className="block text-sm font-normal text-gray-500 mt-1">
            Store ID: {id}
          </span>
        </h1>

        <div className="flex space-x-3">
          {mode === "view" ? (
            <button
              onClick={() => setMode("edit")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
            >
              Edit Store
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition flex items-center disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="store-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      <form
        id="store-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Basic Info */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              name="store_name"
              value={formData.store_name}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seller Name
            </label>
            <input
              type="text"
              name="seller_name"
              value={formData.seller?.name}
              onChange={handleInputChange}
              disabled 
              className= "w-full px-4 py-2 border rounded-lg bg-gray-100 "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Address
            </label>
            <input
              type="text"
              name="store_address"
              value={formData.store_address}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="registered_email"
              value={formData.registered_email}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6  pb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shopify URL
              </label>
              <input
                type="url"
                name="shopify_url"
                value={formData.shopify_url || ""}
                onChange={handleInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 border rounded-lg ${
                  mode === "view" ? "bg-gray-100" : "bg-white"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram Link
              </label>
              <input
                type="url"
                name="instagram_link"
                value={formData.instagram_link || ""}
                onChange={handleInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 border rounded-lg ${
                  mode === "view" ? "bg-gray-100" : "bg-white"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Link
              </label>
              <input
                type="url"
                name="facebook_link"
                value={formData.facebook_link || ""}
                onChange={handleInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 border rounded-lg ${
                  mode === "view" ? "bg-gray-100" : "bg-white"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsapp_number"
                value={formData.whatsapp_number || ""}
                onChange={handleInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 border rounded-lg ${
                  mode === "view" ? "bg-gray-100" : "bg-white"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rental"
            name="rental"
            checked={formData.rental || false}
            onChange={handleCheckboxChange}
            disabled={mode === "view"}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="rental"
            className="block text-sm font-medium text-gray-700"
          >
            Rental Store
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active || false}
            onChange={handleCheckboxChange}
            disabled={mode === "view"}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="active"
            className="block text-sm font-medium text-gray-700"
          >
            Active Store
          </label>
        </div>

        {/* Image URLs Section */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6  pb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Listing Page Image URL
            </label>
            <input
              type="url"
              name="listing_page_image"
              value={formData.listing_page_image || ""}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL
            </label>
            <input
              type="url"
              name="profile_image"
              value={formData.profile_image || ""}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Page Image URL
            </label>
            <input
              type="url"
              name="home_page_image"
              value={formData.home_page_image || ""}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6  pb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average Price Min
            </label>
            <input
              type="number"
              name="average_price_min"
              value={formData.average_price_min || ""}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average Price Max
            </label>
            <input
              type="number"
              name="average_price_max"
              value={formData.average_price_max || ""}
              onChange={handleInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>
        </div>

        {/* Location Fields */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              value={formData.country?.id || ""}
              onChange={(e) => handleSelectChange("countries", e.target.value)}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            >
              <option value="">Select Country</option>
              {storeOptions.countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              value={formData.state?.id || ""}
              onChange={(e) => handleSelectChange("states", e.target.value)}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            >
              <option value="">Select State</option>
              {storeOptions.states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              value={formData.city?.id || ""}
              onChange={(e) => handleSelectChange("cities", e.target.value)}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            >
              <option value="">Select City</option>
              {storeOptions.cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <select
              value={formData.area?.id || ""}
              onChange={(e) => handleSelectChange("areas", e.target.value)}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 border rounded-lg ${
                mode === "view" ? "bg-gray-100" : "bg-white"
              }`}
            >
              <option value="">Select Area</option>
              {storeOptions.areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Store Types */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Types
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.store_types.map((item) => (
              <span
                key={item.id}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {item.store_type}
                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag("store_types", item.id)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
          {mode === "edit" && (
            <select
              onChange={(e) =>
                handleSelectChange("store_types", e.target.value)
              }
              className="w-full px-4 py-2 border rounded-lg text-sm shadow-sm"
              value=""
            >
              <option value="">Add Store Type</option>
              {storeOptions.store_types
                .filter(
                  (opt) =>
                    !formData.store_types.some((item) => item.id === opt.id)
                )
                .map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.store_type}
                  </option>
                ))}
            </select>
          )}
        </div>
        {/* Other Tag Fields (Outfits, Genders, etc.) */}
        {(["outfits", "genders", "price_ranges", "age_groups"] as const).map(
          (field) => (
            <div key={field} className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace(/_/g, " ")}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData[field].map((item) => (
                  <span
                    key={item.id}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {"name" in item
                      ? item.name
                      : "label" in item
                      ? item.label
                      : item.gender_value}
                    {mode === "edit" && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(field, item.id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {mode === "edit" && (
                <select
                  onChange={(e) => handleSelectChange(field, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-sm shadow-sm"
                  value=""
                >
                  <option value="">Add {field.replace(/_/g, " ")}</option>
                  {storeOptions[field as keyof StoreOptions]
                    .filter(
                      (opt: any) =>
                        !formData[field].some((item: any) => item.id === opt.id)
                    )
                    .map((option: any) => (
                      <option key={option.id} value={option.id}>
                        {"name" in option
                          ? option.name
                          : "label" in option
                          ? option.label
                          : option.gender_value}
                      </option>
                    ))}
                </select>
              )}
            </div>
          )
        )}
      </form>
    </div>
  );
}
