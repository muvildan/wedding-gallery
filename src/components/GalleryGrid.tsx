import { useState, useEffect } from "react";
import { ImageCard } from "./ImageCard";
import {
  getCloudinaryImageUrl,
  getCloudinaryDownloadUrl,
} from "../lib/cloudinary";
import { Button } from "./ui/button";
import { downloadImagesAsZip } from "../lib/downloadZip";

interface ImageInfo {
  publicId: string;
  id: number;
}

export function GalleryGrid() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  /*
   * Logics to get the images
   */
  useEffect(() => {
    fetch("http://localhost:4000/api/images")
      .then((res) => res.json())
      .then((data: { publicId: string }[]) => {
        const enriched = data.map((img, index) => ({
          id: index + 1,
          ...img,
        }));
        setImages(enriched);
      })
      .catch((err) => console.error("Failed to fetch images", err));
  }, []);

  /*
   * Logics to select images
   */
  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedImages = images.filter((img) => selected.includes(img.id));

  /*
   * Logics to download images
   */
  // const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
  // const downloadIndividually = async (images: { publicId: string }[]) => {
  //   for (const img of images) {
  //     const link = document.createElement("a");
  //     link.href = getCloudinaryDownloadUrl(img.publicId);
  //     link.download = img.publicId.split("/").pop() || "photo.jpg";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     await sleep(200);
  //   }
  // };

  // const handleDownload = async () => {
  //   // Download all imgs in a ZIP file
  //   if (selectedImages.length <= 0) {
  //     const confirmed = window.confirm(
  //       `This will download ${images.length} photos in a single ZIP file. Continue?`
  //     );
  //     if (confirmed) {
  //       const link = document.createElement("a");
  //       link.href = "/boda-carlos-daniel.zip";
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   }

  //   // Download one image directly to your device
  //   else if (selectedImages.length === 1) {
  //     const img = selectedImages[0];
  //     const link = document.createElement("a");
  //     link.href = getCloudinaryDownloadUrl(img.publicId);
  //     link.download = img.publicId.split("/").pop() || "photo.jpg";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }

  //   // Decide whether to download directly or in a zip file for an up to 10 photos
  //   else if (selectedImages.length <= 10) {
  //     const confirmDirect = window.confirm(
  //       `Download ${selectedImages.length} images individually?\nClick Cancel to download as a ZIP file.`
  //     );
  //     if (confirmDirect) {
  //       await downloadIndividually(selectedImages);
  //     } else {
  //       await downloadImagesAsZip(
  //         selectedImages.map((img) => ({
  //           url: getCloudinaryDownloadUrl(img.publicId),
  //           name: `${img.publicId.split("/").pop()}.jpg`,
  //         }))
  //       );
  //     }
  //   }

  //   // For more than 10 photos, always download in ZIP file
  //   else {
  //     await downloadImagesAsZip(
  //       selectedImages.map((img) => ({
  //         url: getCloudinaryDownloadUrl(img.publicId),
  //         name: `${img.publicId.split("/").pop()}.jpg`,
  //       }))
  //     );
  //   }
  // };

  const handleDownload = async () => {
    if (selectedImages.length === 1) {
      const img = selectedImages[0];
      const link = document.createElement("a");
      link.href = getCloudinaryDownloadUrl(img.publicId);
      link.download = img.publicId.split("/").pop() || "photo.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (selectedImages.length <= 5) {
      const confirmDirect = window.confirm(
        `Download ${selectedImages.length} images individually?\nClick Cancel to download as a ZIP file.`
      );
      if (confirmDirect) {
        for (const img of selectedImages) {
          const link = document.createElement("a");
          link.href = getCloudinaryDownloadUrl(img.publicId);
          link.download = img.publicId.split("/").pop() || "photo.jpg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          await new Promise((r) => setTimeout(r, 200));
        }
      } else {
        await downloadImagesAsZip(
          selectedImages.map((img) => ({
            url: getCloudinaryDownloadUrl(img.publicId),
            name: `${img.publicId.split("/").pop()}.jpg`,
          }))
        );
      }
    } else {
      await downloadImagesAsZip(
        selectedImages.map((img) => ({
          url: getCloudinaryDownloadUrl(img.publicId),
          name: `${img.publicId.split("/").pop()}.jpg`,
        }))
      );
    }
  };

  /*
   * Render
   */
  return (
    <div className="relative">
      {selected.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <Button onClick={handleDownload}>
            Descargar {selected.length} foto{selected.length > 1 ? "s" : ""}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {images.map((img) => (
          <ImageCard
            key={img.id}
            src={getCloudinaryImageUrl(img.publicId)}
            alt={img.publicId}
            selected={selected.includes(img.id)}
            onSelect={() => toggleSelection(img.id)}
          />
        ))}
      </div>

      <Button
        className={`fixed left-1/2 z-50 transform -translate-x-1/2 ${
          selected.length <= 0 ? "bottom-4" : "bottom-20"
        }`}
        variant="outline"
        onClick={handleDownload}
      >
        Descargar imágenes como ZIP
      </Button>
    </div>
  );
}
