"use client";

import React, { useEffect, useState } from "react";
import { Table, Tag, Switch, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProductFilters from "@/components/ProductFilters";

interface Product {
  key: number;
  image: string;
  name: string;
  sku: string;
  category: string;
  size: string;
  color: string;
  fabric: string;
  mrp: number;
  price: number;
  rent: boolean;
  inventory: number;
  status: "Active" | "Inactive";
  city: string;
  subLocation: string;
  imageUploadStatus: "Pending" | "Completed";
}

interface ProductFiltersType {
  category: string[];
  size: string[];
  color: string[];
  fabric: string[];
  rentAvailable: boolean | null;
  status: string[];
  city: string | null;
  subLocation: string[];
  productName: string;
  sku: string;
  imageUploadStatus: "Pending" | "Completed" | null;
}

const generateDummyData = (count = 30): Product[] => {
  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Red", "Blue", "Green", "Black"];
  const fabrics = ["Cotton", "Linen", "Silk"];
  const categories = ["Clothing", "Footwear", "Accessories"];
  const cities = ["Mumbai", "Delhi", "Bangalore"];
  const subLocations: Record<string, string[]> = {
    Mumbai: ["Andheri", "Bandra"],
    Delhi: ["Saket", "Rohini"],
    Bangalore: ["Indiranagar", "Whitefield"],
  };

  return Array.from({ length: count }).map((_, i) => {
    const city = cities[i % cities.length];
    return {
      key: i,
      image: `https://via.placeholder.com/60?text=Prod+${i + 1}`,
      name: `Product${i + 1}`,
      sku: `SKU-${1000 + i}`,
      category: categories[i % categories.length],
      size: sizes[i % sizes.length],
      color: colors[i % colors.length],
      fabric: fabrics[i % fabrics.length],
      mrp: 1000 + i * 10,
      price: 800 + i * 8,
      rent: i % 2 === 0,
      inventory: Math.floor(Math.random() * 100),
      status: i % 3 === 0 ? "Inactive" : "Active",
      city,
      subLocation: subLocations[city][i % 2],
      imageUploadStatus: i % 2 === 0 ? "Completed" : "Pending",
    };
  });
};

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFiltersType>({
    category: [],
    size: [],
    color: [],
    fabric: [],
    rentAvailable: null,
    status: [],
    city: null,
    subLocation: [],
    productName: "",
    sku: "",
    imageUploadStatus: null,
  });

  useEffect(() => {
    const dummyData = generateDummyData();
    const sortedData = dummyData.sort((a, b) => {
      if (a.status === "Active" && b.status !== "Active") return -1;
      if (a.status !== "Active" && b.status === "Active") return 1;
      return 0;
    });
    setData(sortedData);
  }, []);

  const handleImageUpload = (record: Product) => {
    message.success(`Image uploaded for ${record.name}`);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (img: string) => <img src={img} alt="" width={60} />,
    },
    {
      title: "Product Name",
      dataIndex: "name",
    },
    {
      title: "System SKU ID",
      dataIndex: "sku",
    },
    {
      title: "Category",
      dataIndex: "category",
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
      dataIndex: "mrp",
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
      dataIndex: "status",
      render: (status: Product["status"]) => (
        <Tag color={status === "Active" ? "green" : "volcano"}>{status}</Tag>
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

  const filteredData = data.filter((item) => {
    return (
      (!filters.category.length || filters.category.includes(item.category)) &&
      (!filters.size.length || filters.size.includes(item.size)) &&
      (!filters.color.length || filters.color.includes(item.color)) &&
      (!filters.fabric.length || filters.fabric.includes(item.fabric)) &&
      (filters.rentAvailable === null || filters.rentAvailable === item.rent) &&
      (!filters.status.length || filters.status.includes(item.status)) &&
      (!filters.city || item.city === filters.city) &&
      (!filters.subLocation.length || filters.subLocation.includes(item.subLocation)) &&
      (!filters.productName || item.name.toLowerCase().includes(filters.productName.toLowerCase())) &&
      (!filters.sku || item.sku.toLowerCase().includes(filters.sku.toLowerCase())) &&
      (!filters.imageUploadStatus || filters.imageUploadStatus === item.imageUploadStatus)
    );
  });

  return (
    <div style={{ display: "flex", padding: 20 }}>
      <ProductFilters filters={filters} setFilters={setFilters} />
      <div style={{ flexGrow: 1, paddingLeft: 20 }}>
        <h3>Products</h3>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}