import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface CloudinaryImage {
  public_id: string;
  [key: string]: unknown;
}

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());

app.get("/api/images", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "wedding/",
      max_results: 20,
    });

    const images = result.resources.map((img: CloudinaryImage) => ({
      publicId: img.public_id,
    }));

    res.json(images);
  } catch (err) {
    console.error("Cloudinary error:", err);
    res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
