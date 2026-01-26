"use client";

import { motion, HTMLMotionProps } from "framer-motion";

type MotionButtonProps = HTMLMotionProps<"button">;

export function MotionButton({ children, ...props }: MotionButtonProps) {
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
