// // store/filterStore.ts
// import { create } from 'zustand';

// type FacetValue = {
//   name: string;
//   count: number;
//   selected: boolean;
// };

// type Facets = Record<string, FacetValue[]>;

// interface FilterState {
//   facets: Facets;
//   selectedFilters: Record<string, string[]>;
//   setFacets: (apiFacets: Record<string, Record<string, number>>) => void;
//   toggleFilter: (facetName: string, value: string) => void;
//   resetFilters: () => void;
//   getSelectedFilters: () => Record<string, string[]>;
// }

// export const useFilterStore = create<FilterState>((set, get) => ({
//   facets: {},
//   selectedFilters: {},
//   // setFacets: (apiFacets) => {
//   //   const facets: Facets = {};

//   //   for (const [facetName, values] of Object.entries(apiFacets)) {
//   //     facets[facetName] = Object.entries(values).map(([name, count]) => ({
//   //       name,
//   //       count,
//   //       selected: false,
//   //     }));
//   //   }

//   //   set({ 
//   //     facets,
//   //     selectedFilters: Object.keys(apiFacets).reduce((acc, key) => {
//   //       acc[key] = [];
//   //       return acc;
//   //     }, {} as Record<string, string[]>)
//   //   });
//   // },
//   setFacets: (apiFacets) => {
//     const currentFacets = get().facets;
//     const updatedFacets: Facets = { ...currentFacets };

//     for (const [facetName, values] of Object.entries(apiFacets)) {
//       const existing = currentFacets[facetName] || [];

//       const updatedFacetValues: FacetValue[] = Object.entries(values).map(([name, count]) => {
//         const match = existing.find((item) => item.name === name);
//         return {
//           name,
//           count,
//           selected: match?.selected ?? false,
//         };
//       });

//       updatedFacets[facetName] = updatedFacetValues;
//     }

//     set({ facets: updatedFacets });
//   },
//   toggleFilter: (facetName, value) => {
//     set((state) => {
//       const updatedFacets = { ...state.facets };
//       const updatedSelectedFilters = { ...state.selectedFilters };

//       // Update facet selection
//       updatedFacets[facetName] = updatedFacets[facetName].map((facet) => {
//         if (facet.name === value) {
//           return { ...facet, selected: !facet.selected };
//         }
//         return facet;
//       });

//       // Update selected filters
//       updatedSelectedFilters[facetName] = updatedFacets[facetName]
//         .filter(f => f.selected)
//         .map(f => f.name);

//       return {
//         facets: updatedFacets,
//         selectedFilters: updatedSelectedFilters
//       };
//     });
//   },
//   resetFilters: () => {
//     set((state) => {
//       const resetFacets: Facets = {};
//       const resetSelectedFilters: Record<string, string[]> = {};

//       for (const [facetName, values] of Object.entries(state.facets)) {
//         resetFacets[facetName] = values.map(value => ({
//           ...value,
//           selected: false,
//         }));
//         resetSelectedFilters[facetName] = [];
//       }

//       return {
//         facets: resetFacets,
//         selectedFilters: resetSelectedFilters
//       };
//     });
//   },
//   getSelectedFilters: () => {
//     return get().selectedFilters;
//   },
// }));


import { create } from 'zustand';

type FacetValue = {
  name: string;
  count: number;
  selected: boolean;
};

type Facets = Record<string, FacetValue[]>;

interface FilterState {
  priceRange : [number, number];
  setPriceRange : (range : [number, number]) => void;
  priceBounds: [number, number];
  setPriceBounds: (bounds: [number, number]) => void;
  facets: Facets;
  selectedFilters: Record<string, string[]>;
  setFacets: (apiFacets: Record<string, Record<string, number>>) => void;
  toggleFilter: (facetName: string, value: string) => void;
  resetFilters: () => void;
  getSelectedFilters: () => Record<string, string[]>;
}

function createFilterStore() {
  return create<FilterState>((set, get) => ({
    priceRange: [0, 0],
    setPriceRange: (range: [number, number]) => set({ priceRange: range }),
    priceBounds: [0, 0],
    setPriceBounds: (bounds: [number, number]) => set({ priceBounds: bounds }),
    facets: {},
    selectedFilters: {},

    setFacets: (apiFacets) => {
      const currentFacets = get().facets;
      const updatedFacets: Facets = { ...currentFacets };

      for (const [facetName, values] of Object.entries(apiFacets)) {
        if (!values || typeof values !== 'object') continue;
        const existing = currentFacets[facetName] || [];

        const updatedFacetValues: FacetValue[] = Object.entries(values).map(([name, count]) => {
          const match = existing.find((item) => item.name === name);
          return {
            name,
            count,
            selected: match?.selected ?? false,
          };
        });

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
          .filter(f => f.selected)
          .map(f => f.name);

        return {
          facets: updatedFacets,
          selectedFilters: updatedSelectedFilters
        };
      });
    },

    resetFilters: () => {
      set((state) => {
        const resetFacets: Facets = {};
        const resetSelectedFilters: Record<string, string[]> = {};

        for (const [facetName, values] of Object.entries(state.facets)) {
          resetFacets[facetName] = values.map(value => ({
            ...value,
            selected: false,
          }));
          resetSelectedFilters[facetName] = [];
        }

        return {
          facets: resetFacets,
          selectedFilters: resetSelectedFilters
        };
      });
    },

    getSelectedFilters: () => {
      return get().selectedFilters;
    },
  }));
}

// 👇 Create two independent filter stores
export const useFilterStore = createFilterStore();           // For store listing
export const useProductFilterStore = createFilterStore();    // For product page
