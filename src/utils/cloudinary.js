import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINSRY_CLOUD_NAME,
  api_key: process.env.CLOUDINSRY_API_KEY,
  api_secret: process.env.CLOUDINSRY_API_SECRET,
});

const uploadOnCloudinary = async (loaclFilePath) => {
  try {
    if (!loaclFilePath) return null;
    const response = await cloudinary.uploader.upload(loaclFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(loaclFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(loaclFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
