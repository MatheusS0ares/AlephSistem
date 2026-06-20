"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sde_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("sde_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("sde_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies e privacidade"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      style={{
        backgroundColor: "rgba(11,10,12,0.97)",
        borderTop: "1px solid rgba(110,16,35,0.4)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--color-ash)" }}>
          Usamos cookies para melhorar sua experiência e analisar o tráfego do site (LGPD).
          Ao continuar, você concorda com nossa política de privacidade.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-xs border transition-colors duration-200 hover:bg-white/5"
            style={{ borderColor: "rgba(140,128,137,0.3)", color: "var(--color-ash)" }}
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-xs font-semibold transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
