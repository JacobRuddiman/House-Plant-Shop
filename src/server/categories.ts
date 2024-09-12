"use server";

import prisma from '../lib/prisma';

interface CreateCategoryInput {
  name: string;
}

export async function getCategories() {
  try {
    const categories = await prisma.plantCategory.findMany({
      orderBy: { name: 'asc' }, // Optional: Sort categories alphabetically
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: 'Failed to fetch categories' };
  }
}

export async function createCategory(data: CreateCategoryInput) {
  try {
    const newCategory = await prisma.plantCategory.create({
      data: { name: data.name },
    });
    return { newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: 'Failed to create category' };
  }
}

export async function updateCategory(id: number, data: CreateCategoryInput) {
  try {
    const updatedCategory = await prisma.plantCategory.update({
      where: { id },
      data: { name: data.name },
    });
    return { updatedCategory };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.plantCategory.delete({
      where: { id },
    });
    return { message: 'Category deleted successfully' };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: 'Failed to delete category' };
  }
}
