"use client";

import React, { use,useEffect, useState } from "react";
import { Table, Tag, Switch, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProductFilters from "@/components/ProductFilters";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api } from "@/lib/axios"
import { useParams } from 'next/navigation';
import type { ProductFiltersType, Product, FilterOptions } from "@/types/ProductTypes";

// type Props = {
//   params: { id: string };
// };


export default function ProductsPage() {
  // const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id as string;
  console.log(id)
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
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
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    sizes: [],
    colors: [],
    statuses: [],
    productNames: [],
    skus: [],
    image_upload_statuses: [],
  });

  useEffect(() => {
    // const dummyData = generateDummyData();

    const fetchInitialData = async () => {
      try {
        const res = await api.get(`/products/products_by_store/${id}`); // Adjust this to your actual endpoint
        const json = res.data;
        setData(json.table_data);
        setFilteredData(json.table_data);
        setFilterOptions({
          categories: json.categories,
          sizes: json.sizes,
          colors: json.colors,
          statuses: [],
          productNames: json.product_names,
          skus: json.skus,
          image_upload_statuses: []
        });
        setIsReady(true);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    const sortedData = data.sort((a, b) => {
      if (a.status === true && b.status !== true) return -1;
      if (a.status !== true && b.status === true) return 1;
      return 0;
    });
    setData(sortedData);

    fetchInitialData();
  }, []);

  const handleImageUpload = (record: Product) => {
    message.success(`Image uploaded for ${record.product_name}`);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (img: string) => <img src={img} alt="" width={60} />,
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
        const level1Category = record.category?.find((cat: any) => cat.level === 1);
        return level1Category?.name || "-";
      }
    },
    {
      title: "Sub Category 1",
      render: (_: any, record: Product) => {
        const level1Category = record.category?.find((cat: any) => cat.level === 2);
        return level1Category?.name || "-";
      }
    },
    {
      title: "Sub Category 2",
      render: (_: any, record: Product) => {
        const level1Category = record.category?.find((cat: any) => cat.level === 3);
        return level1Category?.name || "-";
      }
    },
    {
      title: "Sub Category 3",
      render: (_: any, record: Product) => {
        const level1Category = record.category?.find((cat: any) => cat.level === 4);
        return level1Category?.name || "-";
      }
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
    {
      title: "Available for Rent",
      dataIndex: "rent",
      render: (val: boolean) => <Switch checked={val} disabled />,
    },
    {
      title: "Source",
      dataIndex: "shopify_id",
      render: (shopify_id: string) => shopify_id === null ? "Self" : "Shopify"

    },
    {
      title: "Status",
      dataIndex: "active",
      render: (status: Product["status"]) => (
        <Tag color={status === true ? "green" : "volcano"}>{status === true ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Image Upload",
      render: (_: any, record: Product) => (
        <Upload showUploadList={false}>
          <Button icon={<UploadOutlined />} onClick={() => handleImageUpload(record)}>
            Upload
          </Button>
        </Upload>
      ),
    },
  ];

  const result = data.filter((item) => {
    const primaryCat = item.category?.find((cat) => cat.level === 1)?.name || "";
    const sub_Cat1 = item.category?.find((cat) => cat.level === 2)?.name || "";
    const sub_Cat2 = item.category?.find((cat) => cat.level === 3)?.name || "";
    const sub_Cat3 = item.category?.find((cat) => cat.level === 4)?.name || "";

    return (
      (!filters.pmCat.length || filters.pmCat.includes(primaryCat)) &&
      (!filters.subCat1.length || filters.subCat1.includes(sub_Cat1)) &&
      (!filters.subCat2.length || filters.subCat2.includes(sub_Cat2)) &&
      (!filters.subCat3.length || filters.subCat3.includes(sub_Cat3)) &&
      (!filters.size.length || filters.size.includes(item.size)) &&
      (!filters.color.length || filters.color.includes(item.color)) &&
      // (!filters.fabric.length || filters.fabric.includes(item.fabric)) &&
      (filters.rentAvailable === null || filters.rentAvailable === item.rent) &&
      (!filters.status.length || filters.status.includes(item.status)) &&
      // (!filters.city || item.city === filters.city) &&
      // (!filters.subLocation.length || filters.subLocation.includes(item.subLocation)) &&
      // (!filters.productName || item.name.toLowerCase().includes(filters.productName.toLowerCase())) &&
      (!filters.productName.length || filters.productName.includes(item.product_name)) &&
      // (!filters.sku || item.sku.toLowerCase().includes(filters.sku.toLowerCase())) &&
      (!filters.sku.length || filters.sku.includes(item.sku)) &&
      (!filters.imageUploadStatus || filters.imageUploadStatus === item.imageUploadStatus)
    );
  });


  if (!isReady) {
    return <LoadingSpinner />;
  }
  return (
    <div style={{ display: "flex", padding: 20 }}>
      <ProductFilters filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
      <div style={{ flexGrow: 1, paddingLeft: 20 }}>
        <h3>Products</h3>
        <Table
          columns={columns}
          dataSource={result}
          rowKey={"variant_id"}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,  // Default page size
            showSizeChanger: true, // Enables page size selector
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => {
              // Optional: Track pagination state if needed
              setPagination({
                current: page,
                pageSize: pageSize,
              });
              
            },
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}