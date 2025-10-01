import { AddToCuration } from "@/components/admin/productCRM/AddToCuration";
import { AlgoliaStorehit, Curation } from "@/types/algolia";
import { useState } from "react";

export default function StoreRankingPage() {

    const [selectedCurations, setSelectedCurations] = useState<Curation[]>([]);
    const [selectedStores, setSelectedStores] = useState<AlgoliaStorehit[]>([]);

    const handleCurationChange = (curations: Curation[]) => {
        setSelectedCurations(curations);
      };
    

    return(
        <AddToCuration
        onSelectionChange={handleCurationChange}
        selectedObjects={selectedStores}
        />
    )
}