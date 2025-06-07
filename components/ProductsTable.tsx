// components/ProductTable.tsx
"use client";

import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import type { Product } from "@/types/ProductTypes";

type ProductTableProps = {
  columns: TableProps<Product>["columns"];
  data: Product[];
  pagination: {
    current: number;
    pageSize: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  rowKey?: string;
  loading?: boolean;
  scroll?: TableProps<Product>["scroll"];
  rowSelection?: TableProps<Product>["rowSelection"];
  onRow?: TableProps<Product>["onRow"];
};

export default function ProductTable({
  columns,
  data,
  pagination,
  onPaginationChange,
  rowKey = "variant_id",
  loading = false,
  scroll = { x: "max-content" },
  rowSelection,
  onRow,
}: ProductTableProps) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      loading={loading}
      rowSelection={rowSelection}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        onChange: onPaginationChange,
      }}
      scroll={scroll}
      onRow={onRow}
    />
  );
}
