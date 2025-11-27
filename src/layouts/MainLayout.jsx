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

  // Determine UI visibility based on current route
  const isCheckoutPage = location.pathname === "/checkout";

  return (
    // FIX 1: Thêm 'flex flex-col' để quản lý layout dọc chuẩn xác
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

      {/* Main Content Area (Nested Routes) */}
      {/* FIX 2: Thêm 'flex-1' để nội dung chính đẩy Footer xuống dưới cùng */}
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      {/* Global Widgets & Footer */}
      {!isCheckoutPage && (
        <>
          <AIChat />
          <BackToTop />
          {/* FIX 3: Tăng z-index lên z-50 để đảm bảo Footer luôn nổi lên trên các hiệu ứng 3D/Background */}
          <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600 relative">
            <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default MainLayout;
