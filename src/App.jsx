// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useScroll, useTransform } from "framer-motion";

// Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./services/firebase.js";

// Hooks
import useCart from "./hooks/useCart";
import useAudio from "./hooks/useAudio";

// Components
import Scene3D from "./components/Scene3D.jsx";
import AIChat from "./components/AIChat";
import BackToTop from "./components/BackToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Routes
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { scrollY } = useScroll();
  const { isMuted, toggleAudio } = useAudio("/sounds/bgm.mp3");
  const [user, setUser] = useState(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Cart Logic
  const { cart, addToCart, removeFromCart, clearCart, total, lastUpdate } =
    useCart(user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Parallax Logic cho HomePage
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <Router>
      <div className="relative min-h-screen w-full bg-cyber-black overflow-x-hidden font-sans flex flex-col">
        {/* Background 3D */}
        <Scene3D scrollY={scrollY} />

        {/* Navigation */}
        <Header
          cart={cart}
          removeFromCart={removeFromCart}
          total={total}
          isMuted={isMuted}
          toggleAudio={toggleAudio}
          lastUpdate={lastUpdate}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 relative z-10">
          <AppRoutes
            cart={cart}
            total={total}
            addToCart={addToCart}
            clearCart={clearCart}
            user={user}
            setUser={setUser}
            scrollY={scrollY}
            yText={yText}
            opacityText={opacityText}
          />
        </main>

        {/* Widgets & Footer */}
        <AIChat />
        <BackToTop />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
