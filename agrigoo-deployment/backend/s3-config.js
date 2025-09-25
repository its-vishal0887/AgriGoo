// Amazon S3 Configuration for Backend
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Upload file to S3
const uploadToS3 = async (fileBuffer, fileName, contentType) => {
  const key = `uploads/${Date.now()}-${fileName}`;
  
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return {
      url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('File upload failed');
  }
};

// Generate signed URL for temporary access
const getSignedFileUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  return getSignedUrl(s3Client, command, { expiresIn });
};

// Delete file from S3
const deleteFromS3 = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('File deletion failed');
  }
};

module.exports = {
  s3Client,
  uploadToS3,
  getSignedFileUrl,
  deleteFromS3
};