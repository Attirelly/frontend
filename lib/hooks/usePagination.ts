// lib/hooks/usePagination.ts

import { useMemo } from "react";

export const DOTS = "...";

const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

interface UsePaginationProps {
  totalPages: number;
  siblingCount?: number;
  currentPage: number; // Note: This should be 1-indexed for calculations
}

export const usePagination = ({
  totalPages,
  siblingCount = 1,
  currentPage,
}: UsePaginationProps) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    // Case 1: If pages are less than the numbers we want to show, return the full range.
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots, but right dots are shown.
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: No right dots, but left dots are shown.
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPages - rightItemCount + 1,
        totalPages
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots are shown.
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalPages, siblingCount, currentPage]);

  return paginationRange;
};