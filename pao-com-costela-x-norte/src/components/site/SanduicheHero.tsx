"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SanduicheHero() {
  return (
    <div className="mt-16 sm:mt-20 flex justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Glow de fundo */}
        <div className="absolute inset-0 bg-brasa/25 blur-[100px] rounded-full mix-blend-screen -z-10" />

        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-[2.5rem] overflow-hidden borda-fina shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_0_60px_-15px_var(--color-brasa)]"
          style={{ aspectRatio: "4/5" }}
        >
          <Image
            src="/fotos-landing/IMG_3467.jpeg"
            alt="Pão com costela X Norte, servido com vinagrete"
            fill
            priority
            sizes="(max-width: 640px) 90vw, 420px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noite/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </motion.div>
    </div>
  );
}
