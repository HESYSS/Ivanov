"use client";

import { motion, HTMLMotionProps } from "framer-motion";

type MotionButtonProps = HTMLMotionProps<"button">;

export function MotionButton({ children, ...props }: MotionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, translateY: -2 }}
      whileDrag={{ scale: 0.96 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
