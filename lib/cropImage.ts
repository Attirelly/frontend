import { Area } from "react-easy-crop";

export default function getCroppedImg(
  imageSrc: string,
  crop: Area,
  quality: number = 0.7
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
