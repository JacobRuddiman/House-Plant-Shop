"use server";

import prisma from '../lib/prisma';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';




export async function createImage(formData: FormData) {
  try {
    const file = formData.get('image') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      throw new Error('No file uploaded');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);



    // Upload the image to Cloudinary
    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'your_folder_name' }, // Specify a folder in Cloudinary
        (error: UploadApiErrorResponse | null, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );
      uploadStream.end(buffer);
    });

    // Get the URL of the uploaded image
    const url = uploadResult.secure_url;

    // Insert the image URL into the database
    const newImage = await prisma.image.create({
      data: {
        url,
      },
    });

    return { newImage };
  } catch (error) {
    console.error('Failed to create image', error);
    throw new Error('Failed to create image');
  }
}


interface UpdateImagePlantIdInput {
  imageId: number;
  plantId: number;
}

export async function updateImagePlantId({ imageId, plantId }: UpdateImagePlantIdInput) {
  try {
    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: { plantId },
    });
    return { updatedImage };
  } catch (error) {
    console.error('Failed to update image with plant ID', error);
    throw new Error('Failed to update image with plant ID');
  }
}

export async function deleteImage(id: number) {
  try {
    // Fetch the image URL from the database to get the public_id
    const image = await prisma.image.findUnique({ where: { id } });

    if (image) {
      // Extract the public_id from the Cloudinary URL (assuming it's stored)
      const publicId = image.url.split('/').slice(-1)[0].split('.')[0];

      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Delete the image record from the database
      await prisma.image.delete({ where: { id } });

      return { message: 'Image deleted successfully' };
    } else {
      throw new Error('Image not found');
    }
  } catch (error) {
    console.error('Failed to delete image', error);
    throw new Error('Failed to delete image');
  }
}

export async function getImages() {
  try {
    const images = await prisma.image.findMany();
    return { images };
  } catch (error) {
    return { error: 'Failed to fetch images' };
  }
}



export async function syncDatabaseWithCloudinary() {
  try {
    // Get all images from Cloudinary
    const cloudinaryResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'your_folder_name/', // Adjust based on your folder structure
    });

    const cloudinaryUrls = cloudinaryResult.resources.map((resource) => resource.secure_url);

    // Get all images from your database
    const databaseImages = await prisma.image.findMany();

    // Find images in the database that no longer exist on Cloudinary
    const imagesToDelete = databaseImages.filter((dbImage) => !cloudinaryUrls.includes(dbImage.url));

    // Delete these images from the database
    for (const image of imagesToDelete) {
      await prisma.image.delete({
        where: { id: image.id },
      });
      console.log(`Deleted image ${image.id} from database`);
    }

    return { message: 'Database synced with Cloudinary' };
  } catch (error) {
    console.error('Failed to sync database with Cloudinary', error);
    throw new Error('Failed to sync database with Cloudinary');
  }
}