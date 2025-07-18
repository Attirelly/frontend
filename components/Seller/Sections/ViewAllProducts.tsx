"use client";

import React, { use, useEffect, useState } from "react";
import { Table, Tag, Switch, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProductFilters from "@/components/ProductFilters";
import ProductTable from "@/components/ProductsTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/axios";
import { useSellerStore } from "@/store/sellerStore";
import type {
  ProductFiltersType,
  Product,
  FilterOptions,
} from "@/types/ProductTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function ProductsPage({
  batchId = null,
}: {
  batchId?: string | null;
}) {

  const {
    products,
    setProducts,
    filterOptions,
    setFilterOptions,
    hasFetchedProducts,
    setHasFetchedProducts,
    storeId,
  } = useSellerStore();

  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<ProductFiltersType>({
    category: [],
    pmCat: [],
    subCat1: [],
    subCat2: [],
    subCat3: [],
    size: [],
    color: [],
    // fabric: [],
    rentAvailable: null,
    status: [],
    // city: null,
    // subLocation: [],
    productName: [],
    sku: [],
    imageUploadStatus: null,
    source: [],
  });


  const router = useRouter()

  useEffect(() => {

    const fetchInitialData = async () => {
      try {
        const url = batchId
          ? `/products/products_by_store_async/${storeId}?batch_id=${batchId}`
          : `/products/products_by_store_async/${storeId}`;
        const res = await api.get(url); // Adjust this to your actual endpoint
        const json = res.data;
        setFilteredData(json.table_data);
        setProducts(json.table_data);
        setHasFetchedProducts(true);
        setFilterOptions({
          categories: json.categories,
          sizes: json.sizes,
          colors: json.colors,
          statuses: [],
          productNames: json.product_names,
          skus: json.skus,
          image_upload_statuses: [],
          source: [],
        });
        setIsReady(true);
      } catch (err) {
        setIsReady(true);
        console.error("Error fetching data", err);
      }
    };

    const sortedData = products.sort((a, b) => {
      if (a.status === true && b.status !== true) return -1;
      if (a.status !== true && b.status === true) return 1;
      return 0;
    });
    setProducts(sortedData);

    fetchInitialData();
  }, [
    hasFetchedProducts,
    setHasFetchedProducts,
    setProducts,
    setFilterOptions,
  ]);

    useEffect(() => {
    // Prefetch current page items
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const currentPageData = products.slice(start, end);
    currentPageData.forEach((product) => {
      router.prefetch(`/product_upload/${product.product_id}`);
    });
  }, [pagination, products]);



  const handleImageUpload = (record: Product) => {
    message.success(`Image uploaded for ${record.product_name}`);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (_: any, record: Product) => {
        console.log(record);
        const record_images = record?.images || [];

        const imageSrc =
          Array.isArray(record_images) && record_images.length > 0
            ? record_images[0]
            : "/window.svg"; // A fallback image stored in public folder
        console.log(imageSrc);
        return (
          <Image
            src={imageSrc}
            alt="product_image"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: "4px" }}
          />
        );
      },
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
    },
    {
      title: "System SKU ID",
      dataIndex: "sku",
    },
    {
      title: "Primary Category",
      render: (_: any, record: Product) => {
        const level1Category = record.category?.find(
          (cat: any) => cat.level === 1
        );
        return level1Category?.name || "-";
      },
    },
    {
      title: "Sub Category 1",
      render: (_: any, record: Product) => {
        const level1Category = record.category?.find(
          (cat: any) => cat.level === 2
        );
        return level1Category?.name || "-";
      },
    },
    {
      title: "Sub Category 2",
      render: (_: any, record: Product) => {
        const level1Category = record.category?.find(
          (cat: any) => cat.level === 3
        );
        return level1Category?.name || "-";
      },
    },
    {
      title: "Sub Category 3",
      render: (_: any, record: Product) => {
        const level1Category = record.category?.find(
          (cat: any) => cat.level === 4
        );
        return level1Category?.name || "-";
      },
    },
    {
      title: "Size",
      dataIndex: "size",
    },
    {
      title: "Color",
      dataIndex: "color",
    },
    {
      title: "MRP",
      dataIndex: "price",
    },
    {
      title: "Store Price",
      dataIndex: "price",
    },
    // {
    //   title: "Available for Rent",
    //   dataIndex: "rent",
    //   render: (rent: boolean) => (rent === true ? "Yes" : "No"),
    // },
    {
      title: "Source",
      dataIndex: "shopify_id",
      render: (shopify_id: string) =>
        shopify_id === null ? "Self" : "Shopify",
    },
    {
      title: "Status",
      dataIndex: "active",
      render: (status: Product["status"]) => (
        <Tag color={status === true ? "green" : "volcano"}>
          {status === true ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Image Upload",
      render: (_: any, record: Product) => (
        // <Upload showUploadList={false}>
          <Button
            icon={<UploadOutlined />}
            onClick={() => handleImageUpload(record)}
          >
            Upload
          </Button>
        // </Upload>
      ),
    },
  ];

  const result = products.filter((item) => {
    const primaryCat =
      item.category?.find((cat) => cat.level === 1)?.name || "";
    const sub_Cat1 = item.category?.find((cat) => cat.level === 2)?.name || "";
    const sub_Cat2 = item.category?.find((cat) => cat.level === 3)?.name || "";
    const sub_Cat3 = item.category?.find((cat) => cat.level === 4)?.name || "";
    const derivedSource = item.shopify_id === null ? "Self" : "Shopify";
    console.log(item.shopify_id, derivedSource)

    return (
      (!filters.pmCat.length || filters.pmCat.includes(primaryCat)) &&
      // (!filters.subCat1.length || filters.subCat1.includes(sub_Cat1)) &&
      (!filters.subCat2.length || filters.subCat2.includes(sub_Cat2)) &&
      (!filters.subCat3.length || filters.subCat3.includes(sub_Cat3)) &&
      (!filters.size.length || filters.size.includes(item.size)) &&
      (!filters.color.length || filters.color.includes(item.color)) &&
      // (filters.rentAvailable === null || filters.rentAvailable === item.rent) &&
      (!filters.status.length || filters.status.includes(item.status)) &&
      (!filters.productName.length ||
        filters.productName.includes(item.product_name)) &&
      (!filters.sku.length || filters.sku.includes(item.sku)) &&
      (!filters.imageUploadStatus ||
        filters.imageUploadStatus === item.imageUploadStatus) && 
      (!filters.source.length || filters.source.includes(derivedSource))
    );
  });
  console.log(filters);



  if (!isReady || !filterOptions) {
    return <LoadingSpinner />;
  }
  return (
    // <div style={{ display: "flex-col" }} className="space-y-4 flex-col">
    <div style={{ display: "flex-col" }} className="space-y-4 flex-col w-4xl">
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
      />
      <div style={{ flexGrow: 1 }}>
        <h3>Products</h3>
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
              // router.push(`/product_upload/${record.product_id}`);
              window.open(`/product_upload/${record.product_id}`, '_blank', 'noopener,noreferrer');
            },
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
}
