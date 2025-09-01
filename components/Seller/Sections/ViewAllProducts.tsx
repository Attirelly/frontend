// "use client";

// import React, { use, useEffect, useState } from "react";
// import { Table, Tag, Switch, Button, Upload, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import ProductFilters from "@/components/ProductFilters";
// import ProductTable from "@/components/ProductsTable";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
// import { api } from "@/lib/axios";
// import { useSellerStore } from "@/store/sellerStore";
// import type {
//   ProductFiltersType,
//   Product,
//   FilterOptions,
// } from "@/types/ProductTypes";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   useFormActions
// } from "@/store/product_upload_store";

// export default function ProductsPage({
//   batchId = null,
// }: {
//   batchId?: string | null;
// }) {
//   const { setCurrentStep } = useFormActions();

//   const {
//     products,
//     setProducts,
//     filterOptions,
//     setFilterOptions,
//     hasFetchedProducts,
//     setHasFetchedProducts,
//     storeId,
//   } = useSellerStore();

//   const [filteredData, setFilteredData] = useState<Product[]>([]);
//   const [selectedRows , setSelectedRows] = useState<>() ;
//   const [isReady, setIsReady] = useState(false);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   });
//   const [filters, setFilters] = useState<ProductFiltersType>({
//     category: [],
//     pmCat: [],
//     subCat1: [],
//     subCat2: [],
//     subCat3: [],
//     size: [],
//     color: [],
//     // fabric: [],
//     rentAvailable: null,
//     status: [],
//     // city: null,
//     // subLocation: [],
//     productName: [],
//     sku: [],
//     imageUploadStatus: null,
//     source: [],
//   });

//   const router = useRouter()

//   useEffect(() => {

//     const fetchInitialData = async () => {
//       try {
//         const url = batchId
//           ? `/products/products_by_store_async/${storeId}?batch_id=${batchId}`
//           : `/products/products_by_store_async/${storeId}`;
//         const res = await api.get(url); // Adjust this to your actual endpoint
//         const json = res.data;
//         setFilteredData(json.table_data);
//         setProducts(json.table_data);
//         setHasFetchedProducts(true);
//         setFilterOptions({
//           categories: json.categories,
//           sizes: json.sizes,
//           colors: json.colors,
//           statuses: [],
//           productNames: json.product_names,
//           skus: json.skus,
//           image_upload_statuses: [],
//           source: [],
//         });
//         setIsReady(true);
//       } catch (err) {
//         setIsReady(true);
//         console.error("Error fetching data", err);
//       }
//     };

//     const sortedData = products.sort((a, b) => {
//       if (a.status === true && b.status !== true) return -1;
//       if (a.status !== true && b.status === true) return 1;
//       return 0;
//     });
//     setProducts(sortedData);

//     fetchInitialData();
//   }, [
//     hasFetchedProducts,
//     setHasFetchedProducts,
//     setProducts,
//     setFilterOptions,
//   ]);

//   useEffect(() => {
//     // Prefetch current page items
//     const start = (pagination.current - 1) * pagination.pageSize;
//     const end = start + pagination.pageSize;
//     const currentPageData = products.slice(start, end);
//     currentPageData.forEach((product) => {
//       router.prefetch(`/product_upload/${product.product_id}`);
//     });
//   }, [pagination, products]);

//   const handleImageUpload = (record: Product) => {
//     // message.success(`Image uploaded for ${record.product_name}`);
//     // setCurrentStep(6);
//     window.open(`/product_upload/${record.product_id}?step=6`, '_blank', 'noopener,noreferrer');
//   };

//   const columns = [
//     {
//       title: "Image",
//       dataIndex: "image",
//       render: (_: any, record: Product) => {

//         const record_images = record?.images || [];

//         const imageSrc =
//           Array.isArray(record_images) && record_images.length > 0
//             ? record_images[0]
//             : "/window.svg"; // A fallback image stored in public folder

//         return (
//           <Image
//             src={imageSrc}
//             alt="product_image"
//             width={60}
//             height={60}
//             style={{ objectFit: "cover", borderRadius: "4px" }}
//           />
//         );
//       },
//     },
//     {
//       title: "Product Name",
//       dataIndex: "product_name",
//     },
//     {
//       title: "System SKU ID",
//       dataIndex: "sku",
//     },
//     {
//       title: "Primary Category",
//       render: (_: any, record: Product) => {
//         const level1Category = record.category?.find(
//           (cat: any) => cat.level === 1
//         );
//         return level1Category?.name || "-";
//       },
//     },
//     {
//       title: "Sub Category 1",
//       render: (_: any, record: Product) => {
//         const level1Category = record.category?.find(
//           (cat: any) => cat.level === 2
//         );
//         return level1Category?.name || "-";
//       },
//     },
//     {
//       title: "Sub Category 2",
//       render: (_: any, record: Product) => {
//         const level1Category = record.category?.find(
//           (cat: any) => cat.level === 3
//         );
//         return level1Category?.name || "-";
//       },
//     },
//     {
//       title: "Sub Category 3",
//       render: (_: any, record: Product) => {
//         const level1Category = record.category?.find(
//           (cat: any) => cat.level === 4
//         );
//         return level1Category?.name || "-";
//       },
//     },
//     {
//       title: "Size",
//       dataIndex: "size",
//     },
//     {
//       title: "Color",
//       dataIndex: "color",
//     },
//     {
//       title: "MRP",
//       dataIndex: "price",
//     },
//     {
//       title: "Store Price",
//       dataIndex: "price",
//       sorter: (a: Product, b: Product) => a.price - b.price,
//       sortDirections: ['ascend', 'descend'] as ('ascend' | 'descend')[],
//     },
//     // {
//     //   title: "Available for Rent",
//     //   dataIndex: "rent",
//     //   render: (rent: boolean) => (rent === true ? "Yes" : "No"),
//     // },
//     {
//       title: "Source",
//       dataIndex: "shopify_id",
//       render: (shopify_id: string) =>
//         shopify_id === null ? "Self" : "Shopify",
//     },
//     {
//       title: "Status",
//       dataIndex: "active",
//       render: (status: Product["status"]) => (
//         <Tag color={status === true ? "green" : "volcano"}>
//           {status === true ? "Active" : "Inactive"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Image Upload",
//       render: (_: any, record: Product) => (
//         // <Upload showUploadList={false}>
//         <Button
//           icon={<UploadOutlined />}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleImageUpload(record);
//           }}
//         >
//           Upload
//         </Button>
//         // </Upload>
//       ),
//     },
//   ];

//   const result = products.filter((item) => {
//     const primaryCat =
//       item.category?.find((cat) => cat.level === 1)?.name || "";
//     const sub_Cat1 = item.category?.find((cat) => cat.level === 2)?.name || "";
//     const sub_Cat2 = item.category?.find((cat) => cat.level === 3)?.name || "";
//     const sub_Cat3 = item.category?.find((cat) => cat.level === 4)?.name || "";
//     const derivedSource = item.shopify_id === null ? "Self" : "Shopify";
//     console.log(item.shopify_id, derivedSource)

//     return (
//       (!filters.pmCat.length || filters.pmCat.includes(primaryCat)) &&
//       // (!filters.subCat1.length || filters.subCat1.includes(sub_Cat1)) &&
//       (!filters.subCat2.length || filters.subCat2.includes(sub_Cat2)) &&
//       (!filters.subCat3.length || filters.subCat3.includes(sub_Cat3)) &&
//       (!filters.size.length || filters.size.includes(item.size)) &&
//       (!filters.color.length || filters.color.includes(item.color)) &&
//       // (filters.rentAvailable === null || filters.rentAvailable === item.rent) &&
//       (!filters.status.length || filters.status.includes(item.status)) &&
//       (!filters.productName.length ||
//         filters.productName.includes(item.product_name)) &&
//       (!filters.sku.length || filters.sku.includes(item.sku)) &&
//       (!filters.imageUploadStatus ||
//         filters.imageUploadStatus === item.imageUploadStatus) &&
//       (!filters.source.length || filters.source.includes(derivedSource))
//     );
//   });

//   if (!isReady || !filterOptions) {
//     return <LoadingSpinner />;
//   }
//   return (
//     // <div style={{ display: "flex-col" }} className="space-y-4 flex-col">
//     <div style={{ display: "flex-col" }} className="space-y-4 flex-col w-4xl">
//       <ProductFilters
//         filters={filters}
//         setFilters={setFilters}
//         filterOptions={filterOptions}
//       />
//       <div style={{ flexGrow: 1 }}>
//         <h3>Products</h3>
//         <ProductTable
//           columns={columns}
//           data={result}
//           rowKey={"variant_id"}
//           pagination={pagination}
//           onPaginationChange={(page, pageSize) =>
//             setPagination({ current: page, pageSize })
//           }
//           onRow={(record) => ({
//             onClick: () => {
//               // router.push(`/product_upload/${record.product_id}`);
//               window.open(`/product_upload/${record.product_id}`, '_blank', 'noopener,noreferrer');
//             },
//             style: { cursor: "pointer" },
//           })}
//         />
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { use, useEffect, useState } from "react";
// import { Table, Tag, Switch, Button, Upload, message, Checkbox } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import ProductFilters from "@/components/ProductFilters";
// import ProductTable from "@/components/ProductsTable";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
// import { api } from "@/lib/axios";
// import { useSellerStore } from "@/store/sellerStore";
// import type {
//   ProductFiltersType,
//   Product,
//   FilterOptions,
// } from "@/types/ProductTypes";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useFormActions } from "@/store/product_upload_store";
// import { title } from "process";

// interface ProductVariantIDs {
//   product_id: string;
//   variant_id: string;
// }

// export default function ProductsPage({
//   batchId = null,
// }: {
//   batchId?: string | null;
// }) {
//   const { setCurrentStep } = useFormActions();

//   const {
//     products,
//     setProducts,
//     filterOptions,
//     setFilterOptions,
//     hasFetchedProducts,
//     setHasFetchedProducts,
//     storeId,
//   } = useSellerStore();

//   const [filteredData, setFilteredData] = useState<Product[]>([]);
//   const [isReady, setIsReady] = useState(false);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 30,
//   });
//   const [filters, setFilters] = useState<ProductFiltersType>({
//     category: [],
//     pmCat: [],
//     subCat1: [],
//     subCat2: [],
//     subCat3: [],
//     size: [],
//     color: [],
//     // fabric: [],
//     rentAvailable: null,
//     status: [],
//     // city: null,
//     // subLocation: [],
//     productName: [],
//     sku: [],
//     imageUploadStatus: null,
//     source: [],
//   });

//   const [selectedRowKeys, setSelectedRowKeys] = useState<ProductVariantIDs[]>([]);
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const url = batchId
//           ? `/products/products_by_store/${storeId}?batch_id=${batchId}`
//           : `/products/products_by_store/${storeId}`;
//         const res = await api.get(url); // Adjust this to your actual endpoint
//         const json = res.data;
//         setFilteredData(json.table_data);
//         setProducts(json.table_data);
//         setHasFetchedProducts(true);
//         setFilterOptions({
//           categories: json.categories,
//           sizes: json.sizes,
//           colors: json.colors,
//           statuses: [],
//           productNames: json.product_names,
//           skus: json.skus,
//           image_upload_statuses: [],
//           source: [],
//         });
//         setIsReady(true);
//       } catch (err) {
//         setIsReady(true);
//         console.error("Error fetching data", err);
//       }
//     };

//     const sortedData = products.sort((a, b) => {
//       if (a.status === true && b.status !== true) return -1;
//       if (a.status !== true && b.status === true) return 1;
//       return 0;
//     });
//     setProducts(sortedData);

//     fetchInitialData();
//   }, [
//     hasFetchedProducts,
//     setHasFetchedProducts,
//     setProducts,
//     setFilterOptions,
//   ]);

//   useEffect(() => {
//     // Prefetch current page items
//     const start = (pagination.current - 1) * pagination.pageSize;
//     const end = start + pagination.pageSize;
//     const currentPageData = products.slice(start, end);
//     currentPageData.forEach((product) => {
//       router.prefetch(`/product_upload/${product.product_id}`);
//     });
//   }, [pagination, products]);

//   const handleImageUpload = (record: Product) => {
//     window.open(
//       `/product_upload/${record.product_id}?step=6`,
//       "_blank",
//       "noopener,noreferrer"
//     );
//   };

//   const handleBulkStatusChange = async (status: boolean) => {
//     if (selectedRowKeys.length === 0) {
//       message.warning("Please select at least one product");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Call your API to update status for selected products
//       console.log("selectedRowkeys" , selectedRowKeys)
//       await api.post("/products/bulk_product_status_change", {
//         rows: selectedRowKeys,
//         status: status,
//       });

//       // Update local state
//       console.log("selectedRowKeys", selectedRowKeys);
//       const updatedProducts = products.map((product) => {
//       const isSelected = selectedRowKeys.some(
//         (selected) =>
//           selected.product_id === product.product_id &&
//           selected.variant_id === product.variant_id
//       );
//       if (isSelected) {
//     console.log(
//       `Updating product ${product.product_id} | variant ${product.variant_id} from status=${product.status} to status=${status}`
//     );
//   }

//       return isSelected ? { ...product, status } : product;
//     });
//       console.log("updated products",updatedProducts);
//       setProducts(updatedProducts);
//       // setFilteredData(updatedProducts);
//       // setFilters((prev) => ({ ...prev }));
//       setSelectedRowKeys([]);
//       message.success(
//         `Successfully updated ${selectedRowKeys.length} product(s) to ${
//           status ? "Active" : "Inactive"
//         }`
//       );
//     } catch (error) {
//       message.error("Failed to update product statuses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Image",
//       dataIndex: "image",
//       render: (_: any, record: Product) => {
//         const record_images = record?.images || [];
//         const imageSrc =
//           Array.isArray(record_images) && record_images.length > 0
//             ? record_images[0]
//             : "/window.svg";

//         return (
//           <Image
//             src={imageSrc}
//             alt="product_image"
//             width={60}
//             height={60}
//             style={{ objectFit: "cover", borderRadius: "4px" , objectPosition :"top" }}
//           />
//         );
//       },
//     },
//     {
//       title: "Product Name",
//       dataIndex: "product_name",
//     },
//     {
//       title: "System SKU ID",
//       dataIndex: "sku",
//     },
//     {
//       title: "Primary Category",
//       render: (_: any, record: Product) => {
//         const level1Category = record.category?.find(
//           (cat: any) => cat.level === 1
//         );
//         return level1Category?.name || "-";
//       },
//     },
//     {
//       title: "Sub Category 1",
//       render: (_: any, record: Product) => {
//         const level1Category = record.category?.find(
//           (cat: any) => cat.level === 2
//         );
//         return level1Category?.name || "-";
//       },
//     },
//     {
//       title: "Sub Category 2",
//       render: (_: any, record: Product) => {
//         const level1Category = record.category?.find(
//           (cat: any) => cat.level === 3
//         );
//         return level1Category?.name || "-";
//       },
//     },
//     {
//       title: "Sub Category 3",
//       render: (_: any, record: Product) => {
//         const level1Category = record.category?.find(
//           (cat: any) => cat.level === 4
//         );
//         return level1Category?.name || "-";
//       },
//     },
//     {
//       title: "Size",
//       dataIndex: "size",
//     },
//     {
//       title: "Color",
//       dataIndex: "color",
//     },
//     {
//       title: "MRP",
//       dataIndex: "mrp",
//     },
//     {
//       title: "Store Price",
//       dataIndex: "price",
//       sorter: (a: Product, b: Product) => a.price - b.price,
//       sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
//     },
//     {
//       title: "Discount",
//       dataIndex: "discount",
//       sorter: (a: Product, b: Product) => a.discount - b.discount,
//       sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
//     },
//     {
//       title: "Source",
//       dataIndex: "shopify_id",
//       render: (shopify_id: string) =>
//         shopify_id === null ? "Self" : "Shopify",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status: Product["status"]) => (
//         <Tag color={status === true ? "green" : "volcano"}>
//           {status === true ? "Active" : "Inactive"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Image Upload",
//       render: (_: any, record: Product) => (
//         <Button
//           icon={<UploadOutlined />}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleImageUpload(record);
//           }}
//         >
//           Upload
//         </Button>
//       ),
//     },
//   ];
//   const result = products.filter((item) => {
//     const primaryCat =
//       item.category?.find((cat) => cat.level === 1)?.name || "";
//     const sub_Cat1 = item.category?.find((cat) => cat.level === 2)?.name || "";
//     const sub_Cat2 = item.category?.find((cat) => cat.level === 3)?.name || "";
//     const sub_Cat3 = item.category?.find((cat) => cat.level === 4)?.name || "";
//     const derivedSource = item.shopify_id === null ? "Self" : "Shopify";

//     return (
//       (!filters.pmCat.length || filters.pmCat.includes(primaryCat)) &&
//       (!filters.subCat2.length || filters.subCat2.includes(sub_Cat2)) &&
//       (!filters.subCat3.length || filters.subCat3.includes(sub_Cat3)) &&
//       (!filters.size.length || filters.size.includes(item.size)) &&
//       (!filters.color.length || filters.color.includes(item.color)) &&
//       (!filters.status.length || filters.status.includes(item.status)) &&
//       (!filters.productName.length ||
//         filters.productName.includes(item.product_name)) &&
//       (!filters.sku.length || filters.sku.includes(item.sku)) &&
//       (!filters.imageUploadStatus ||
//         filters.imageUploadStatus === item.imageUploadStatus) &&
//       (!filters.source.length || filters.source.includes(derivedSource))
//     );
//   });

//   // const rowSelection = {
//   //   selectedRowKeys,selectedRows,
//   //   onChange: (selectedKeys: React.Key[]) => {
//   //     setSelectedRowKeys(selectedKeys);
//   //   },
//   // };

//   if (!isReady || !filterOptions) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div style={{ display: "flex-col" }} className="space-y-4 flex-col w-4xl">
//       <ProductFilters
//         filters={filters}
//         setFilters={setFilters}
//         filterOptions={filterOptions}
//       />
//       <div style={{ marginBottom: 16 }}>
//         <Button
//           type="primary"
//           onClick={() => handleBulkStatusChange(true)}
//           disabled={selectedRowKeys.length === 0}
//           loading={loading}
//           style={{ marginRight: 8 }}
//         >
//           Activate Selected
//         </Button>
//         <Button
//           danger
//           onClick={() => handleBulkStatusChange(false)}
//           disabled={selectedRowKeys.length === 0}
//           loading={loading}
//         >
//           Deactivate Selected
//         </Button>
//         <span style={{ marginLeft: 8 }}>
//           {selectedRowKeys.length > 0
//             ? `Selected ${selectedRowKeys.length} items`
//             : ""}
//         </span>
//       </div>
//       <div style={{ flexGrow: 1 }}>
//         <h3 className="text-black">Products</h3>
//         <ProductTable
//           columns={columns}
//           data={result}
//           rowKey={"variant_id"}
//           pagination={pagination}
//           onPaginationChange={(page, pageSize) =>
//             setPagination({ current: page, pageSize })
//           }
//           onRow={(record) => ({
//             onClick: () => {
//               window.open(
//                 `/product_upload/${record.product_id}`,
//                 "_blank",
//                 "noopener,noreferrer"
//               );
//             },
//             style: { cursor: "pointer" },
//           })}
//           // rowSelection={rowSelection}
//           rowSelection={{
//             onChange: (selectedRowKeys, selectedRows) => {
//             const selectedProductIds = selectedRows.map((row) => ({
//               product_id: String(row.product_id ?? ""),
//               variant_id: String(row.variant_id ?? ""),
//             }));

//             // Optional: store them in state or send to server
//             setSelectedRowKeys(selectedProductIds);
//             },
//             getCheckboxProps: (record) => ({
//               disabled: false, // you can disable checkbox based on record logic
//               name: record.product_id, // not necessary, but semantic
//             }),
//           }}
//         />
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import Modal from "react-modal";
import { Area } from "react-easy-crop";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

export default function PhotosPage() {
  const { storePhotosData, setStorePhotosData, setStorePhotosValid } =
    useSellerStore();

  // Profile Image State
  const [profileUrl, setProfileUrl] = useState(
    storePhotosData?.profileUrl || ""
  );
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);

  // Banner Image State
  const [bannerUrl, setBannerUrl] = useState(storePhotosData?.bannerUrl || "");
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerProgress, setBannerProgress] = useState(0);

  // Refs for file inputs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const handleProfileClick = () => profileInputRef.current?.click();
  const handleBannerClick = () => bannerInputRef.current?.click();

  // Cropping State
  const [croppingImage, setCroppingImage] = useState<File | null>(null);
  const [croppingFor, setCroppingFor] = useState<"profile" | "banner" | null>(
    null
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = (_: any, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  };

  const imageSrc = useMemo(
    () => (croppingImage ? URL.createObjectURL(croppingImage) : ""),
    [croppingImage]
  );

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  async function deleteImageFromS3(imageUrl: string) {
    try {
      await api.delete(`/products/delete_image`, {
        data: { file_url: imageUrl },
      });
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  }

  const removeMainImage = async (imageUrl: string) => {
    try {
      if (!imageUrl) return;
      await deleteImageFromS3(imageUrl);
      setProfileUrl("");
    } catch (error) {
      console.error("Error removing main image:", error);
    }
  };

  const removeBannerImage = async (imageUrl: string) => {
    try {
      if (!imageUrl) return;
      await deleteImageFromS3(imageUrl);
      setBannerUrl("");
    } catch (error) {
      console.error("Error removing banner image:", error);
    }
  };

  const uploadToS3 = async (
    file: File,
    type: "profile" | "banner"
  ): Promise<string | null> => {
    const uploader = type === "profile" ? setProfileUploading : setBannerUploading;
    const progresser = type === "profile" ? setProfileProgress : setBannerProgress;

    try {
      uploader(true);
      progresser(0);
      const response = await api.post<UploadResponse>("/stores/upload", {
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
            progresser(percentCompleted);
          }
        },
      });
      return file_url;
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Please try again.");
      return null;
    } finally {
      uploader(false);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      if (type === "profile" && (img.width < 800 || img.height < 800)) {
        toast.error("Profile image must be at least 800×800 pixels");
        return;
      }
      if (type === "banner" && (img.width < 1200 || img.height < 600)) {
        toast.error("Banner image must be at least 1200x600 pixels");
        return;
      }
      setCroppingFor(type);
      setCroppingImage(file);
    };
    img.src = URL.createObjectURL(file);
    e.target.value = ""; // Allow re-uploading the same file
  };

  useEffect(() => {
    const isValid = profileUrl.trim() !== "" && bannerUrl.trim() !== "";
    setStorePhotosValid(isValid);
    setStorePhotosData({ profileUrl, bannerUrl });
  }, [profileUrl, bannerUrl, setStorePhotosValid, setStorePhotosData]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm text-black">
      <Modal
        isOpen={!!croppingImage}
        ariaHideApp={false}
        onRequestClose={() => setCroppingImage(null)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95vw",
            maxWidth: "720px",
            height: "auto",
            maxHeight: "90vh",
            padding: "1rem",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        {croppingImage && (
          <>
            <div className="relative w-full h-[65vh] sm:h-[500px] bg-black rounded-lg">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={croppingFor === "profile" ? 1 : 2}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="rect"
                showGrid={true}
                zoomWithScroll={true}
                restrictPosition={true}
                objectFit="contain"
              />
              <div className="absolute bottom-0 w-full p-4 flex flex-col items-center z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full max-w-[280px] sm:max-w-[400px]"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                if (!croppedAreaPixels || !croppingImage || !croppingFor) return;
                const croppedBlob = await getCroppedImg(
                  imageSrc,
                  croppedAreaPixels,
                  0.9
                );
                if (!croppedBlob) return toast.error("Failed to crop image");
                const uploadedUrl = await uploadToS3(
                  new File([croppedBlob], croppingImage.name, {
                    type: croppingImage.type,
                  }),
                  croppingFor
                );
                if (uploadedUrl) {
                  if (croppingFor === "profile") {
                    setProfileUrl(uploadedUrl);
                  } else {
                    setBannerUrl(uploadedUrl);
                  }
                }
                setCroppingImage(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:self-center text-sm sm:text-base"
            >
              Crop & Upload
            </button>
          </>
        )}
      </Modal>

      {/* Profile Photo Section */}
      <div>
        <h1 className="text-base sm:text-lg font-semibold">Profile Photo</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Upload a square profile photo for your store (min 800x800px)
        </p>
      </div>
      <div className="border-t border-gray-300 -mx-4 sm:-mx-6"></div>
      <div
        onClick={handleProfileClick}
        className="w-full max-w-sm cursor-pointer border border-dashed border-gray-300 p-4 sm:p-6 rounded-xl text-center hover:bg-gray-50 transition mx-auto"
      >
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Upload your profile image<span className="text-red-500">*</span>
        </h2>
        {profileUploading ? (
          <>
            <p className="text-gray-400 text-sm">
              Uploading: {profileProgress}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${profileProgress}%` }}
              ></div>
            </div>
          </>
        ) : profileUrl ? (
          <div className="relative group mx-auto w-full max-w-[200px] sm:max-w-[300px]">
            <img
              src={profileUrl}
              alt="Profile Preview"
              className="w-full h-auto aspect-square object-cover object-top rounded-lg mx-auto"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeMainImage(profileUrl);
              }}
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
              aria-label="Remove image"
            >
              <FiTrash2 className="text-red-500 h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs sm:text-sm p-4">
            Click to upload image (svg, png, jpg)
          </div>
        )}
        <input
          ref={profileInputRef}
          type="file"
          accept=".svg,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFileChange(e, "profile")}
        />
      </div>

      {/* Banner Photo Section */}
      <div className="border-t border-gray-300 -mx-4 sm:-mx-6"></div>
      <div>
        <h1 className="text-base sm:text-lg font-semibold">Banner Photo</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Upload a banner for your store page (min 1200x600px)
        </p>
      </div>
      <div
        onClick={handleBannerClick}
        className="w-full max-w-sm cursor-pointer border border-dashed border-gray-300 p-4 sm:p-6 rounded-xl text-center hover:bg-gray-50 transition mx-auto"
      >
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Upload your banner image<span className="text-red-500">*</span>
        </h2>
        {bannerUploading ? (
          <>
            <p className="text-gray-400 text-sm">
              Uploading: {bannerProgress}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${bannerProgress}%` }}
              ></div>
            </div>
          </>
        ) : bannerUrl ? (
          <div className="relative group mx-auto w-full max-w-full">
            <img
              src={bannerUrl}
              alt="Banner Preview"
              className="w-full h-auto aspect-video object-cover object-center rounded-lg mx-auto"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeBannerImage(bannerUrl);
              }}
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
              aria-label="Remove banner"
            >
              <FiTrash2 className="text-red-500 h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs sm:text-sm p-4">
            Click to upload banner (1200x600px recommended)
          </div>
        )}
        <input
          ref={bannerInputRef}
          type="file"
          accept=".svg,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFileChange(e, "banner")}
        />
      </div>
    </div>
  );
}

