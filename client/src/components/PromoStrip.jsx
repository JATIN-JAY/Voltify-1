import React, { useState, useEffect } from "react";
import "./PromoStrip.css";

const PROMO_ITEMS = [
  "⚡ Free Express Delivery",
  "✦ 2K+ Premium Products",
  "✓ Verified Authentic Brands",
  "↩ 7-Day Easy Returns",
  "🔒 Secure Checkout",
  "✦ New Arrivals Weekly",
];

export default function PromoStrip({ variant = "dark" }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  // Double the items for seamless infinite scroll
  const duplicatedItems = [...PROMO_ITEMS, ...PROMO_ITEMS];

  return (
    <div className={`promo-strip promo-strip--${variant}`}>
      <div className="promo-strip__container">
        <div className="promo-strip__scroll">
          {duplicatedItems.map((item, idx) => (
            <div key={idx} className="promo-strip__item px-2 sm:px-0">
              <span className="text-xs sm:text-sm">{item}</span>
              {idx < duplicatedItems.length - 1 && (
                <span className="promo-strip__separator">·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
