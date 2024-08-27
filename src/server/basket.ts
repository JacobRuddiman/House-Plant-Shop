// /app/actions/basketActions.js
"use server";
import { cookies } from 'next/headers';

/**
 * Fetch the current basket from cookies.
 */
export async function getBasket() {
  const cookieStore = cookies();
  const basketCookie = cookieStore.get('basket');
  const basket = basketCookie ? JSON.parse(basketCookie.value) : [];
  return basket;
}

/**
 * Add an item to the basket and update cookies.
 * @param {Object} item - The item to add to the basket.
 */
export async function addToBasket(item) {
  const cookieStore = cookies();
  const basket = await getBasket();

  // Add the new item to the basket
  basket.push(item);

  // Update the basket cookie
  cookieStore.set('basket', JSON.stringify(basket), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return basket.length;
}

/**
 * Remove an item from the basket by ID and update cookies.
 * @param {number} itemId - The ID of the item to remove from the basket.
 */
export async function removeFromBasket(itemId) {
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

/**
 * Clear the entire basket and update cookies.
 */
export async function clearBasket() {
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
