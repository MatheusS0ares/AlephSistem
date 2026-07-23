"use client";

import { motion } from "framer-motion";

export default function SanduicheHero() {
  return (
    <div className="mt-20 sm:mt-24 flex justify-center pointer-events-none perspective-[1000px]" aria-hidden="true">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative flex flex-col items-center w-64 h-48"
      >
        {/* Glow de fundo */}
        <div className="absolute inset-0 bg-brasa/20 blur-[80px] rounded-full mix-blend-screen" />

        {/* Pão Superior */}
        <motion.div
          animate={{ y: [-5, 5, -5], rotate: [0, -1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 w-48 sm:w-56 h-12 rounded-t-[2.5rem] rounded-b-lg shadow-[0_10px_30px_rgba(255,184,0,0.2)]"
          style={{
            background: "linear-gradient(145deg, rgba(255,184,0,0.9) 0%, rgba(255,184,0,0.2) 100%)",
            borderTop: "2px solid rgba(255,255,255,0.4)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
          }}
        />

        {/* Molho / Complemento */}
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [-2, 1, -2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="absolute top-10 w-52 sm:w-64 h-6 rounded-full shadow-[0_5px_20px_rgba(0,119,255,0.3)] z-10"
          style={{
            background: "linear-gradient(145deg, rgba(0,119,255,0.8) 0%, rgba(0,119,255,0.1) 100%)",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Carne (Costela) */}
        <motion.div
          animate={{ y: [2, -2, 2], rotate: [1, -1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute top-14 w-56 sm:w-64 h-16 rounded-2xl shadow-[0_0_60px_-10px_var(--color-brasa)] z-20"
          style={{
            background: "linear-gradient(145deg, var(--color-brasa) 0%, rgba(255,115,0,0.5) 100%)",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            borderBottom: "2px solid rgba(0,0,0,0.4)",
            backdropFilter: "blur(16px)",
          }}
        />

        {/* Pão Inferior */}
        <motion.div
          animate={{ y: [5, -1, 5], rotate: [0, 1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          className="absolute top-[6.5rem] w-48 sm:w-56 h-10 rounded-b-[2rem] rounded-t-lg shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-0"
          style={{
            background: "linear-gradient(145deg, rgba(251,251,251,0.6) 0%, rgba(251,251,251,0.05) 100%)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
          }}
        />
      </motion.div>
    </div>
  );
}
