"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

export function MotionButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileDrag={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
