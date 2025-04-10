import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define a type for the file object (adjust based on your file upload method)
interface UploadedFile {
    buffer: Buffer; // The file buffer
}

// Function to upload multiple images to Cloudinary
export const uploadImages = async (images: UploadedFile[]): Promise<string[]> => {
    const uploadPromises = images.map((image) => {
        return new Promise<string>((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
                { resource_type: 'image' }, // Optional: specify resource type
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    // Safely handle the result with a type check
                    if (result && result.secure_url) {
                        resolve(result.secure_url);
                    } else {
                        reject(new Error('Upload failed: No secure URL returned'));
                    }
                }
            ).end(image.buffer);
        });
    });

    return Promise.all(uploadPromises);
};