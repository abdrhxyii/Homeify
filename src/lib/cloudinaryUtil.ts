import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadedFile {
    buffer: Buffer;
}

export const uploadImages = async (images: UploadedFile[]): Promise<string[]> => {
    if (!images || images.length === 0) {
        throw new Error('No images provided for upload');
    }

    const uploadPromises = images.map(async (image, index) => {
        if (!image.buffer || image.buffer.length === 0) {
            throw new Error(`Invalid or empty buffer for image at index ${index}`);
        }

        return new Promise<string>((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'properties',
                },
                (error, result) => {
                    if (error) {
                        return reject(new Error(`Failed to upload image ${index}: ${error.message}`));
                    }
                    if (result && result.secure_url) {
                        resolve(result.secure_url);
                    } else {
                        reject(new Error(`Upload failed for image ${index}: No secure URL returned`));
                    }
                }
            ).end(image.buffer);
        });
    });

    return Promise.all(uploadPromises);
};