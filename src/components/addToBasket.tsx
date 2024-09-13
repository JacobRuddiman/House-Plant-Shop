'use client';

import React, { useEffect, useState, useContext } from 'react';
import { BasketContext } from '@/context/basketContext';

interface AddToBasketProps {
  plantId: number;
  name: string;
  price: number;
  initialQuantity?: number; // Optional initialQuantity for basket page
}

const AddToBasket: React.FC<AddToBasketProps> = ({ plantId, name, price, initialQuantity = 1 }) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(initialQuantity); // Use initialQuantity prop
  const { basket, addToBasket, removeFromBasket } = useContext(BasketContext); // Use BasketContext
  const [inBasket, setInBasket] = useState<boolean>(false);

  // Check if the plant is already in the basket when the component loads
  useEffect(() => {
    const plantInBasket = basket.find(item => item.id === plantId);

    if (plantInBasket) {
      setQuantity(plantInBasket.quantity);
      setInBasket(true);
    } else {
      setInBasket(false);
      setQuantity(initialQuantity); // Reset quantity if not in basket
    }
  }, [basket, plantId, initialQuantity]);

  const handleAddToBasket = async () => {
    setLoading(true);
    try {
      await addToBasket({
        id: plantId,
        name: name,
        price: price,
        quantity: quantity,
      });
      setInBasket(true);
    } catch (error) {
      console.error('Error adding item to basket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromBasket = async () => {
    setLoading(true);
    try {
      await removeFromBasket(plantId);
      setQuantity(1); // Reset quantity
      setInBasket(false);
    } catch (error) {
      console.error('Error removing item from basket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveFromBasket();
    } else {
      setLoading(true);
      try {
        setQuantity(newQuantity);
        await addToBasket({
          id: plantId,
          name: name,
          price: price,
          quantity: newQuantity,
        });
      } catch (error) {
        console.error('Error updating quantity in basket:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {inBasket ? (
        // Quantity selector and remove button if item is in basket
        <>
          <div className="flex items-center">
            <button
              className="btn btn-secondary w-8 h-8" // Set button width and height to make narrower
              disabled={quantity <= 1 || loading}
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              -
            </button>
            <input
              type="number"
              className="input input-bordered w-12 text-center no-arrows" // Adjusted input width
              value={quantity}
              readOnly // Prevent typing in the input box
            />
            <button
              className="btn btn-secondary w-8 h-8" // Set button width and height to make narrower
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={loading}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-error"
            onClick={handleRemoveFromBasket}
            disabled={loading}
          >
            Remove from Basket
          </button>
        </>
      ) : (
        // Add to basket button if item is not in basket
        <button
          onClick={handleAddToBasket}
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add to Basket'}
        </button>
      )}
    </div>
  );
};

export default AddToBasket;
