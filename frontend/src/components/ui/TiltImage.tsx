"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  children?: React.ReactNode;
}

/** Card media that tilts toward the cursor with a moving specular glare. */
export function TiltImage({ src, alt, className = "", imgClassName = "", children }: TiltImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, o: 0 });
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 150, damping: 18 });
  const sy = useSpring(my, { stiffness: 150, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [6, -6]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        mx.set(px);
        my.set(py);
        setGlare({ x: px * 100, y: py * 100, o: 1 });
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
        setGlare((g) => ({ ...g, o: 0 }));
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={`relative overflow-hidden ${className}`}
    >
      <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-out ${imgClassName}`} />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: glare.o * 0.5,
          background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(240,120,50,0.35), transparent 65%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
