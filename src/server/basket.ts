// /app/actions/basket.ts
"use server";
import { cookies } from 'next/headers';

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export async function getBasket(): Promise<Item[]> {
  const cookieStore = cookies();
  const basketCookie = cookieStore.get('basket');
  const basket = basketCookie ? JSON.parse(basketCookie.value) : [];
  return basket;
}

export async function addToBasket(item: Item): Promise<number> {
  const cookieStore = cookies();
  const basket = await getBasket();

  // Check if the item already exists in the basket
  const existingItemIndex = basket.findIndex(basketItem => basketItem.id === item.id);

  if (existingItemIndex !== -1) {
    // Instead of adding the quantity, replace the quantity with the new value
    basket[existingItemIndex].quantity = item.quantity;
  } else {
    // If the item does not exist, add it to the basket
    basket.push(item);
  }

  // Update the basket cookie
  cookieStore.set('basket', JSON.stringify(basket), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return basket.length;
}

export async function removeFromBasket(itemId: number): Promise<number> {
  const cookieStore = cookies();
  let basket = await getBasket();

  // Remove the item with the specified ID
  basket = basket.filter(item => item.id !== itemId);

  // Update the basket cookie
  cookieStore.set('basket', JSON.stringify(basket), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return basket.length;
}

export async function clearBasket(): Promise<number> {
  const cookieStore = cookies();

  // Clear the basket by setting an empty array
  cookieStore.set('basket', JSON.stringify([]), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return 0;
}
