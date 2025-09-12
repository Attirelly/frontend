"use client";
import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import type { Product } from "@/types/ProductTypes";

/**
 * @interface ProductTableProps
 * @description Defines the props for the ProductTable component, extending Ant Design's TableProps.
 */
type ProductTableProps = {
  /**
   * @description The column definitions for the table. This follows the Ant Design `columns` API.
   * @see {@link https://ant.design/components/table#column}
   */
  columns: TableProps<Product>["columns"];
  /**
   * @description The array of product data to be displayed in the table.
   */
  data: Product[];
  /**
   * @description The current pagination state.
   */
  pagination: {
    current: number;
    pageSize: number;
  };
  /**
   * @description A callback function that is executed when the page number or page size changes.
   */
  onPaginationChange?: (page: number, pageSize: number) => void;
  /**
   * @description The key to be used for identifying each row, defaults to 'variant_id'.
   * @default 'variant_id'
   */
  rowKey?: string;
  /**
   * @description A boolean to indicate if the table is in a loading state.
   * @default false
   */
  loading?: boolean;
  /**
   * @description Configuration for the table's scroll behavior. Defaults to enabling horizontal scrolling.
   * @see {@link https://ant.design/components/table#scroll}
   */
  scroll?: TableProps<Product>["scroll"];
  /**
   * @description Configuration for the row selection feature (checkboxes).
   * @see {@link https://ant.design/components/table#rowselection}
   */
  rowSelection?: TableProps<Product>["rowSelection"];
  /**
   * @description A callback function for handling events on a table row, such as `onClick`.
   * @see {@link https://ant.design/components/table#onrow}
   */
  onRow?: TableProps<Product>["onRow"];
};

/**
 * A reusable presentational component that wraps the Ant Design `Table` for displaying product data.
 *
 * This component standardizes the appearance and functionality of product tables throughout the
 * application. It is a "dumb" component that receives all its data and configuration via props,
* making it highly reusable. It is pre-configured with common features needed for product
 * management, such as pagination with a size changer, horizontal scrolling for smaller screens,
 * and support for row selection and row-level events.
 *
 * @param {ProductTableProps} props - The props for configuring the table.
 * @returns {JSX.Element} A configured Ant Design Table component.
 * @see {@link https://ant.design/components/table | Ant Design Table Documentation}
 */
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
      // The column definitions passed from the parent component.
      columns={columns}
      // The product data to be rendered in the table rows.
      dataSource={data}
      // The unique key for each row, essential for React's rendering and for row selection.
      rowKey={rowKey}
      // Controls the loading spinner overlay on the table.
      loading={loading}
      // Configuration for the row selection checkboxes.
      rowSelection={rowSelection}
      // Configures the pagination component at the bottom of the table.
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        showSizeChanger: true, // Allows the user to change the number of items per page.
        pageSizeOptions: ["10", "20", "50", "100"], // Options for the page size selector.
        onChange: onPaginationChange, // Callback for when page or page size changes.
      }}
      // Enables horizontal scrolling on smaller viewports to prevent layout breaking.
      scroll={scroll}
      // Attaches event handlers (like onClick) to each row in the table.
      onRow={onRow}
    />
  );
}
