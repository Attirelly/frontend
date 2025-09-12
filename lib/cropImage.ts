import { Area } from "react-easy-crop";

/**
 * getCroppedImg component
 * 
 * A client-side utility function that takes an image source and cropping dimensions,
 * and returns a `Promise` that resolves to a `Blob` of the cropped image.
 * This function uses the browser's Canvas API to perform the image manipulation.
 *
 * ## Features
 * - **Asynchronous Cropping**: Handles the asynchronous nature of image loading by returning a Promise.
 * - **Uses Canvas API**: Leverages the native browser Canvas API for efficient, client-side image processing.
 * - **CORS Handling**: Sets `crossOrigin="anonymous"` on the image element to allow cropping of images hosted on different domains (e.g., a CDN or S3).
 * - **Quality Control**: Allows specifying the quality of the output JPEG image.
 *
 * ## Logic Flow
 * 1.  The function creates a new `Promise`.
 * 2.  An `Image` object is created in memory, and its `src` is set to the provided `imageSrc` to begin loading.
 * 3.  Once the image successfully loads, the `onload` callback is executed.
 * 4.  A new `<canvas>` element is created with the exact dimensions of the desired crop area.
 * 5.  The `drawImage` method is used to "paint" only the specified rectangular portion of the source image onto the canvas.
 * 6.  The `canvas.toBlob()` method is then called to convert the canvas content into a JPEG `Blob` with the specified quality.
 * 7.  If the blob is created successfully, the promise is resolved with the blob. Otherwise, it's rejected.
 * 8.  If the initial image fails to load, the promise is rejected.
 *
 * ## Imports
 * - **Types**:
 *    - `Area` from `react-easy-crop`: Provides the TypeScript type for the crop dimensions object.
 *
 * ## Parameters
 * @param {string} imageSrc - The URL of the source image to be cropped.
 * @param {Area} crop - An object from `react-easy-crop` specifying the x, y, width, and height of the crop area in pixels.
 * @param {number} [quality=0.7] - A number between 0 and 1 indicating the quality of the output JPEG image.
 *
 * @returns {Promise<Blob>} A promise that resolves with the cropped image as a `Blob`, or rejects with an error.
 */
export default function getCroppedImg(
  imageSrc: string,
  crop: Area,
  quality: number = 0.7,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject(new Error("No canvas context"));

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to crop image"));
      }, "image/jpeg", quality);
    };
    image.onerror = reject;
  });
}
