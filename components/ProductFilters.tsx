"use client";

import React from "react";
import { Select, Input } from "antd";
import type { ProductFiltersType, FilterOptions } from "@/types/ProductTypes";

const { Option } = Select;
const { Search } = Input;

type ProductFiltersProps = {
  filters: ProductFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<ProductFiltersType>>;
  filterOptions: FilterOptions;
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  filterOptions,
}) => {
  return (
    <div style={{ width: "100%", marginRight: 20 }}>
      <h3>Filters</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <Select
          mode="multiple"
          placeholder="Primary Category"
          value={filters.pmCat}
          onChange={(v) => setFilters({ ...filters, pmCat: v })}
        >
          {filterOptions.categories
            .filter((cat) => cat.level === 1)
            .map((cat) => (
              <Option key={cat.category_id} value={cat.name}>{cat.name}</Option>
            ))}
        </Select>

        {/* <Select
          mode="multiple"
          placeholder="Sub Category 1"
          value={filters.subCat1}
          onChange={(v) => setFilters({ ...filters, subCat1: v })}
        >
          {filterOptions.categories
            .filter((cat) => cat.level === 2)
            .map((cat) => (
              <Option key={cat.category_id} value={cat.name}>{cat.name}</Option>
            ))}
        </Select> */}

        <Select
          mode="multiple"
          placeholder="Sub Category 2"
          value={filters.subCat2}
          onChange={(v) => setFilters({ ...filters, subCat2: v })}
        >
          {filterOptions.categories
            .filter((cat) => cat.level === 3)
            .map((cat) => (
              <Option key={cat.category_id} value={cat.name}>{cat.name}</Option>
            ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Sub Category 3"
          value={filters.subCat3}
          onChange={(v) => setFilters({ ...filters, subCat3: v })}
        >
          {filterOptions.categories
            .filter((cat) => cat.level === 4)
            .map((cat) => (
              <Option key={cat.category_id} value={cat.name}>{cat.name}</Option>
            ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Size"
          value={filters.size}
          onChange={(v) => setFilters({ ...filters, size: v })}
        >
          {filterOptions.sizes.map((s) => (
            <Option key={s}>{s}</Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Color"
          value={filters.color}
          onChange={(v) => setFilters({ ...filters, color: v })}
        >
          {filterOptions.colors.map((c) => (
            <Option key={c}>{c}</Option>
          ))}
        </Select>

        {/* <Select
          mode="multiple"
          placeholder="Fabric"
          onChange={(v) => setFilters({ ...filters, fabric: v })}
        >
          {["Cotton", "Linen", "Silk"].map((f) => (
            <Option key={f}>{f}</Option>
          ))}
        </Select> */}

        {/* <Select
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
        </Select> */}

        <Select
          mode="multiple"
          placeholder="Status"
          onChange={(v) => setFilters({ ...filters, status: v })}
        >
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>

        {/* <Select
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
        </Select> */}

        {/* <Select
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
        </Select> */}

        <Select
          mode="multiple"
          placeholder="Product Name"
          value={filters.productName}
          onChange={(v) => setFilters({ ...filters, productName: v })}
        >
          {filterOptions.productNames.map((c) => (
            <Option key={c}>{c}</Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="SKU"
          value={filters.sku}
          onChange={(v) => setFilters({ ...filters, sku: v })}
        >
          {filterOptions.skus.map((c) => (
            <Option key={c}>{c}</Option>
          ))}
        </Select>


        {/* <Search
          placeholder="Product Name"
          onSearch={(v) => setFilters({ ...filters, productName: v })}
          allowClear
        >
        </Search> */}

        {/* <Search
          placeholder="SKU ID"
          onSearch={(v) => setFilters({ ...filters, sku: v })}
          allowClear
        >
        </Search> */}

        <Select
          placeholder="Image Upload Status"
          allowClear
          onChange={(v) => setFilters({ ...filters, imageUploadStatus: v })}
        >
          <Option value="Completed">Completed</Option>
          <Option value="Pending">Pending</Option>
        </Select>

        <Select
          mode="multiple"
          placeholder="Source"
          onChange={(v) => setFilters({ ...filters, source: v })}
        >
          <Option value="Self">Self</Option>
          <Option value="Shopify">Shopify</Option>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;