const CLOUDINARY_BASE = "https://res.cloudinary.com";
const CLOUD_NAME = "danvilmu";

export function getCloudinaryImageUrl(publicId: string, width = 1200) {
  return `${CLOUDINARY_BASE}/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicId}`;
}

export function getCloudinaryDownloadUrl(publicId: string, width = 1200) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/fl_attachment/${publicId}`;
}
