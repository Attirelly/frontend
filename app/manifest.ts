import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Attirelly',
    short_name: 'Attirelly',
    description: 'Attirelly PWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}