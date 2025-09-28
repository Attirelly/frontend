import PriceDiscountCurationPage from '@/components/admin/PriceDiscountCuration';
import React, { Suspense } from 'react';

export default function AddPriceDiscountPage() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <PriceDiscountCurationPage/>
        </Suspense>
    )
}