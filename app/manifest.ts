import type { MetadataRoute } from 'next'


/**
 * manifest 
 * 
 * Generates the `manifest.json` file for the Progressive Web App (PWA).
 * This file provides the browser with metadata about the application, enabling it to be
 * "installed" on a user's device and behave more like a native app.
 *
 * ## Purpose
 * The web app manifest is a crucial part of a PWA. It allows you to control how your app
 * appears to the user in areas where they would expect to see native applications (e.g.,
 * the mobile home screen), direct what the user can launch, and define its appearance at launch.
 *
 * ## Key Properties
 * - **name & short_name**: The full and short names of the application, used on the home screen and splash screen.
 * - **description**: A brief description of the application's purpose.
 * - **start_url**: The entry point of the application when launched from an installed icon.
 * - **display**: Set to `'standalone'` to make the app feel like a native application by hiding the browser UI.
 * - **background_color**: The color of the splash screen shown when the app is launching.
 * - **theme_color**: A hint for the user agent on what color to use for UI elements like the status bar or window chrome.
 * - **icons**: An array of application icons of different sizes, used in various contexts like the home screen, app launcher, etc.
 *
 * ## Imports
 * - **Types**:
 *    - `MetadataRoute` from `next`: Provides the TypeScript type for the manifest object.
 *
 * ## API Calls
 * - This file does not make any API calls.
 *
 * @returns {MetadataRoute.Manifest} A manifest object that Next.js will use to generate the static `manifest.json` file.
 */
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