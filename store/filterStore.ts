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
  selectedPriceRange: [number, number] | null;
  setPriceRange: (range: [number, number]) => void;
  priceBounds: [number, number];
  setPriceBounds: (bounds: [number, number]) => void;
  facetInit: boolean;
  setFacetInit: (loading: boolean) => void;
  facets: Facets;
  selectedFilters: Record<string, string[]>;
  setFacets: (
    apiFacets: Record<string, Record<string, number>>,
    activeFacet: string | null
  ) => void;
  toggleFilter: (facetName: string, value: string) => void;
  resetFilters: () => void;
  getSelectedFilters: () => Record<string, string[]>;
  initializeFilters: (initialState: {
    selectedFilters?: Record<string, string[]>;
    priceRange?: [number, number] | null;
  }) => void;
}

function createFilterStore() {
  return create<FilterState>((set, get) => ({
    activeFacet: null,
    setActiveFacet: (facet: string | null) => set({ activeFacet: facet }),
    results: 0,
    setResults: (results: number) => set({ results }),
    selectedPriceRange: null,
    setPriceRange: (range) => set({ selectedPriceRange: range }),
    priceBounds: [0, 100000],
    setPriceBounds: (bounds: [number, number]) => set({ priceBounds: bounds }),
    facetInit: false,
    setFacetInit: (loading: boolean) => set({ facetInit: loading }),
    facets: {},
    selectedFilters: {},

    initializeFilters: (initialState) => {
      const newSelectedFilters = initialState.selectedFilters || {};
      const currentFacets = get().facets;

      // Update the 'selected' status in the main facets array for UI consistency
      const updatedFacets: Facets = {};
      Object.keys(currentFacets).forEach((facetName) => {
        const selectedValues = newSelectedFilters[facetName] || [];
        updatedFacets[facetName] = currentFacets[facetName].map((value) => ({
          ...value,
          selected: selectedValues.includes(value.name),
        }));
      });

      set({
        selectedFilters: newSelectedFilters,
        // category: initialState.category || "",
        facets: updatedFacets, // Set the updated facets
        activeFacet: null,
        selectedPriceRange: initialState.priceRange || null,
      });
    },

    setFacets: (apiFacets, activeFacet) => {
      const currentFacets = get().facets;

      const updatedFacets: Facets = { ...currentFacets };

      for (const [facetName, values] of Object.entries(apiFacets)) {
        if (!values || typeof values !== "object") continue;

        if (
          activeFacet &&
          facetName.toLowerCase() === activeFacet?.toLowerCase() &&
          get().selectedFilters[activeFacet].length > 0
        )
          continue;

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
          selectedPriceRange: null, 
          activeFacet:null
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
