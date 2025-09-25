'use client'
import { create } from 'zustand'
import {Profile, Media} from '@/types/creatorTypes';

type CreatorState = {
    mediaInsights : Media[],
    setMediaInsights : (media : Media[]) => void,
}

export const useCreatorStore = create<CreatorState>((set) => ({
   mediaInsights: [],
   setMediaInsights : (media) => set({mediaInsights : media})

}))