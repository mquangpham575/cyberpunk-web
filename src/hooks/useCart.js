import { useState, useEffect, useMemo } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { INVENTORY_DATA } from "../data/inventoryData";

const useCart = (user) => {
  const [cart, setCart] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(0);

  // Restore non-serializable data (React icons) from static inventory
  const rehydrateCart = (rawItems) => {
    return rawItems.map((item) => {
      const original = INVENTORY_DATA.find((i) => i.id === item.id);
      return { ...item, icon: original ? original.icon : null };
    });
  };

  // Sync cart with Firestore (authenticated) or LocalStorage (guest)
  useEffect(() => {
    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      const unsubscribe = onSnapshot(cartRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const cloudItems = docSnapshot.data().items || [];
          setCart(rehydrateCart(cloudItems));
        } else {
          const localCart = localStorage.getItem("arasaka_cart_v1");
          if (!localCart) setCart([]);
        }
      });
      return () => unsubscribe();
    } else {
      try {
        const savedCart = localStorage.getItem("arasaka_cart_v1");
        if (savedCart) setCart(rehydrateCart(JSON.parse(savedCart)));
        else setCart([]);
      } catch (error) {
        setCart([]);
      }
    }
  }, [user]);

  // Persist cart state to the appropriate storage backend
  const saveCart = async (newCart) => {
    setCart(newCart);
    setLastUpdate(Date.now());

    // Sanitize data (remove icons) before storage
    const sanitizedCart = newCart.map(({ icon, ...rest }) => rest);

    if (user) {
      try {
        await setDoc(doc(db, "carts", user.uid), { items: sanitizedCart });
      } catch (error) {
        console.error("Firestore Save Error:", error);
      }
    } else {
      localStorage.setItem("arasaka_cart_v1", JSON.stringify(sanitizedCart));
    }
  };

  const addToCart = (item) => saveCart([...cart, item]);

  const removeFromCart = (indexToRemove) =>
    saveCart(cart.filter((_, index) => index !== indexToRemove));

  const clearCart = () => saveCart([]);

  // Calculate total value, ignoring invalid or unknown prices
  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (item.price === "???") return acc;
      const price = parseInt(item.price.replace(/,/g, ""), 10);
      return acc + (isNaN(price) ? 0 : price);
    }, 0);
  }, [cart]);

  return { cart, addToCart, removeFromCart, clearCart, total, lastUpdate };
};

export default useCart;
