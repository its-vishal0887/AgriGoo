// Cloudinary Configuration for Frontend
// Import this file where image uploads are handled

const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  folder: 'agrigoo-uploads',
  resourceType: 'image',
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
  maxFileSize: 10000000, // 10MB
  transformation: [
    { width: 1000, crop: 'limit' },
    { quality: 'auto' }
  ]
};

export default cloudinaryConfig;