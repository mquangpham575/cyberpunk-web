import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // Ẩn footer ở trang checkout và login
  if (["/checkout", "/login"].includes(location.pathname)) return null;

  return (
    <footer className="bg-black border-t border-white/10 py-8 text-center font-mono text-xs text-gray-600 relative z-50">
      <p>© 2077 ARASAKA CORP. ALL RIGHTS RESERVED.</p>
    </footer>
  );
};

export default Footer;
