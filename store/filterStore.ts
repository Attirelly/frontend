import { create } from "zustand";

/**
 * @typedef {object} FacetValue
 * @description Represents a single selectable value within a filter category (facet).
 * @property {string} name - The display name of the filter value (e.g., "Red", "Large").
 * @property {number} count - The number of results that match this filter value.
 * @property {boolean} selected - Whether this filter value is currently selected by the user.
 */
type FacetValue = {
  name: string;
  count: number;
  selected: boolean;
};

/**
 * @typedef {object} Facets
 * @description A record object where each key is a facet name (e.g., "color", "size") and the value is an array of possible `FacetValue` objects. This structure holds the complete state needed to render the filter UI.
 */
type Facets = Record<string, FacetValue[]>;
/**
 * @interface FilterState
 * @description Defines the complete shape of the state and actions for a filter store.
 */
interface FilterState {
  /**
   * @property {string | null} activeFacet - The name of the facet that the user last interacted with. This is sent to the backend to get more accurate result counts for other facets while keeping the active one stable.
   */
  activeFacet: string | null;
  /**
   * @property {number} results - The total number of results found for the current filter query.
   */
  results: number;
  /**
   * @action setResults - Sets the total number of results.
   * @param {number} results - The total count of items.
   */
  setResults: (results: number) => void;
  /**
   * @property {boolean} isResultsLoading - A flag to indicate if the main content (products/stores) is currently being fetched.
   */

  isResultsLoading: boolean;
  /**
   * @action setIsResultsLoading - Sets the loading state for the main content.
   * @param {boolean} isResultsLoading - The new loading state.
   */
  setIsResultsLoading: (isResultsLoading: boolean) => void;
  /**
   * @property {[number, number] | null} selectedPriceRange - The currently selected price range [min, max]. `null` if no range is selected.
   */
  selectedPriceRange: [number, number] | null;
  /**
   * @action setPriceRange - Sets the selected price range.
   * @param {[number, number]} range - The new [min, max] price range.
   */
  setPriceRange: (range: [number, number]) => void;
  /**
   * @property {[number, number]} priceBounds - The absolute minimum and maximum possible prices [min, max], used to define the limits of a price slider.
   */
  priceBounds: [number, number];
  /**
   * @action setPriceBounds - Sets the absolute min/max price bounds.
   * @param {[number, number]} bounds - The new [min, max] bounds.
   */
  setPriceBounds: (bounds: [number, number]) => void;
  /**
   * @property {boolean} facetInit - A flag to indicate if the facets have been initialized with data from the API.
   */
  facetInit: boolean;
  /**
   * @action setFacetInit - Sets the facet initialization status.
   * @param {boolean} loading - The new initialization state.
   */
  setFacetInit: (loading: boolean) => void;
  /**
   * @property {Facets} facets - The main object holding all filter categories and their values, including counts and selection status for rendering the UI.
   */
  facets: Facets;
  /**
   * @property {Record<string, string[]>} selectedFilters - A simplified map of selected filters, where each key is a facet name and the value is an array of selected value names. This is optimized for sending to the backend API.
   */
  selectedFilters: Record<string, string[]>;
  /**
   * @action setFacets - Intelligently merges new facet data from an API response with the existing state, preserving the `selected` status of items.
   * @param {Record<string, Record<string, number>>} apiFacets - The raw facet data from the API.
   * @param {string | null} activeFacet - The name of the facet the user is currently interacting with.
   */
  setFacets: (
    apiFacets: Record<string, Record<string, number>>,
    activeFacet: string | null
  ) => void;
  /**
   * @action toggleFilter - Toggles the selection state of a specific filter value. It updates both the `facets` (for UI) and `selectedFilters` (for API) states.
   * @param {string} facetName - The name of the facet to modify (e.g., "color").
   * @param {string} value - The name of the value to toggle (e.g., "Red").
   */
  toggleFilter: (facetName: string, value: string) => void;
  /**
   * @action resetFilters - Clears all selected filters and resets the price range to its default state.
   */
  resetFilters: () => void;
  /**
   * @action getSelectedFilters - A getter function to retrieve the current `selectedFilters` object.
   * @returns {Record<string, string[]>} The simplified map of selected filters.
   */
  getSelectedFilters: () => Record<string, string[]>;
  /**
   * @action initializeFilters - Hydrates the store with an initial state, typically from URL search parameters on page load.
   * @param {object} initialState - The initial state object.
   * @param {Record<string, string[]>} [initialState.selectedFilters] - The initial set of selected filters.
   * @param {[number, number] | null} [initialState.priceRange] - The initial price range.
   */
  initializeFilters: (initialState: {
    selectedFilters?: Record<string, string[]>;
    priceRange?: [number, number] | null;
  }) => void;
}

/**
 * A factory function to create a reusable Zustand store for managing filter state.
 *
 * This function encapsulates all the logic for handling complex filter interactions, including
 * facet updates, selection toggling, and state hydration. By exporting a factory, we can create
 * multiple independent instances of this store (e.g., one for store filtering, one for product filtering)
 * that share the same logic but maintain separate states.
 *
 * @returns {import('zustand').UseBoundStore<import('zustand').StoreApi<FilterState>>} A new Zustand store instance.
 */
function createFilterStore() {
  return create<FilterState>((set, get) => ({
    activeFacet: null,
    setActiveFacet: (facet: string | null) => set({ activeFacet: facet }),
    results: 0,
    setResults: (results: number) => set({ results }),
    isResultsLoading: true,
    setIsResultsLoading: (loading: boolean) =>
      set({ isResultsLoading: loading }),
    selectedPriceRange: null,
    setPriceRange: (range) => set({ selectedPriceRange: range }),
    priceBounds: [0, 100000],
    setPriceBounds: (bounds: [number, number]) => set({ priceBounds: bounds }),
    facetInit: false,
    setFacetInit: (loading: boolean) => set({ facetInit: loading }),
    facets: {},
    selectedFilters: {},

    /**
     * Hydrates the store with an initial state, usually from URL parameters.
     * It syncs both the `selectedFilters` object and the `selected` property within the main `facets` object.
     */
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
        selectedPriceRange: initialState.priceRange || null,
      });
    },
    /**
     * Intelligently merges new facet data from an API response into the existing state.
     * It updates counts for all values but preserves the user's existing selections.
     */
    setFacets: (apiFacets, activeFacet) => {
      const currentFacets = get().facets;

      const updatedFacets: Facets = { ...currentFacets };

      for (const [facetName, values] of Object.entries(apiFacets)) {
        if (!values || typeof values !== "object") continue;
        // This is a key optimization: if a facet is "active" (being interacted with),
        // we don't update its counts from the API. This prevents the counts from flickering
        // while the user is selecting items within that facet.
        if (
          activeFacet &&
          facetName.toLowerCase() === activeFacet?.toLowerCase() &&
          get().selectedFilters[activeFacet]?.length > 0
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

    /**
     * Toggles the selection of a single filter option.
     * This action is the primary way users interact with the filters.
     */
    toggleFilter: (facetName, value) => {
      set((state) => {
        const updatedFacets = { ...state.facets };
        const updatedSelectedFilters = { ...state.selectedFilters };

         // 1. Update the `selected` boolean in the main `facets` object for the UI.
        updatedFacets[facetName] = updatedFacets[facetName].map((facet) => {
          if (facet.name === value) {
            return { ...facet, selected: !facet.selected };
          }
          return facet;
        });
         
        // 2. Re-create the simplified `selectedFilters` array from the updated `facets` object.
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

    /**
     * Clears all active filters and resets the price range.
     */
    resetFilters: () => {
      set((state) => {
        const resetFacets: Facets = {};
        const resetSelectedFilters: Record<string, string[]> = {};
        // Iterate through all facets and set the `selected` property of each value to false.
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
          activeFacet: null,
        };
      });
    },

    /**
     * A simple getter to retrieve the simplified `selectedFilters` object.
     */
    getSelectedFilters: () => {
      return get().selectedFilters;
    },
  }));
}

// Create and export a dedicated instance of the filter store for store listings.
export const useFilterStore = createFilterStore();
// Create and export a separate, independent instance for the product page.
export const useProductFilterStore = createFilterStore();
