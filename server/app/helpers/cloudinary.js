const cloudinary = require("cloudinary").v2;
const env = require("dotenv");
const fs = require("fs");
env.config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadFile = async (localfilePath) => {
  if (!localfilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localfilePath);
    return {
      publicId: response.public_id,
      url: response.secure_url,
    };
  } catch (error) {
    fs.unlinkSync(localfilePath);
    return null;
  }
};

const uploadVideos = async (localfilePath) => {
  if (!localfilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "video",
    });
    fs.unlinkSync(localfilePath);
    return {
      public_id: response.public_id,
      url: response.secure_url,
      duration: response.duration,
    };
  } catch (error) {
    fs.unlinkSync(localfilePath);
    return null;
  }
};

const deleteImage = async (publicId) => {
  if (!publicId) return null;
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    return null;
  }
};

const deleteVideo = async (publicId) => {
  if (!publicId) return null;
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return response;
  } catch (error) {
    return null;
  }
};

module.exports = {
  uploadFile,
  uploadVideos,
  deleteImage,
  deleteVideo,
};
