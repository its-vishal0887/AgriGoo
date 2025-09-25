// Cloudinary Configuration for Backend
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload middleware for Express
const uploadToCloudinary = async (file, folder = 'agrigoo-uploads') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('File upload failed');
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};