import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header"; // Đảm bảo bạn đã có file Header (tách từ App cũ)
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
  onNavigate, // Hàm điều hướng truyền xuống Header
}) => {
  const location = useLocation();

  // Ẩn Header nếu đang ở trang checkout (tùy chọn)
  const showHeader = location.pathname !== "/checkout";

  return (
    <div className="relative min-h-screen w-full bg-transparent font-sans">
      {showHeader && (
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
          // Truyền các sự kiện điều hướng cho Header
          onCheckout={() => onNavigate("/checkout")}
          onOpenMissions={() => onNavigate("/missions")}
        />
      )}

      {/* Nơi nội dung các trang con (Home, Missions) hiển thị */}
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Các tiện ích cố định */}
      {location.pathname !== "/checkout" && (
        <>
          <AIChat />
          <BackToTop />
          <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600 relative z-10">
            <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default MainLayout;
