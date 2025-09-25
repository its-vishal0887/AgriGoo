"""
File storage configuration for ML service
Supports both Cloudinary and Amazon S3
"""

import os
import boto3
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Determine which storage service to use
STORAGE_SERVICE = os.getenv("STORAGE_SERVICE", "cloudinary")  # Options: "cloudinary" or "s3"

# Cloudinary Configuration
if STORAGE_SERVICE == "cloudinary":
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )

    def upload_file(file_path, folder="agrigoo-ml"):
        """Upload a file to Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                file_path,
                folder=folder,
                resource_type="auto"
            )
            return {
                "url": result["secure_url"],
                "public_id": result["public_id"],
                "success": True
            }
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            return {"success": False, "error": str(e)}

# Amazon S3 Configuration
elif STORAGE_SERVICE == "s3":
    s3_client = boto3.client(
        's3',
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
    
    BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
    
    def upload_file(file_path, folder="agrigoo-ml"):
        """Upload a file to Amazon S3"""
        try:
            file_name = os.path.basename(file_path)
            key = f"{folder}/{file_name}"
            
            s3_client.upload_file(
                file_path, 
                BUCKET_NAME, 
                key
            )
            
            url = f"https://{BUCKET_NAME}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{key}"
            return {
                "url": url,
                "key": key,
                "success": True
            }
        except Exception as e:
            print(f"S3 upload error: {e}")
            return {"success": False, "error": str(e)}
else:
    raise ValueError(f"Unsupported storage service: {STORAGE_SERVICE}")