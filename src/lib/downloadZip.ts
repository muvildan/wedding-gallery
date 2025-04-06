import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadImagesAsZip(
  images: { url: string; name: string }[]
) {
  const zip = new JSZip();

  for (const image of images) {
    try {
      const res = await fetch(image.url);
      if (!res.ok) {
        console.warn(`Failed to fetch ${image.url}`);
        continue;
      }

      const blob = await res.blob();
      zip.file(image.name || "image.jpg", blob);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "wedding-photos.zip");
}
