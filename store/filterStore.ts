import { create } from "zustand";

type FacetValue = {
  name: string;
  count: number;
  selected: boolean;
};

type Facets = Record<string, FacetValue[]>;

interface FilterState {
  activeFacet: string | null;
  results: number;
  setResults: (results: number) => void;
  category: string;
  setCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  priceBounds: [number, number];
  setPriceBounds: (bounds: [number, number]) => void;
  facetInit: boolean;
  setFacetInit: (loading: boolean) => void;
  facets: Facets;
  selectedFilters: Record<string, string[]>;
  setFacets: (apiFacets: Record<string, Record<string, number>> , activeFacet : string|null ) => void;
  toggleFilter: (facetName: string, value: string) => void;
  resetFilters: () => void;
  getSelectedFilters: () => Record<string, string[]>;
}

function createFilterStore() {
  return create<FilterState>((set, get) => ({
    activeFacet: null,
    setActiveFacet: (facet:string | null) => set({ activeFacet: facet }),
    results: 0,
    setResults: (results: number) => set({ results }),
    category: "",
    setCategory: (category: string) => set({ category }),
    priceRange: [0, 0],
    setPriceRange: (range: [number, number]) => set({ priceRange: range }),
    priceBounds: [0, 100000],
    setPriceBounds: (bounds: [number, number]) => set({ priceBounds: bounds }),
    facetInit: false,
    setFacetInit: (loading: boolean) => set({ facetInit: loading }),
    facets: {},
    selectedFilters: {},

   
    setFacets: (apiFacets, activeFacet) => {
      const currentFacets = get().facets;

      const updatedFacets: Facets = { ...currentFacets };
      
      for (const [facetName, values] of Object.entries(apiFacets)) {
        if (!values || typeof values !== "object") continue;

        if (facetName.toLowerCase() === activeFacet?.toLowerCase() && get().selectedFilters[activeFacet].length > 0) continue;

        const existing = currentFacets[facetName] || [];

        const updatedFacetValues: FacetValue[] = Object.entries(values).map(
          ([name, count]) => {
            const match = existing.find((item) => item.name === name);
            return {
              name,
              count,
              selected: match?.selected ?? false,
            };
          }
        );

        updatedFacets[facetName] = updatedFacetValues;
      }

      set({ facets: updatedFacets });
    },

    toggleFilter: (facetName, value) => {
      set((state) => {
        const updatedFacets = { ...state.facets };
        const updatedSelectedFilters = { ...state.selectedFilters };

        updatedFacets[facetName] = updatedFacets[facetName].map((facet) => {
          if (facet.name === value) {
            return { ...facet, selected: !facet.selected };
          }
          return facet;
        });

        updatedSelectedFilters[facetName] = updatedFacets[facetName]
          .filter((f) => f.selected)
          .map((f) => f.name);
        
        

        return {
          activeFacet: facetName,
          facets: updatedFacets,
          selectedFilters: updatedSelectedFilters,
        };
      });
    },

    resetFilters: () => {
      set((state) => {
        const resetFacets: Facets = {};
        const resetSelectedFilters: Record<string, string[]> = {};

        for (const [facetName, values] of Object.entries(state.facets)) {
          resetFacets[facetName] = values.map((value) => ({
            ...value,
            selected: false,
          }));
          resetSelectedFilters[facetName] = [];
        }

        return {
          facets: resetFacets,
          selectedFilters: resetSelectedFilters,
        };
      });
    },

    getSelectedFilters: () => {
      return get().selectedFilters;
    },
  }));
}

export const useFilterStore = createFilterStore(); // For store listing
export const useProductFilterStore = createFilterStore(); // For product page
