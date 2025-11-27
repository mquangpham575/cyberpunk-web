import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Page Imports
import HomePage from "../pages/HomePage";
import MissionPage from "../pages/MissionPage";
import CheckoutPage from "../pages/CheckoutPage";
import LoginPage from "../pages/LoginPage";
import ArsenalPage from "../pages/ArsenalPage";
import UserInfoPage from "../pages/UserInfoPage";

const AppRoutes = ({
  cart,
  total,
  addToCart,
  clearCart,
  user,
  setUser,
  scrollY,
  yText,
  opacityText,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <HomePage
              scrollY={scrollY}
              yText={yText}
              opacityText={opacityText}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/market" element={<ArsenalPage addToCart={addToCart} />} />
        <Route path="/missions" element={<MissionPage />} />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cart={cart}
              total={total}
              onClearCart={clearCart}
              user={user}
            />
          }
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route
          path="/profile"
          element={<UserInfoPage user={user} onLogout={() => auth.signOut()} />}
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
