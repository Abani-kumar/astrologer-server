import { v2 as cloudinary } from "cloudinary";
const uploadImage = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  const filePath = file.tempFilePath || file.data;

  try {
    return await cloudinary.uploader.upload(filePath, options);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadImage;
