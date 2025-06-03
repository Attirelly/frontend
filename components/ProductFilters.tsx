// components/ProductFilters.tsx

"use client";

import React from "react";
import { Select, Input } from "antd";
import type { ProductFiltersType } from "@/types/ProductTypes";

const { Option } = Select;
const { Search } = Input;

const cityToSubLocation: Record<string, string[]> = {
  Mumbai: ["Andheri", "Bandra"],
  Delhi: ["Saket", "Rohini"],
  Bangalore: ["Indiranagar", "Whitefield"],
};

type ProductFiltersProps = {
  filters: ProductFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<ProductFiltersType>>;
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
}) => {
  return (
    <div style={{ width: "280px", marginRight: 20 }}>
      <h3>Filters</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Select
          mode="multiple"
          placeholder="Category"
          onChange={(v) => setFilters({ ...filters, category: v })}
        >
          {["Clothing", "Footwear", "Accessories"].map((cat) => (
            <Option key={cat}>{cat}</Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Size"
          onChange={(v) => setFilters({ ...filters, size: v })}
        >
          {["S", "M", "L", "XL"].map((s) => (
            <Option key={s}>{s}</Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Color"
          onChange={(v) => setFilters({ ...filters, color: v })}
        >
          {["Red", "Blue", "Green", "Black"].map((c) => (
            <Option key={c}>{c}</Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Fabric"
          onChange={(v) => setFilters({ ...filters, fabric: v })}
        >
          {["Cotton", "Linen", "Silk"].map((f) => (
            <Option key={f}>{f}</Option>
          ))}
        </Select>

        <Select
          placeholder="Available for Rent"
          allowClear
          onChange={(v) =>
            setFilters({
              ...filters,
              rentAvailable: v === undefined ? null : v,
            })
          }
          value={filters.rentAvailable}
        >
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>

        <Select
          mode="multiple"
          placeholder="Status"
          onChange={(v) => setFilters({ ...filters, status: v })}
        >
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>

        <Select
          placeholder="City"
          allowClear // <== add this to allow clearing
          onChange={(v) =>
            setFilters({ ...filters, city: v ?? null, subLocation: [] })
          }
          value={filters.city}
        >
          {Object.keys(cityToSubLocation).map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Sub-location"
          value={filters.subLocation}
          onChange={(v) => setFilters({ ...filters, subLocation: v })}
          disabled={!filters.city}
        >
          {filters.city &&
            cityToSubLocation[filters.city].map((subloc) => (
              <Option key={subloc}>{subloc}</Option>
            ))}
        </Select>

        <Search
          placeholder="Product Name"
          onSearch={(v) => setFilters({ ...filters, productName: v })}
          allowClear
        />

        <Search
          placeholder="SKU ID"
          onSearch={(v) => setFilters({ ...filters, sku: v })}
          allowClear
        />

        <Select
          placeholder="Image Upload Status"
          allowClear
          onChange={(v) => setFilters({ ...filters, imageUploadStatus: v })}
        >
          <Option value="Completed">Completed</Option>
          <Option value="Pending">Pending</Option>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;