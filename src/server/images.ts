"use server";

import prisma from '../lib/prisma';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

async function saveFileToDisk(file: Buffer, filePath: string) {
  fs.writeFileSync(filePath, file);
}

interface CreateImageInput {
  formData: FormData;
}

export async function createImage(formData: FormData) {
  try {
    const file = formData.get('image') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      throw new Error('No file uploaded');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define the directory and file path
    const directory = path.join(process.cwd(), 'public', 'images');
    const fileName = `${uuidv4()}${path.extname(filename)}`;
    const filePath = path.join(directory, fileName);

    // Ensure the directory exists
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Save the file to disk
    await saveFileToDisk(buffer, filePath);

    // Create the URL
    const url = `/images/${fileName}`;

    // Insert into the database
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
    await prisma.image.delete({
      where: { id },
    });
    return { message: 'Image deleted successfully' };
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