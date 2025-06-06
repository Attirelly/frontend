"use client";

import React, { useEffect, useState } from "react";
import { Table, Tag, Switch, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProductFilters from "@/components/ProductFilters";
import {api} from "@/lib/axios"
import type { ProductFiltersType, Product, FilterOptions } from "@/types/ProductTypes";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFiltersType>({
    category: [],
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
    statuses : [],
    productNames: [],
    skus: [],
    image_upload_statuses: [],
  });
  const router = useRouter();

  useEffect(() => {
    // const dummyData = generateDummyData();

    const fetchInitialData = async () => {
      try {
        const res = await api.get("/products/products_by_store/97840be9-44fc-4c6f-b3bf-c04140edfb58"); // Adjust this to your actual endpoint
        const json = res.data;
        setData(json.table_data);
        setFilteredData(json.table_data);
        setFilterOptions({
          categories: json.categories,
          sizes: json.sizes,
          colors: json.colors,
          statuses : [],
          productNames: json.product_names,
          skus: json.skus,
          image_upload_statuses : []
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
        setLoading(false);
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

  const handleEditProduct = (record: Product) => {
    // Use the correct product id property, e.g., product_id
    router.push(`/product_upload?productId=${record.product_id}`);
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
      title: "Category",
      dataIndex: "categories",
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
      title: "Inventory",
      dataIndex: "inventory",
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
    {
      title: "Edit",
      render: (_: any, record: Product) => (
        <Button type="primary" onClick={() => handleEditProduct(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const result = data.filter((item) => {
    return (
      (!filters.category.length || filters.category.includes(item.category)) &&
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

  return (
    <div style={{ display: "flex", padding: 20 }}>
      <ProductFilters filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
      <div style={{ flexGrow: 1, paddingLeft: 20 }}>
        <h3>Products</h3>
        <Table
          columns={columns}
          dataSource={result}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}