"use client";

import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProductFilters from "@/components/ProductFilters";
import ProductTable from "@/components/ProductsTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/axios";
import { useSellerStore } from "@/store/sellerStore";
import type { ProductFiltersType, Product } from "@/types/ProductTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormActions } from "@/store/product_upload_store";
/**
 * @interface ProductVariantIDs
 * @description Defines the structure for identifying a specific product variant for bulk actions.
 */
interface ProductVariantIDs {
  product_id: string;
  variant_id: string;
}

/**
 * A comprehensive page component for viewing, filtering, and managing a seller's products.
 *
 * This component displays a paginated and filterable table of all products associated with a
 * seller. It is designed to handle two main scenarios: viewing all products for a store or
 * viewing the results of a specific bulk upload or Shopify sync job (via the optional `batchId`).
 * It includes features for client-side filtering, bulk status updates (activate/deactivate),
 * and quick links to edit a product or upload its images.
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the UI, including the `pagination` object for the table, the active `filters`, the `selectedRowKeys` for bulk actions, and the `loading` state for API calls.
 * - **Global State (`useSellerStore`)**: It heavily relies on the Zustand `sellerStore` to persist the main list of `products`, `filterOptions`, and the `storeId`. This prevents re-fetching data unnecessarily when the component re-mounts.
 *
 * ### API Endpoints
 * **`GET /products/products_by_store/:storeId`**: Fetches the list of all products for a given store. Can optionally be filtered to a specific batch job.
 * - **`:storeId`** (string): The ID of the seller's store.
 * - **`batch_id`** (query param, string, optional): The ID of a specific bulk upload job.
 *
 * **`POST /products/bulk_product_status_change`**: Updates the active/inactive status for a list of selected product variants.
 * - **Request Body**: `{ rows: ProductVariantIDs[], status: boolean }`
 *
 * @param {object} props - The props for the component.
 * @param {string | null} [props.batchId] - An optional ID for a bulk upload batch to display.
 * @returns {JSX.Element} A full-featured product management page with a table and filters.
 * @see {@link ProductFilters}
 * @see {@link ProductTable}
 * @see {@link https://ant.design/components/table | Ant Design Table}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
export default function ViewAllProducts({
  batchId = null,
}: {
  batchId?: string | null;
}) {
  const { setCurrentStep } = useFormActions();
  const {
    products,
    setProducts,
    filterOptions,
    setFilterOptions,
    hasFetchedProducts,
    setHasFetchedProducts,
    storeId,
  } = useSellerStore();

  const [isReady, setIsReady] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 30 });
  const [filters, setFilters] = useState<ProductFiltersType>({
    category: [],
    pmCat: [],
    subCat1: [],
    subCat2: [],
    subCat3: [],
    size: [],
    color: [],
    rentAvailable: null,
    status: [],
    productName: [],
    sku: [],
    imageUploadStatus: null,
    source: [],
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<ProductVariantIDs[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * This effect handles the initial data fetching for the component.
   * It runs only if data hasn't been fetched before (`hasFetchedProducts` is false)
   * or if a specific `batchId` is provided.
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!storeId) return; // Prevent API call if storeId is not available yet
      try {
        setIsReady(false);
        const url = batchId
          ? `/products/products_by_store/${storeId}?batch_id=${batchId}`
          : `/products/products_by_store/${storeId}`;
        const res = await api.get(url);
        const json = res.data;

        const sortedData = (json.table_data || []).sort(
          (a: Product, b: Product) => {
            if (a.status === true && b.status !== true) return -1;
            if (a.status !== true && b.status === true) return 1;
            return 0;
          }
        );

        setProducts(sortedData);
        setHasFetchedProducts(true);
        setFilterOptions({
          categories: json.categories || [],
          sizes: json.sizes || [],
          colors: json.colors || [],
          statuses: [],
          productNames: json.product_names || [],
          skus: json.skus || [],
          image_upload_statuses: [],
          source: [],
        });
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setIsReady(true);
      }
    };

    if (!hasFetchedProducts) {
      fetchInitialData();
    } else {
      setIsReady(true);
    }
  }, [
    storeId,
    batchId,
    hasFetchedProducts,
    setProducts,
    setFilterOptions,
    setHasFetchedProducts,
  ]);

  /**
   * Navigates the user to the media upload step for a specific product.
   * @param {Product} record - The product record from the table row.
   */
  const handleImageUpload = (record: Product) => {
    window.open(
      `/product_upload/${record.product_id}?step=6`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /**
   * Handles the bulk status change (Activate/Deactivate) for selected products.
   * @param {boolean} status - The new status to apply (true for Active, false for Inactive).
   */
  const handleBulkStatusChange = async (status: boolean) => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one product");
      return;
    }
    setLoading(true);
    try {
      await api.post("/products/bulk_product_status_change", {
        rows: selectedRowKeys,
        status: status,
      });
        // Optimistically update the UI to reflect the change immediately.
      const updatedProducts = products.map((product) => {
        const isSelected = selectedRowKeys.some(
          (selected) => selected.variant_id === product.variant_id
        );
        return isSelected ? { ...product, status } : product;
      });
      setProducts(updatedProducts);
      setSelectedRowKeys([]);
      message.success(
        `Successfully updated ${selectedRowKeys.length} product(s).`
      );
    } catch (error) {
      message.error("Failed to update product statuses");
    } finally {
      setLoading(false);
    }
  };
  // --- Ant Design Table Column Definitions ---
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (_: any, record: Product) => {
        const imageSrc = record?.images?.[0] || "/placeholder.svg";
        return (
          <Image
            src={imageSrc}
            alt={record.product_name || "Product Image"}
            width={50}
            height={50}
            className="object-cover rounded-md aspect-square object-top"
          />
        );
      },
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      className: "text-xs sm:text-sm",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      className: "hidden lg:table-cell text-xs sm:text-sm", // Hidden on mobile and tablet
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a: Product, b: Product) => a.price - b.price,
      className: "hidden md:table-cell text-xs sm:text-sm", // Hidden on mobile
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: boolean) => (
        <Tag color={status ? "green" : "volcano"} className="text-xs">
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Upload Images",
      className: "hidden md:table-cell", // Hidden on mobile
      render: (_: any, record: Product) => (
        <Button
          icon={<UploadOutlined />}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleImageUpload(record);
          }}
        >
          Upload
        </Button>
      ),
    },
  ];

  // Client-side filtering logic based on the `filters` state.
  const result = products.filter((item) => {
    const primaryCat =
      item.category?.find((cat) => cat.level === 1)?.name || "";
    const sub_Cat2 = item.category?.find((cat) => cat.level === 3)?.name || "";
    const sub_Cat3 = item.category?.find((cat) => cat.level === 4)?.name || "";
    const derivedSource = item.shopify_id === null ? "Self" : "Shopify";

    return (
      (!filters.pmCat.length || filters.pmCat.includes(primaryCat)) &&
      (!filters.subCat2.length || filters.subCat2.includes(sub_Cat2)) &&
      (!filters.subCat3.length || filters.subCat3.includes(sub_Cat3)) &&
      (!filters.size.length || filters.size.includes(item.size)) &&
      (!filters.color.length || filters.color.includes(item.color)) &&
      (!filters.status.length || filters.status.includes(item.status)) &&
      (!filters.productName.length ||
        filters.productName.includes(item.product_name)) &&
      (!filters.sku.length || filters.sku.includes(item.sku)) &&
      (!filters.source.length || filters.source.includes(derivedSource))
    );
  });

  if (!isReady || !filterOptions) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
      />

      {/* Responsive Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            type="primary"
            onClick={() => handleBulkStatusChange(true)}
            disabled={selectedRowKeys.length === 0}
            loading={loading}
            className="w-full sm:w-auto"
          >
            Activate Selected
          </Button>
          <Button
            danger
            onClick={() => handleBulkStatusChange(false)}
            disabled={selectedRowKeys.length === 0}
            loading={loading}
            className="w-full sm:w-auto"
          >
            Deactivate Selected
          </Button>
        </div>
        <span className="text-sm text-gray-600 text-center sm:text-right">
          {selectedRowKeys.length > 0
            ? `Selected ${selectedRowKeys.length} items`
            : ""}
        </span>
      </div>

      <div className="flex-grow bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-black mb-4">Products</h3>
        <ProductTable
          columns={columns}
          data={result}
          rowKey={"variant_id"}
          pagination={pagination}
          onPaginationChange={(page, pageSize) =>
            setPagination({ current: page, pageSize })
          }
          onRow={(record) => ({
            onClick: () => {
              window.open(
                `/product_upload/${record.product_id}`,
                "_blank",
                "noopener,noreferrer"
              );
            },
            style: { cursor: "pointer" },
          })}
          rowSelection={{
            onChange: (_, selectedRows) => {
              const selectedProductIds = selectedRows.map((row) => ({
                product_id: String(row.product_id ?? ""),
                variant_id: String(row.variant_id ?? ""),
              }));
              setSelectedRowKeys(selectedProductIds);
            },
          }}
        />
      </div>
    </div>
  );
}
