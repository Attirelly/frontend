'use client';
import { create } from 'zustand';

// Defines the state needed for our landing pages
type LandingState = {
  // For the FAQ accordion
  openFaqId: number | null;
  toggleFaq: (id: number) => void;

  // NEW: For the influencer tier slider
  activeInfluencerIndex: number;
  setActiveInfluencerIndex: (index: number) => void;
};

// Creates the store
export const useLandingStore = create<LandingState>((set) => ({
  // --- FAQ State ---
  openFaqId: 1, // Default the first FAQ to be open
  toggleFaq: (id) =>
    set((state) => ({
      openFaqId: state.openFaqId === id ? null : id,
    })),

  // --- NEW Influencer Slider State ---
  activeInfluencerIndex: 0, // Default to the first slide (Nano)
  setActiveInfluencerIndex: (index) => set({ activeInfluencerIndex: index }),
}));