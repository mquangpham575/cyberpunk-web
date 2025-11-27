import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import AIChat from "../components/AIChat";
import BackToTop from "../components/BackToTop";

const MainLayout = ({
  cart,
  removeFromCart,
  total,
  isMuted,
  toggleAudio,
  lastUpdate,
  user,
  onOpenAuth,
  onLogout,
  onNavigate,
}) => {
  const location = useLocation();

  // Route-based visibility logic
  const isCheckoutPage = location.pathname === "/checkout";

  return (
    // Layout: Flex column structure for sticky footer support
    <div className="relative min-h-screen w-full bg-transparent font-sans flex flex-col">
      {/* Header Section */}
      {!isCheckoutPage && (
        <Header
          cart={cart}
          removeFromCart={removeFromCart}
          total={total}
          isMuted={isMuted}
          toggleAudio={toggleAudio}
          lastUpdate={lastUpdate}
          user={user}
          onOpenAuth={onOpenAuth}
          onLogout={onLogout}
          // Navigation callbacks
          onCheckout={() => onNavigate("/checkout")}
          onOpenMissions={() => onNavigate("/missions")}
        />
      )}

      {/* Main Content: Flex-1 expands to fill available space */}
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      {/* Global Widgets & Footer */}
      {!isCheckoutPage && (
        <>
          <AIChat />
          <BackToTop />
          {/* Footer */}
          <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600 relative z-50">
            <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default MainLayout;
