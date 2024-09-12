export interface Image {
    id: number;
    url: string;
    plantId: number;
}

export interface PlantData {
id: number;  // Add 'id' since it's part of the returned data
scientificName: string;
commonName: string;
genus: string;
species: string;
description: string;
price: number;
discountPrice: number;
count: number;
rating: number;
isDiscounted: boolean;
imageUrl: string;  // Add imageUrl since it's part of the returned data
images: Image[];  // Add images since they're part of the returned data
categoryId: number | null;
}

export type Category = {
    id: number;
    name: string;
};